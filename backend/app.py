from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import AUDIO_FOLDER
from routes import processing
app = FastAPI()

app.include_router(processing.router, tags=["Processing"])

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