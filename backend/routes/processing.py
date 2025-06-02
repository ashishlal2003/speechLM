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
    
    # Extract token and userId from query parameters
    query_params = websocket.query_params
    auth_token = query_params.get("token")
    user_id = query_params.get("userId", "default_user")
    
    print(f"[DEBUG] Auth token from query: {bool(auth_token)}")
    print(f"[DEBUG] User ID from query: {user_id}")
    
    try:
        while True:
            try:
                message = await websocket.receive()
                
                # Handle text messages (like logout)
                if message["type"] == "websocket.receive" and "text" in message:
                    data = json.loads(message["text"])
                    if data.get("type") == "logout":
                        print("[INFO] Logout message received. Closing connection.")
                        break
                
                # Handle binary messages (audio data)
                elif message["type"] == "websocket.receive" and "bytes" in message:
                    print(f"[DEBUG] Received audio data: {len(message['bytes'])} bytes")
                    # Pass the audio data and auth info directly to the pipeline
                    await speech_ai_pipeline(
                        recognizer, llm_model, tts_engine, websocket, 
                        message["bytes"], auth_token, user_id
                    )
                
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

