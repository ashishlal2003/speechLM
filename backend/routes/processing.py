from fastapi import FastAPI, APIRouter, WebSocket, WebSocketDisconnect
from services.Pipeline.pipeline import speech_ai_pipeline
from services.TTS_module.model import TTS_Engine
from services.STT.model import SpeechRecognizer
from services.LLM.utils import setup_genai
from config import AUDIO_FOLDER
import os
import uuid
import asyncio
import json
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
router = APIRouter()

# Get singleton instances
recognizer = SpeechRecognizer.get_instance()
llm_model = setup_genai(os.getenv("API_KEY"))
tts_engine = TTS_Engine.get_instance()

import struct
import wave
from io import BytesIO
import numpy as np

def float32_to_int16(audio_data):
    """Convert float32 PCM data to int16 format"""
    audio_array = np.frombuffer(audio_data, dtype=np.float32)
    # Scale float32 [-1.0, 1.0] to int16 [-32768, 32767]
    int16_array = (audio_array * 32767).astype(np.int16)
    return int16_array.tobytes()

def pcm_to_wav(pcm_data, sample_rate=22050, num_channels=1, sample_width=2):
    """Convert PCM data to WAV format with correct sample rate"""
    with BytesIO() as wav_buffer:
        with wave.open(wav_buffer, 'wb') as wav_file:
            wav_file.setnchannels(num_channels)
            wav_file.setsampwidth(sample_width)  # 16-bit audio
            wav_file.setframerate(sample_rate)   # Match TTS sample rate
            wav_file.writeframes(pcm_data)
        return wav_buffer.getvalue()
    
@router.websocket("/ws/stt")
async def stt_ws(websocket: WebSocket):
    await websocket.accept()
    print("[DEBUG] STT WebSocket connection accepted")
    try:
        while True:
            try:
                # Receive audio data from the client
                binary_audio = await websocket.receive_bytes()
                print(f"[DEBUG] Received audio data of size: {len(binary_audio)} bytes")

                wav_file = pcm_to_wav(
                    pcm_data=binary_audio, sample_rate=44100)
 
                input_path = os.path.join(AUDIO_FOLDER, f"stream_input_{uuid.uuid4()}.wav")
                print(f"[DEBUG] Saving audio to: {input_path}")

                # Save the audio to a temporary file
                with open(input_path, "wb") as f:
                    f.write(wav_file)

                # Transcribe the audio
                transcription = recognizer.transcribe(input_path, language="en")
                print(f"[DEBUG] Transcription result: {transcription}")

                # Send the transcription back to the client
                await websocket.send_text(json.dumps({"type": "transcription", "text": transcription}))
                print("[DEBUG] Transcription sent to client")

                # Clean up the temporary file
                os.remove(input_path)
                print(f"[DEBUG] Temporary file deleted: {input_path}")
            except WebSocketDisconnect:
                print("[DEBUG] WebSocket disconnected (STT)")
                break
            except Exception as e:
                print(f"[ERROR] Error in STT WebSocket: {e}")
                await websocket.send_text(json.dumps({"type": "error", "message": str(e)}))
                break
    finally:
        print("[DEBUG] STT WebSocket connection closed")

@router.websocket("/ws/tts")
async def tts_ws(websocket: WebSocket):
    await websocket.accept()
    print("[DEBUG] TTS WebSocket connection accepted")
    try:
        while True:
            try:
                data = await websocket.receive_text()
                request_data = json.loads(data)
                text_to_synthesize = request_data.get("text", "")
                print(f"[DEBUG] Text to synthesize: {text_to_synthesize}")

                sentences = tts_engine._split_into_sentences(text_to_synthesize)
                print(f"[DEBUG] Split text into sentences: {sentences}")

                for sentence in sentences:
                    print(f"[DEBUG] Streaming sentence: {sentence}")
                    async for audio_chunk in tts_engine.synthesize_streaming(sentence):
                        if audio_chunk:
                            int16_chunk = float32_to_int16(audio_chunk)
                            wav_data = pcm_to_wav(
                                pcm_data=int16_chunk,
                                sample_rate=22050,
                                num_channels=1,
                                sample_width=2
                            )
                            await websocket.send_bytes(wav_data)


                # Tell the client TTS for this message is complete
                await websocket.send_text(json.dumps({"type": "complete"}))
                print("[DEBUG] TTS streaming complete")
            except WebSocketDisconnect:
                print("[DEBUG] WebSocket disconnected (TTS)")
                break
            except Exception as e:
                print(f"[ERROR] Error in TTS WebSocket: {e}")
                await websocket.send_text(json.dumps({"type": "error", "message": str(e)}))
                break
    finally:
        print("[DEBUG] TTS WebSocket connection closed")
