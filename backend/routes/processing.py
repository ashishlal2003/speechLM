from fastapi import FastAPI, APIRouter, WebSocket, WebSocketDisconnect
from services.Pipeline.pipeline import speech_ai_pipeline
from services.TTS_module.model import TTS_Engine
from services.STT.model import SpeechRecognizer
from services.LLM.utils import setup_genai
from config import AUDIO_FOLDER
import os
from dotenv import load_dotenv
import json

load_dotenv()

router = APIRouter()

# Get singleton 
recognizer = SpeechRecognizer.get_instance()
llm_model = setup_genai(os.getenv("API_KEY"))
tts_engine = TTS_Engine.get_instance()
    
@router.websocket("/ws/processing")
async def process(websocket: WebSocket):
    await websocket.accept()
    print("[DEBUG] Processing WebSocket connection accepted")
    try:
        while True:
            try:

                ## FIX here
                data = await websocket.receive_text()
                message = json.loads(data)
                if message.get("type") == "logout":
                    print("[INFO] Logout message received. Closing connection.")
                    break
                await speech_ai_pipeline(recognizer, llm_model, tts_engine, websocket)
            except WebSocketDisconnect:
                print("[INFO] Client disconnected")
                break
            except Exception as e:
                print(f"[ERROR] Error in processing WebSocket: {e}")
                break
    finally:
        if websocket.client_state.name != "DISCONNECTED":
            await websocket.close()
        print("[DEBUG] WebSocket closed cleanly")
