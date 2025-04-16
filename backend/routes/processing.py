from fastapi import APIRouter, WebSocket
from services.Pipeline.pipeline import speech_ai_pipeline
from services.TTS_module.model import TTS_Engine
from services.STT.model import SpeechRecognizer
from services.LLM.utils import setup_genai
from config import AUDIO_FOLDER
import os
import uuid
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# Get singleton instances
recognizer = SpeechRecognizer.get_instance()
llm_model = setup_genai(os.getenv("API_KEY"))
tts_engine = TTS_Engine.get_instance()

@router.websocket("/ws/tts")
async def tts_ws(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            binary_audio = await websocket.receive_bytes()
            input_path = os.path.join(AUDIO_FOLDER, f"stream_input_{uuid.uuid4()}.wav")
            
            with open(input_path, "wb") as f:
                f.write(binary_audio)

            await speech_ai_pipeline(input_path, os.getenv("API_KEY"), recognizer, llm_model, tts_engine, websocket)

            try:
                os.remove(input_path)
            except:
                pass
                
    except Exception as e:
        print(f"WebSocket error: {e}")
        try:
            await websocket.close(code=1000)
        except:
            pass
