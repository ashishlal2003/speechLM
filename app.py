import os
from pipeline import speech_ai_pipeline
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("API_KEY")
sample_audio = "Recording.wav"  

if os.path.exists(sample_audio):
    result = speech_ai_pipeline(
        sample_audio,
        API_KEY,
        reference_voice=sample_audio,
        language="en"
    )
    
    print("\n✅ Pipeline completed:")
    print(f"Input Audio: {sample_audio}")
    print(f"Transcription: {result.get('transcription')}")
    print(f"AI Response: {result.get('ai_response')}")
    print(f"Output Audio: {result.get('tts_output')}")
else:
    print(f"❌ Audio file not found: {sample_audio}")
    print("Please provide a valid audio file path.")