from TTS.api import TTS
import os
from config import DEVICE, AUDIO_FOLDER
import requests
from pydub import AudioSegment
import uuid

class TTS_Engine:
    _instance = None

    def __init__(self):
        print("Loading XTTS v2 model...")
        self.tts = TTS(model_name="tts_models/multilingual/multi-dataset/xtts_v2").to(DEVICE)
        print(f"✅ TTS Model loaded successfully on {DEVICE}")
        
        # Ensure reference audio is available
        reference_path = os.path.join(AUDIO_FOLDER, "reference_audio.wav")
        if not os.path.exists(reference_path):
            print("Downloading sample reference voice (only used if needed)...")
            url = "https://raw.githubusercontent.com/coqui-ai/TTS/dev/tests/data/ljspeech/wavs/LJ001-0001.wav"
            try:
                response = requests.get(url, stream=True)
                response.raise_for_status()
                with open(reference_path, 'wb') as f:
                    for chunk in response.iter_content(chunk_size=8192):
                        f.write(chunk)
                print("✅ Reference audio downloaded successfully")
            except Exception as e:
                print(f"❌ Failed to download reference audio: {e}")
                raise RuntimeError("Reference audio download failed.")

        self.default_reference = reference_path


    @classmethod
    def get_instance(cls):
        """
        Get the singleton instance of TTS_Engine
        """
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance
    
    def _convert_reference_wav(self, input_path):
        try:
            audio = AudioSegment.from_file(input_path)
            audio = audio.set_channels(1).set_sample_width(2).set_frame_rate(24000)  # Mono, 16-bit, 24kHz
            safe_path = os.path.join(AUDIO_FOLDER, f"converted_{uuid.uuid4()}.wav")
            audio.export(safe_path, format="wav", codec="pcm_s16le")
            return safe_path
        except Exception as e:
            raise ValueError(f"[TTS] Failed to convert reference audio: {e}")

    def generate_speech(self, text, output_file, language="en", reference_audio=None):
        try:
            original_ref = reference_audio if reference_audio else self.default_reference
            print(f"Using reference audio: {original_ref}")
            
            # Convert the reference audio to a safe format
            speaker_wav = self._convert_reference_wav(original_ref)

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

