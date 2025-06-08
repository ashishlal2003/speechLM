from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from langgraph.graph import START, StateGraph, MessagesState
from langgraph.prebuilt import tools_condition, ToolNode
from services.LLM.prompts import system_prompt
from services.LLM.tools import multiplication, get_weather

def make_assistant_node(model, system_prompt):
    sys_msg = SystemMessage(content=system_prompt)

    def assistant(state: MessagesState):
        return {
            "messages": [model.invoke([sys_msg] + state["messages"])]
        }

    return assistant

tools = [multiplication, get_weather]

def ai_response(model, user_input, history_db, user_id):
    past_messages = history_db.get_conversation(user_id)
    state = {"messages": []}
    for message in past_messages:
        state["messages"].append(HumanMessage(content=message["user_input"]))
        state["messages"].append(AIMessage(content=message["ai_response"]))

    state["messages"].append(HumanMessage(content=user_input))

    assistant_node = make_assistant_node(model, system_prompt)

    builder = StateGraph(MessagesState)
    builder.add_node("assistant", assistant_node)
    builder.add_node("tools", ToolNode(tools))
    builder.add_edge(START, "assistant")
    builder.add_conditional_edges("assistant", tools_condition)
    builder.add_edge("tools", "assistant")
    graph = builder.compile()

    output_state = graph.invoke(state)
    assistant_reply = output_state["messages"][-1].content

    history_db.save_message(user_id, user_input, assistant_reply)

    return assistant_reply
