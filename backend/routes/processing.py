from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Path
from services.Pipeline.pipeline import speech_ai_pipeline
from services.TTS_module.model import TTS_Engine
from services.STT.model import SpeechRecognizer
import os
from dotenv import load_dotenv
import json
import importlib

load_dotenv()

router = APIRouter()

recognizer = SpeechRecognizer.get_instance()
tts_engine = TTS_Engine.get_instance()
    
@router.websocket("/ws/processing")
async def process(websocket: WebSocket):
    await websocket.accept()

    query_params = websocket.query_params
    auth_token = query_params.get("token")
    agent_id = query_params.get("agent_id")
    agent_type = query_params.get("agent_type")

    print(f"[WebSocket OPEN] agent_id: {agent_id}, agent_type: {agent_type}, auth_token: {auth_token}")
    
    try:
        module_name = f"services.LLM.models.{agent_type}_model"
        function_name = f"{agent_type}_model"

        print(f"[Model Loading] Trying to load model from: {module_name}.{function_name}")
        model_module = importlib.import_module(module_name)
        model_loader_fn = getattr(model_module, function_name)
        llm_model = model_loader_fn(os.getenv("API_KEY"))
        print(f"[Model Loaded] Model for {agent_type} loaded successfully")

    except ModuleNotFoundError:
        error_msg = f"Model module '{module_name}' not found"
        print(f"[ERROR] {error_msg}")
        await websocket.send_text(json.dumps({"error": error_msg}))
        await websocket.close()
        return

    except AttributeError:
        error_msg = f"Function '{function_name}' not found in '{module_name}'"
        print(f"[ERROR] {error_msg}")
        await websocket.send_text(json.dumps({"error": error_msg}))
        await websocket.close()
        return

    try:
        while True:
            try:
                message = await websocket.receive()
                print(f"[Message Received] Type: {message['type']}")

                if message["type"] == "websocket.receive" and "text" in message:
                    print(f"[Text Received] {message['text']}")
                    data = json.loads(message["text"])
                    if data.get("type") == "logout":
                        print("[Logout Request] Closing WebSocket connection.")
                        break

                elif message["type"] == "websocket.receive" and "bytes" in message:
                    print(f"[Audio Received] Processing audio with pipeline")
                    await speech_ai_pipeline(
                        recognizer, llm_model, tts_engine, websocket, 
                        message["bytes"], auth_token, agent_id, agent_type
                    )
                    print(f"[Pipeline Completed] Audio processed")

            except WebSocketDisconnect:
                print("[WebSocket Disconnect] Client disconnected")
                break

            except Exception as e:
                print(f"[Exception] {e}")
                break

    finally:
        if websocket.client_state.name != "DISCONNECTED":
            print("[WebSocket Closing] Closing connection gracefully")
            await websocket.close()
        else:
            print("[WebSocket Already Closed]")
