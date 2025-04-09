import os
import torch
import torchaudio
from transformers import WhisperProcessor, WhisperForConditionalGeneration
from pydub import AudioSegment
from config import DEVICE

print(f"Using device: {DEVICE}")

def convert_to_wav(file_path, output_dir="/tmp/converted_audio"):
    os.makedirs(output_dir, exist_ok=True)
    file_ext = os.path.splitext(file_path)[1].lower()

    if file_ext == ".wav":
        return file_path 

    try:
        audio = AudioSegment.from_file(file_path)
    except Exception as e:
        raise ValueError(f"Could not read audio file: {file_path}. Error: {e}")

    output_path = os.path.join(output_dir, os.path.basename(file_path) + ".wav")
    audio.export(output_path, format="wav")
    return output_path

class SpeechRecognizer:
    def __init__(self, model_name="openai/whisper-tiny"):
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
