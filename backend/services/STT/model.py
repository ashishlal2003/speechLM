import os
import torch
import torchaudio
from transformers import WhisperProcessor, WhisperForConditionalGeneration
from pydub import AudioSegment
from config import DEVICE
import uuid

def convert_to_wav(file_path, output_dir="converted_audio"):
    os.makedirs(output_dir, exist_ok=True)

    try:
        audio = AudioSegment.from_file(file_path)
    except Exception as e:
        raise ValueError(f"[Audio Conversion] Could not read audio file: {file_path}. Error: {e}")

    unique_filename = f"{uuid.uuid4()}.wav"
    output_path = os.path.join(output_dir, unique_filename)

    try:
        audio.export(output_path, format="wav", codec="pcm_s16le")
    except Exception as e:
        raise ValueError(f"[Audio Export] Failed to export WAV file. Error: {e}")

    return output_path


class SpeechRecognizer:
    _instance = None
    
    @classmethod
    def get_instance(cls, model_name="openai/whisper-small"):
        """
        Singleton access method that returns the instance or creates it if it doesn't exist
        """
        if cls._instance is None:
            cls._instance = cls(model_name)
        return cls._instance
    
    def __init__(self, model_name="openai/whisper-small"):
        print(f"Using device: {DEVICE}")
        print(f"Loading Whisper model: {model_name}...")
        self.processor = WhisperProcessor.from_pretrained(model_name)
        self.model = WhisperForConditionalGeneration.from_pretrained(model_name).to(DEVICE)
        self.model.config.forced_decoder_ids = None
        print(f"✅ Speech Recognition Model loaded on {DEVICE}")

    def load_audio(self, file_path, target_sr=16000):
        waveform, sample_rate = torchaudio.load(file_path)
        
        # Handle multi-channel audio
        if waveform.shape[0] > 1:
            waveform = waveform.mean(dim=0, keepdim=True)
            
        # Resample if needed
        if sample_rate != target_sr:
            resampler = torchaudio.transforms.Resample(orig_freq=sample_rate, new_freq=target_sr)
            waveform = resampler(waveform)
            
        return waveform.squeeze(0).numpy()

    def transcribe(self, audio_path, language='english'):
        audio_path = convert_to_wav(audio_path)
        print(f"[DEBUG] Using audio file: {audio_path}")
        audio_input = self.load_audio(audio_path)

        inputs = self.processor(
            audio_input,
            sampling_rate=16000,
            return_tensors="pt",
            language=language,
            task="transcribe"
        ).to(DEVICE)

        with torch.no_grad():
            generated_ids = self.model.generate(
                inputs.input_features,
                max_length=448,
                num_beams=5,
                repetition_penalty=1.2
            )

        transcription = self.processor.batch_decode(
            generated_ids.cpu(),
            skip_special_tokens=True
        )[0]

        print("Transcription:", transcription)
        return transcription
