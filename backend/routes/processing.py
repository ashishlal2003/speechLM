from fastapi import APIRouter, File, UploadFile, HTTPException, WebSocket
from services.Pipeline.pipeline import speech_ai_pipeline
from config import AUDIO_FOLDER
import os
import shutil
import uuid
from dotenv import load_dotenv
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

@router.post("/process")
async def process_audio(audio_file: UploadFile = File(...)):
    if not audio_file:
        raise HTTPException(status_code=400, detail="No audio file provided")

    file_ext = os.path.splitext(audio_file.filename)[1].lower()
    if file_ext not in ['.mp3', '.wav', '.m4a', '.ogg']:
        raise HTTPException(status_code=400, detail="Unsupported audio format")

    unique_filename = f"{uuid.uuid4()}{file_ext}"
    input_path = os.path.join(AUDIO_FOLDER, unique_filename)

    try:
        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(audio_file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save input: {str(e)}")

    try:
        result = speech_ai_pipeline(
            input_path,
            API_KEY,
            reference_voice=input_path,
            language="en"
        )

        tts_path = result.get("tts_output")
        if not tts_path or not os.path.exists(tts_path):
            raise HTTPException(status_code=500, detail="Output audio file not generated")

        # Read output audio file as binary
        with open(tts_path, "rb") as f:
            audio_data = f.read()

        # Convert to base64 for JSON-safe transport
        import base64
        encoded_audio = base64.b64encode(audio_data).decode("utf-8")

        return {
            "transcription": result.get("transcription"),
            "ai_response": result.get("ai_response"),
            "output_audio_base64": encoded_audio,
            "output_mime": "audio/wav"  # or detect from extension
        }

    except Exception as e:
        if os.path.exists(input_path):
            os.remove(input_path)
        raise HTTPException(status_code=500, detail=f"Error processing: {str(e)}")

@router.websocket("/ws/stream")
async def stream_tts(websocket: WebSocket):
    await websocket.accept()

    try:
        while True:
            binary_audio = await websocket.receive_bytes()

            input_path = os.path.join(AUDIO_FOLDER, f"stream_input_{uuid.uuid4()}.wav")
            with open(input_path, "wb") as f:
                f.write(binary_audio)

            transcription = recognizer.transcribe(input_path, language="en")

            response = ai_response(llm_model, transcription)

            audio_queue = queue.Queue()
            tts_complete = threading.Event()

            def on_audio_chunk(chunk):
                audio_queue.put(chunk)

            def on_audio_stream_stop():
                tts_complete.set()

            stream = stream_tts_audio(on_audio_stream_stop)
            stream.feed(response)

            tts_thread = threading.Thread(
                target=lambda: stream.play_async(on_audio_chunk=on_audio_chunk)
            )

            tts_thread.start()

            # threading.Thread(
            #     target = stream_tts_audio,
            #     args = (response, on_audio_stream_stop)
            # ).start()

            while True:
                try:
                    chunk = audio_queue.get(timeout=0.1)
                    buf = io.BytesIO()
                    sf.write(buf, chunk, 22050, format='WAV')
                    buf.seek(0)
                    await websocket.send_bytes(buf.read())
                except queue.Empty:
                    if tts_complete.is_set():
                        break
            await websocket.send_text("TTS complete")

    except Exception as e:
        print(f"WebSocket error: {str(e)}")
        await websocket.close()
            