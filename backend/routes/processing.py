from fastapi import APIRouter, File, UploadFile, HTTPException, WebSocket
from services.Pipeline.pipeline import speech_ai_pipeline
from services.TTS_module.model import TTS_Engine
from config import AUDIO_FOLDER
import os
import shutil
import uuid
from dotenv import load_dotenv
import asyncio

load_dotenv()

from services.STT.model import SpeechRecognizer
from services.LLM.utils import setup_genai, ai_response
import queue, threading
from services.TTS_module.realtimetts_streamer import stream_tts_audio
import io, soundfile as sf
API_KEY = os.getenv("API_KEY")

if not os.path.exists(AUDIO_FOLDER):
    os.makedirs(AUDIO_FOLDER)

router = APIRouter()

recognizer = SpeechRecognizer.get_instance()
llm_model = setup_genai(API_KEY)
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
            transcription = recognizer.transcribe(input_path, language="en")
            response = ai_response(llm_model, transcription)
            print("Received:", response)
            for chunk in tts_engine.synthesize_to_pcm_chunks(response):
                await websocket.send_bytes(chunk)
                await asyncio.sleep(0.01)
    except Exception as e:
        print("WebSocket closed:", e)