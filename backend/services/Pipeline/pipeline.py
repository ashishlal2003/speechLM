from utils.audio_conversion import float32_to_int16, pcm_to_wav
import os
from config import AUDIO_FOLDER
from services.LLM.utils import ai_response
import uuid
import json
from services.UserHistory.factory import get_user_history_plugin

async def speech_ai_pipeline(recognizer, llm_model, tts_engine, websocket):
    try:
        auth_token = websocket.headers.get("authorization")
        user_id = websocket.headers.get("x-user-id", "default_user")

        history_db = get_user_history_plugin(auth_token)

        binary_audio = await websocket.receive_bytes()

        wav_file = pcm_to_wav(
            pcm_data=binary_audio, sample_rate=44100
        )

        input_path = os.path.join(AUDIO_FOLDER, f"stream_input_{uuid.uuid4()}.wav")

        with open(input_path, "wb") as f:
            f.write(wav_file)

        transcription = recognizer.transcribe(input_path, language="en")

        if websocket.client_state.name == "CONNECTED":
            await websocket.send_text(json.dumps({"type": "transcription", "text": transcription}))

        os.remove(input_path)

    except Exception as e:
        if websocket.client_state.name == "CONNECTED":
            await websocket.send_text(json.dumps({"type": "error", "message": str(e)}))
        return

    response = ai_response(llm_model, transcription, history_db, user_id)

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
