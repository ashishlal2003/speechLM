from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from langgraph.graph import START, END, StateGraph, MessagesState
from langgraph.prebuilt import tools_condition, ToolNode
from services.LLM.prompts.general_prompt import general_system_prompt
from services.LLM.prompts.research_prompt import research_system_prompt
from services.LLM.prompts.shopping_prompt import shopping_system_prompt
from services.LLM.prompts.judge_prompt import judge_system_prompt
from services.LLM.tools import web_search, get_weather

default_tools = [web_search, get_weather]

system_prompts = {
    "general": general_system_prompt,
    "research": research_system_prompt,
    "shopping": shopping_system_prompt
}

agent_tools = {
    "general": default_tools,
    "research": [web_search],
    "shopping": [web_search]
}

def build_graph(model, agent_type):
    system_prompt = system_prompts.get(agent_type)
    tools = agent_tools.get(agent_type)

    sys_msg = SystemMessage(content=system_prompt)

    def researcher(state: MessagesState):
        return {
            "messages": [model.invoke([sys_msg] + state["messages"])]
        }

    def judge(state: MessagesState):
        researcher_output = state["messages"][-1]
        return {
            "messages": [model.invoke([judge_system_prompt, researcher_output])]
        }

    builder = StateGraph(MessagesState)

    if agent_type == "research":
        builder.add_node("researcher", researcher)
        builder.add_node("judge", judge)

        builder.add_edge(START, "researcher")
        builder.add_edge("researcher", "judge")
        builder.add_edge("judge", END)

        if tools:
            builder.add_node("tools", ToolNode(tools))
            builder.add_conditional_edges("researcher", tools_condition)
            builder.add_edge("tools", "researcher")
    else:
        builder.add_node("assistant", researcher)
        if tools:
            builder.add_node("tools", ToolNode(tools))
            builder.add_edge(START, "assistant")
            builder.add_conditional_edges("assistant", tools_condition)
            builder.add_edge("tools", "assistant")
        else:
            builder.set_entry_point("assistant")

    return builder.compile()

    
def ai_response(model, user_input, history_db, user_id, agent_type="general"):
    past_messages = history_db.get_conversation(user_id)
    state = {"messages": []}
    for message in past_messages:
        state["messages"].append(HumanMessage(content=message["user_input"]))
        state["messages"].append(AIMessage(content=message["ai_response"]))

    state["messages"].append(HumanMessage(content=user_input))

    graph = build_graph(model, agent_type)
    output_state = graph.invoke(state)

    assistant_reply = output_state["messages"][-1].content
    history_db.save_message(user_id, user_input, assistant_reply)

    return assistant_reply