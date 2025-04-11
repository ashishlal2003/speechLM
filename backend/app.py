import os
import shutil
import uuid
import io

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from services.Pipeline.pipeline import speech_ai_pipeline
from config import AUDIO_FOLDER

load_dotenv()

API_KEY = os.getenv("API_KEY")

# Ensure AUDIO_FOLDER exists
if not os.path.exists(AUDIO_FOLDER):
    os.makedirs(AUDIO_FOLDER)

app = FastAPI()

# CORS for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Hello World"}


@app.post("/process")
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
