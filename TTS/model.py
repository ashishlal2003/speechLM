from TTS.api import TTS
import os
from config import DEVICE

class TTS_Engine:
    def __init__(self):
        """
        Initialize XTTS v2 - best open-source TTS model
        Using PyTorch 2.5.1 to avoid loading issues
        """
        try:            
            print("Loading XTTS v2 model...")
            # Initialize XTTS v2
            self.tts = TTS(model_name="tts_models/multilingual/multi-dataset/xtts_v2").to(DEVICE)
            print(f"✅ TTS Model loaded successfully on {DEVICE}")
            
            # Download a sample reference (only used if voice cloning is requested)
            if not os.path.exists("reference_audio.wav"):
                print("Downloading sample reference voice (only used if needed)...")
                os.system("curl -O https://raw.githubusercontent.com/coqui-ai/TTS/dev/tests/data/ljspeech/wavs/LJ001-0001.wav")
                os.rename("LJ001-0001.wav", "reference_audio.wav")
            
            self.default_reference = "reference_audio.wav"
        except Exception as e:
            print(f"Error loading TTS model: {e}")
            raise

    def generate_speech(self, text, output_file="output.wav", language="en", reference_audio=None):
        """
        Generate speech using XTTS v2
        
        Parameters:
        - text: Text to convert to speech
        - output_file: Where to save the audio file
        - language: Language code (en, es, fr, etc.)
        - reference_audio: Path to reference audio for voice cloning (optional)
        """
        try:
            # Use default reference if none provided
            speaker_wav = reference_audio if reference_audio else self.default_reference
            
            print(f"Generating speech using reference: {speaker_wav}")
            self.tts.tts_to_file(
                text=text, 
                file_path=output_file,
                speaker_wav=speaker_wav,
                language=language
            )
                
            print(f"✅ Speech generated and saved to {output_file}")
            return output_file
                
        except Exception as e:
            print(f"Error generating speech: {e}")
            return None