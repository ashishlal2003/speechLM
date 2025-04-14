from TTS.api import TTS
import os
from config import DEVICE, AUDIO_FOLDER
import requests
from pydub import AudioSegment
import uuid
import numpy as np

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
            audio = audio.set_channels(1).set_sample_width(2).set_frame_rate(24000)
            safe_path = os.path.join(AUDIO_FOLDER, f"converted_{uuid.uuid4()}.wav")
            audio.export(safe_path, format="wav", codec="pcm_s16le")
            return safe_path
        except Exception as e:
            raise ValueError(f"[TTS] Failed to convert reference audio: {e}")

    def synthesize_to_pcm_chunks(self, text, sample_rate=22050, chunk_duration=0.25, reference_audio=None):
        try:
            original_ref = reference_audio if reference_audio else self.default_reference
            print(f"Using reference audio: {original_ref}")
            
            speaker_wav = self._convert_reference_wav(original_ref)

            wav = self.tts.tts(
                text=text,
                speaker_wav=speaker_wav,
                language="en"
            )
            wav = np.array(wav, dtype="float32")
            total_samples = len(wav)
            samples_per_chunk = int(sample_rate * chunk_duration)

            for i in range(0, total_samples, samples_per_chunk):
                chunk = wav[i:i + samples_per_chunk]
                yield chunk.tobytes()
                
        except Exception as e:
            print(f"Error synthesizing speech to PCM chunks: {e}")
            return None

