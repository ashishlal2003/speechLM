from langchain_google_genai import ChatGoogleGenerativeAI
import google.generativeai as genai
from services.LLM.tools import web_search
from langgraph.prebuilt import create_react_agent
from services.LLM.prompts.research_prompt import research_system_prompt
from services.LLM.prompts.judge_prompt import judge_system_prompt
from langgraph_supervisor import create_supervisor

def research_model(api_key):
    genai.configure(api_key=api_key)
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash",
        google_api_key=api_key,
    )

    researcher_agent = create_react_agent(
        model=llm,
        tools=[web_search],
        name="researcher",
        prompt=research_system_prompt
    )

    judge_agent = create_react_agent(
        model=llm,
        tools=[web_search],
        name="judge",
        prompt=judge_system_prompt
    )

    workflow = create_supervisor(
        agents = [researcher_agent, judge_agent],
        model = llm,
        prompt=(
            "You are a team supervisor managing a research expert and a judge. "
            "For a user query related to writing a new research paper, make use of researcher_agent to get latest research around that area and novel ideas. "
            "To judge the viability of the proposed idea and solution make use of judge_agent. "
            "After receiving feedback from both agents, provide a comprehensive final response that includes: "
            "1. A summary of the most promising research directions "
            "2. A detailed step-by-step action plan with timelines "
            "3. Specific resources and tools needed "
            "4. Evaluation metrics and datasets to use "
            "5. Potential challenges and how to overcome them "
            "6. A structured timeline for completing the research paper"
            "Use these tools only if needed. Dont let the end user know about these two experts. Each of the experts have a web_search tool as well. Do not answer questions outside your said work"
            "If the user follows up regarding a doubt or clarification, take it up as it is, you dont need to run through the experts again."
            "In your final response to the user, strictly start by saying 'Here is a comprehensive plan for your research paper:' "
        )
    ).compile()

    return workflow