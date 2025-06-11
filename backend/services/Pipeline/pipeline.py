from utils.audio_conversion import float32_to_int16, pcm_to_wav
import os
from config import AUDIO_FOLDER
from backend.services.LLM.ai_agent import ai_response
import uuid
import json
from services.UserHistory.factory import get_user_history_plugin

async def speech_ai_pipeline(recognizer, llm_model, tts_engine, websocket, binary_audio, auth_token, user_id, agent_type):
    
    try:
        history_db = get_user_history_plugin(auth_token)

        wav_file = pcm_to_wav(
            pcm_data=binary_audio, sample_rate=44100
        )

        input_path = os.path.join(AUDIO_FOLDER, f"stream_input_{uuid.uuid4()}.wav")

        with open(input_path, "wb") as f:
            f.write(wav_file)

        transcription = recognizer.transcribe(input_path, language="en")
        if websocket.client_state.name == "CONNECTED":
            transcription_message = json.dumps({"type": "transcription", "text": transcription})
            await websocket.send_text(transcription_message)
        else:
            print("[WARNING] WebSocket not connected, skipping transcription send")

        os.remove(input_path)

    except Exception as e:
        if websocket.client_state.name == "CONNECTED":
            error_message = json.dumps({"type": "error", "message": str(e)})
            await websocket.send_text(error_message)
        return
    
    response = ai_response(llm_model, transcription, history_db, user_id, agent_type)

    try:
        sentences = tts_engine._split_into_sentences(response)

        for i, sentence in enumerate(sentences):            
            chunk_count = 0
            async for audio_chunk in tts_engine.synthesize_streaming(sentence):
                chunk_count += 1                
                if audio_chunk and websocket.client_state.name == "CONNECTED":                    
                    int16_chunk = float32_to_int16(audio_chunk)                    
                    wav_data = pcm_to_wav(
                        pcm_data=int16_chunk,
                        sample_rate=22050,
                        num_channels=1,
                        sample_width=2
                    )
                    await websocket.send_bytes(wav_data)
                    
                elif not audio_chunk:
                    print(f"[WARNING] Empty audio chunk received for sentence {i+1}")
                elif websocket.client_state.name != "CONNECTED":
                    print(f"[WARNING] WebSocket disconnected during sentence {i+1}, stopping TTS")
                    break

        if websocket.client_state.name == "CONNECTED":
            completion_message = json.dumps({"type": "complete"})
            await websocket.send_text(completion_message)
            print("[DEBUG] TTS streaming complete - completion signal sent")
        else:
            print("[WARNING] WebSocket disconnected, cannot send completion signal")

    except Exception as e:
        print(f"[ERROR] Error during audio synthesis: {type(e).__name__}: {str(e)}")
        print(f"[ERROR] Error traceback: {e}")
        
        if websocket.client_state.name == "CONNECTED":
            error_message = json.dumps({
                "type": "error",
                "message": "Audio synthesis failed"
            })
            await websocket.send_text(error_message)
            print("[DEBUG] Audio synthesis error message sent to client")
        else:
            print("[WARNING] WebSocket disconnected, cannot send error message")

    finally:
        print("[DEBUG] WebSocket pipeline finished")
        print(f"[DEBUG] Final WebSocket state: {websocket.client_state.name}")
