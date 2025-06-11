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
async def process(websocket: WebSocket, agent_type: str = Path(..., regex="^(general|research|shopping)$")):
    await websocket.accept()

    query_params = websocket.query_params
    auth_token = query_params.get("token")
    user_id = query_params.get("userId", "default_user")

    try:
        module_name = f"services.LLM.models.{agent_type}_model"
        function_name = f"{agent_type}_model"

        model_module = importlib.import_module(module_name)
        model_loader_fn = getattr(model_module, function_name)
        llm_model = model_loader_fn(os.getenv("API_KEY"))
    except ModuleNotFoundError:
        await websocket.send_text(json.dumps({"error": f"Model module '{module_name}' not found"}))
        await websocket.close()
        return
    except AttributeError:
        await websocket.send_text(json.dumps({"error": f"Function '{function_name}' not found in '{module_name}'"}))
        await websocket.close()
        return
    
    try:
        while True:
            try:
                message = await websocket.receive()
                
                if message["type"] == "websocket.receive" and "text" in message:
                    data = json.loads(message["text"])
                    if data.get("type") == "logout":
                        break
                
                elif message["type"] == "websocket.receive" and "bytes" in message:

                    await speech_ai_pipeline(
                        recognizer, llm_model, tts_engine, websocket, 
                        message["bytes"], auth_token, user_id, agent_type
                    )
                
            except WebSocketDisconnect:
                break
            except Exception as e:
                break
    finally:
        if websocket.client_state.name != "DISCONNECTED":
            await websocket.close()

