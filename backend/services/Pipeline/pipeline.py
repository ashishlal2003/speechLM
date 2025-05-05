from utils import float32_to_int16, pcm_to_wav
import os
from config import AUDIO_FOLDER
from services.LLM.utils import ai_response
import uuid
import json

async def speech_ai_pipeline(recognizer, llm_model, tts_engine, websocket):
    try:
        binary_audio = await websocket.receive_bytes()
        print(f"[DEBUG] Received audio data of size: {len(binary_audio)} bytes")

        wav_file = pcm_to_wav(
            pcm_data=binary_audio, sample_rate=44100
        )

        input_path = os.path.join(AUDIO_FOLDER, f"stream_input_{uuid.uuid4()}.wav")
        print(f"[DEBUG] Saving audio to: {input_path}")

        with open(input_path, "wb") as f:
            f.write(wav_file)

        transcription = recognizer.transcribe(input_path, language="en")
        print(f"[DEBUG] Transcription result: {transcription}")

        if websocket.client_state.name == "CONNECTED":
            await websocket.send_text(json.dumps({"type": "transcription", "text": transcription}))
            print("[DEBUG] Transcription sent to client")

        os.remove(input_path)
        print(f"[DEBUG] Temporary file deleted: {input_path}")

    except Exception as e:
        print(f"[ERROR] Error in STT WebSocket: {e}")
        if websocket.client_state.name == "CONNECTED":
            await websocket.send_text(json.dumps({"type": "error", "message": str(e)}))
        return

    response = ai_response(llm_model, transcription)
    print(f"[DEBUG] Response to synthesize: {response}")

    try:
        sentences = tts_engine._split_into_sentences(response)
        print(f"[DEBUG] Split text into sentences: {sentences}")
        for sentence in sentences:
            print(f"[DEBUG] Streaming sentence: {sentence}")
            async for audio_chunk in tts_engine.synthesize_streaming(sentence):
                if audio_chunk and websocket.client_state.name == "CONNECTED":
                    int16_chunk = float32_to_int16(audio_chunk)
                    wav_data = pcm_to_wav(
                        pcm_data=int16_chunk,
                        sample_rate=22050,
                        num_channels=1,
                        sample_width=2
                    )
                    await websocket.send_bytes(wav_data)

        if websocket.client_state.name == "CONNECTED":
            await websocket.send_text(json.dumps({"type": "complete"}))
            print("[DEBUG] TTS streaming complete")

    except Exception as e:
        print(f"[ERROR] Error during audio synthesis: {e}")
        if websocket.client_state.name == "CONNECTED":
            await websocket.send_text(json.dumps({
                "type": "error",
                "message": "Audio synthesis failed"
            }))

    finally:
        print("[DEBUG] WebSocket pipeline finished")
