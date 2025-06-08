from TTS.api import TTS
import os
from config import DEVICE, AUDIO_FOLDER
import requests
from pydub import AudioSegment
import uuid
import numpy as np
import re

class TTS_Engine:
    _instance = None

    def __init__(self):
        print("Loading TTS model...")
        try:
            self.tts = TTS(model_name="tts_models/en/vits/vits-ljspeech").to(DEVICE)
            print("HERE HEHE")
        except:
            # self.tts = TTS(model_name="tts_models/en/ljspeech/glow-tts").to(DEVICE)
            # self.tts = TTS(model_name="tts_models/en/vctk/vits").to(DEVICE)
            self.tts = TTS(model_name="tts_models/en/ljspeech/tacotron2-DDC").to(DEVICE)
            #self.tts = TTS(model_name="tts_models/multilingual/multi-dataset/xtts_v2").to(DEVICE)

            print("HERE HEHEfgdfgdf")
        print(f"✅ TTS Model loaded successfully on {DEVICE}")
        
        reference_path = os.path.join(AUDIO_FOLDER, "reference_audio.wav")
        # if not os.path.exists(reference_path):
        #     print("Downloading sample reference voice...")
        #     url = "https://raw.githubusercontent.com/coqui-ai/TTS/dev/tests/data/ljspeech/wavs/LJ001-0001.wav"
        #     try:
        #         response = requests.get(url, stream=True)
        #         response.raise_for_status()
        #         with open(reference_path, 'wb') as f:
        #             for chunk in response.iter_content(chunk_size=8192):
        #                 f.write(chunk)
        #         print("✅ Reference audio downloaded successfully")
        #     except Exception as e:
        #         print(f"❌ Failed to download reference audio: {e}")
        #         raise RuntimeError("Reference audio download failed.")

        self.default_reference = reference_path

    @classmethod
    def get_instance(cls):
        """
        Get the singleton instance of TTS_Engine
        """
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance
    
    
    def _split_into_sentences(self, text):
        """Split text into sentences, but keep them longer for smoother audio"""
        sentences = re.split(r'(?<=[.!?])\s+(?=[A-Z])', text)
        
        # Combine very short sentences for smoother audio
        combined_sentences = []
        current_sentence = ""

        for sentence in sentences:
            sentence = sentence.strip()
            if not sentence:
                continue
                
            # Combine sentences up to 200 characters for better flow
            if len(current_sentence + " " + sentence) < 200:
                current_sentence = (current_sentence + " " + sentence).strip()
            else:
                if current_sentence:
                    combined_sentences.append(current_sentence)
                current_sentence = sentence

        if current_sentence:
            combined_sentences.append(current_sentence)

        return combined_sentences
    
    def _chunk_audio(self, wav, sample_rate=16000, chunk_duration=1.0):
        """Split audio array into chunks of specified duration"""
        wav = np.array(wav, dtype="float32")
        samples_per_chunk = int(sample_rate * chunk_duration)
        total_samples = len(wav)
        
        # Add small overlap between chunks for smoother transitions
        overlap_samples = int(sample_rate * 0.05)  # 50ms overlap
        
        for i in range(0, total_samples, samples_per_chunk - overlap_samples):
            end_idx = min(i + samples_per_chunk, total_samples)
            chunk = wav[i:end_idx]
            
            # Apply fade in/out to prevent clicks
            if len(chunk) > overlap_samples * 2:
                # Fade in
                fade_samples = min(overlap_samples, len(chunk) // 4)
                chunk[:fade_samples] *= np.linspace(0, 1, fade_samples)
                # Fade out
                chunk[-fade_samples:] *= np.linspace(1, 0, fade_samples)
            
            yield chunk.tobytes()
    
    async def synthesize_streaming(self, text, sample_rate=16000, reference_audio=None):
        """
        Incrementally synthesize text sentence by sentence and yield audio chunks
        """
        try:
            if "xtts" in self.tts.model_name:
                original_ref = reference_audio if reference_audio else self.default_reference
            
            sentences = self._split_into_sentences(text)
            
            for sentence in sentences:
                if not sentence:
                    continue
                    
                if sentence[-1] not in ['.', '!', '?']:
                    sentence += '.'
                
                if "xtts" in self.tts.model_name:
                    wav = self.tts.tts(
                        text=sentence,
                        speaker_wav=original_ref,
                        language="en"
                    )
                else:
                    wav = self.tts.tts(sentence)
                
                wav = np.array(wav, dtype="float32")
                if len(wav) > 0:
                    max_val = np.max(np.abs(wav))
                    if max_val > 0:
                        wav = wav / max_val * 0.8  # Normalize to 80% to prevent clipping
                
                for chunk in self._chunk_audio(wav, sample_rate):
                    yield chunk
                
        except Exception as e:
            print(f"Error in streaming synthesis: {e}")

