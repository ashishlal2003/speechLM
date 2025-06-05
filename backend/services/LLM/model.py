from langchain_google_genai import ChatGoogleGenerativeAI
import google.generativeai as genai
from services.LLM.tools import multiplication

def setup_genai(api_key):
    genai.configure(api_key=api_key)
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash",
        google_api_key=api_key,
    )

    tools = [multiplication]

    llm_with_tools = llm.bind_tools(tools)
    return llm_with_tools