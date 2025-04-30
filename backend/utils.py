import numpy as np
import wave
from io import BytesIO

def float32_to_int16(audio_data):
    """Convert float32 PCM data to int16 format"""
    audio_array = np.frombuffer(audio_data, dtype=np.float32)
    int16_array = (audio_array * 32767).astype(np.int16)
    return int16_array.tobytes()

def pcm_to_wav(pcm_data, sample_rate=22050, num_channels=1, sample_width=2):
    """Convert PCM data to WAV format with correct sample rate"""
    with BytesIO() as wav_buffer:
        with wave.open(wav_buffer, 'wb') as wav_file:
            wav_file.setnchannels(num_channels)
            wav_file.setsampwidth(sample_width)
            wav_file.setframerate(sample_rate)
            wav_file.writeframes(pcm_data)
        return wav_buffer.getvalue()