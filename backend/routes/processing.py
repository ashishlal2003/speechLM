from fastapi import APIRouter, File, UploadFile, HTTPException, WebSocket
from services.Pipeline.pipeline import speech_ai_pipeline
from services.TTS_module.model import TTS_Engine
from services.STT.model import SpeechRecognizer
from services.LLM.utils import setup_genai, ai_response
from config import AUDIO_FOLDER
import os
import shutil
import uuid
import json
from dotenv import load_dotenv
import asyncio

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
            # Receive audio from client
            binary_audio = await websocket.receive_bytes()
            input_path = os.path.join(AUDIO_FOLDER, f"stream_input_{uuid.uuid4()}.wav")
            
            # Save received audio to file
            with open(input_path, "wb") as f:
                f.write(binary_audio)
            
            # Transcribe the audio
            transcription = recognizer.transcribe(input_path, language="en")
            print(f"Transcribed: {transcription}")
            
            # Optional: Send transcription acknowledgment to the client
            await websocket.send_text(json.dumps({
                "type": "transcription", 
                "text": transcription
            }))
            
            # Get AI response
            response = ai_response(llm_model, transcription)
            print(f"Response to synthesize: {response}")
            
            # Use the streaming synthesis method
            try:
                async for audio_chunk in tts_engine.synthesize_streaming(response):
                    if audio_chunk:  # Make sure we have valid audio data
                        # Send each audio chunk as it becomes available
                        await websocket.send_bytes(audio_chunk)
                        # Small delay to prevent network congestion
                        await asyncio.sleep(0.01)
            except Exception as e:
                print(f"Error during audio synthesis: {e}")
                # Inform client about the error
                await websocket.send_text(json.dumps({
                    "type": "error",
                    "message": "Audio synthesis failed"
                }))
            
            # Optional: Send a completion signal
            await websocket.send_text(json.dumps({
                "type": "complete"
            }))
            
            # Clean up temp file
            try:
                os.remove(input_path)
            except:
                pass
                
    except Exception as e:
        print(f"WebSocket error: {e}")
        # Try to gracefully close the connection
        try:
            await websocket.close(code=1000)
        except:
            pass
