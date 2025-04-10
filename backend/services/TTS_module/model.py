from TTS.api import TTS
import os
from config import DEVICE, AUDIO_FOLDER

from TTS.api import TTS
import os
from config import DEVICE, AUDIO_FOLDER

class TTS_Engine:
    _instance = None  # Class variable to store singleton instance

    def __init__(self):
        """
        Initialize XTTS v2 - best open-source TTS model
        Using PyTorch 2.5.1 to avoid loading issues
        """
        print("Loading XTTS v2 model...")
        self.tts = TTS(model_name="tts_models/multilingual/multi-dataset/xtts_v2").to(DEVICE)
        print(f"✅ TTS Model loaded successfully on {DEVICE}")
        
        # Ensure reference audio is available
        reference_path = f"{AUDIO_FOLDER}/reference_audio.wav"
        if not os.path.exists(reference_path):
            print("Downloading sample reference voice (only used if needed)...")
            os.system("curl -O https://raw.githubusercontent.com/coqui-ai/TTS/dev/tests/data/ljspeech/wavs/LJ001-0001.wav")
            os.rename("LJ001-0001.wav", reference_path)

        self.default_reference = reference_path

    @classmethod
    def get_instance(cls):
        """
        Get the singleton instance of TTS_Engine
        """
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def generate_speech(self, text, output_file, language="en", reference_audio=None):
        """
        Generate speech using XTTS v2
        """
        try:
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
