from langchain_google_genai import ChatGoogleGenerativeAI
import google.generativeai as genai
from services.LLM.tools import web_search

def shopping_model(api_key):
    genai.configure(api_key=api_key)
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash",
        google_api_key=api_key,
    )

    tools = [web_search]

    llm_with_tools = llm.bind_tools(tools)
    return llm_with_tools