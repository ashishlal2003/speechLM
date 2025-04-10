from services.LLM.utils import setup_genai, ai_response
from services.STT.model import SpeechRecognizer
from services.TTS_module.model import TTS_Engine
from IPython.display import Audio, display
from config import AUDIO_FOLDER

def speech_ai_pipeline(audio_path, api_key, reference_voice=None, language="en"):
    """
    Complete pipeline for speech recognition, AI response, and speech synthesis
    
    Parameters:
    - audio_path: Path to the input audio file
    - api_key: Google Gemini API key
    - reference_voice: Path to a reference voice for cloning (optional, can be None)
    - language: Language code (en, es, fr, etc.)
    """
    try:
        # Initialize components
        print("Setting up models...")
        llm_model = setup_genai(api_key)
        recognizer = SpeechRecognizer.get_instance()
        tts_engine = TTS_Engine()

        # Transcribe input audio
        print("\nTranscribing audio...")
        transcription = recognizer.transcribe(audio_path, language)

        # Get AI response
        print("\nGetting AI response...")
        ai_text_response = ai_response(llm_model, transcription)

        # Generate speech from AI response
        print("\nGenerating speech from response...")
        tts_output = tts_engine.generate_speech(
            text=ai_text_response,
            output_file=f"{AUDIO_FOLDER}/ai_response.wav",
            language=language,
            reference_audio=reference_voice  # This can be None, it's perfectly fine!
        )

        # Play the generated audio
        if tts_output:
            print("Playing generated audio...")
            display(Audio(tts_output, autoplay=True))

        return {
            "transcription": transcription,
            "ai_response": ai_text_response,
            "tts_output": tts_output
        }
        
    except Exception as e:
        print(f"Pipeline error: {str(e)}")
        return {"error": str(e)}