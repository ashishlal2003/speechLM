from langchain_google_genai import ChatGoogleGenerativeAI
import google.generativeai as genai
from services.LLM.tools import web_search
from langgraph.prebuilt import create_react_agent
from services.LLM.prompts.shopping_prompt import shopping_system_prompt

def shopping_model(api_key):
    genai.configure(api_key=api_key)
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash",
        google_api_key=api_key,
    )

    return create_react_agent(
        model=llm,
        tools=[web_search],
        name="shopping",
        prompt=shopping_system_prompt
    )