import os
from pipeline import speech_ai_pipeline
from dotenv import load_dotenv
from config import AUDIO_FOLDER
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import shutil
import uuid 

load_dotenv()

if not os.path.exists(AUDIO_FOLDER):
    os.makedirs(AUDIO_FOLDER)

API_KEY = os.getenv("API_KEY")

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Hello World"}

@app.post("/process")
async def process_audio(audio_file: UploadFile = File(...)):
    if not audio_file:
        raise HTTPException(status_code=400, detail="No audio file provided")
    
    file_extension = os.path.splitext(audio_file.filename)[1].lower()
    if file_extension not in ['.mp3', '.wav', '.m4a', '.ogg']:
        raise HTTPException(status_code=400, detail="Unsupported audio format")
    
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = f"{AUDIO_FOLDER}/{unique_filename}"

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(audio_file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save audio file: {str(e)}")
    
    try:
        result = speech_ai_pipeline(
            file_path,
            API_KEY,
            reference_voice=file_path,
            language="en"
        )
        
        return {
            "input_audio": file_path,
            "transcription": result.get('transcription'),
            "ai_response": result.get('ai_response'),
            "output_audio": result.get('tts_output')
        }
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Error processing audio: {str(e)}")