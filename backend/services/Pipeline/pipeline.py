from utils.audio_conversion import float32_to_int16, pcm_to_wav
import os
from config import AUDIO_FOLDER
from services.LLM.utils import ai_response
import uuid
import json
from services.UserHistory.factory import get_user_history_plugin

async def speech_ai_pipeline(recognizer, llm_model, tts_engine, websocket, binary_audio, auth_token, user_id):
    print("[DEBUG] Starting speech AI pipeline")
    
    try:
        print(f"[DEBUG] Auth token present: {bool(auth_token)}")
        print(f"[DEBUG] User ID: {user_id}")

        # Initialize history database
        print("[DEBUG] Initializing user history plugin")
        history_db = get_user_history_plugin(auth_token)
        print(f"[DEBUG] History DB initialized: {type(history_db).__name__}")

        # Use the provided audio data instead of trying to receive it again
        print(f"[DEBUG] Using provided binary audio data: {len(binary_audio)} bytes")

        # Convert PCM to WAV
        print("[DEBUG] Converting PCM to WAV format")
        wav_file = pcm_to_wav(
            pcm_data=binary_audio, sample_rate=44100
        )
        print(f"[DEBUG] WAV conversion complete: {len(wav_file)} bytes")

        # Save temporary audio file
        input_path = os.path.join(AUDIO_FOLDER, f"stream_input_{uuid.uuid4()}.wav")
        print(f"[DEBUG] Saving audio to temporary file: {input_path}")

        with open(input_path, "wb") as f:
            f.write(wav_file)
        print(f"[DEBUG] Audio file saved successfully")

        # Transcribe audio
        print("[DEBUG] Starting speech recognition")
        transcription = recognizer.transcribe(input_path, language="en")
        print(f"[DEBUG] Transcription complete: '{transcription}'")
        print(f"[DEBUG] Transcription length: {len(transcription)} characters")

        # Send transcription to client
        print(f"[DEBUG] WebSocket state: {websocket.client_state.name}")
        if websocket.client_state.name == "CONNECTED":
            transcription_message = json.dumps({"type": "transcription", "text": transcription})
            await websocket.send_text(transcription_message)
            print("[DEBUG] Transcription sent to client")
        else:
            print("[WARNING] WebSocket not connected, skipping transcription send")

        # Clean up temporary file
        print(f"[DEBUG] Removing temporary file: {input_path}")
        os.remove(input_path)
        print("[DEBUG] Temporary file removed")

    except Exception as e:
        print(f"[ERROR] Exception in audio processing phase: {type(e).__name__}: {str(e)}")
        if websocket.client_state.name == "CONNECTED":
            error_message = json.dumps({"type": "error", "message": str(e)})
            await websocket.send_text(error_message)
            print("[DEBUG] Error message sent to client")
        return

    # Generate AI response
    print("[DEBUG] Starting AI response generation")
    print(f"[DEBUG] LLM model: {type(llm_model).__name__}")
    response = ai_response(llm_model, transcription, history_db, user_id)
    print(f"[DEBUG] AI response generated: '{response[:100]}...' (truncated)")
    print(f"[DEBUG] AI response length: {len(response)} characters")

    try:
        # Split response into sentences for streaming
        print("[DEBUG] Splitting response into sentences for TTS")
        sentences = tts_engine._split_into_sentences(response)
        print(f"[DEBUG] Split text into {len(sentences)} sentences: {sentences}")
        
        # Stream each sentence
        for i, sentence in enumerate(sentences):
            print(f"[DEBUG] Processing sentence {i+1}/{len(sentences)}: '{sentence}'")
            
            chunk_count = 0
            async for audio_chunk in tts_engine.synthesize_streaming(sentence):
                chunk_count += 1
                print(f"[DEBUG] Received audio chunk {chunk_count} for sentence {i+1}")
                
                if audio_chunk and websocket.client_state.name == "CONNECTED":
                    print(f"[DEBUG] Audio chunk size: {len(audio_chunk)} samples")
                    
                    # Convert audio format
                    int16_chunk = float32_to_int16(audio_chunk)
                    print(f"[DEBUG] Converted to int16: {len(int16_chunk)} bytes")
                    
                    wav_data = pcm_to_wav(
                        pcm_data=int16_chunk,
                        sample_rate=22050,
                        num_channels=1,
                        sample_width=2
                    )
                    print(f"[DEBUG] WAV data size: {len(wav_data)} bytes")
                    
                    # Send audio chunk
                    await websocket.send_bytes(wav_data)
                    print(f"[DEBUG] Audio chunk {chunk_count} sent to client")
                    
                elif not audio_chunk:
                    print(f"[WARNING] Empty audio chunk received for sentence {i+1}")
                elif websocket.client_state.name != "CONNECTED":
                    print(f"[WARNING] WebSocket disconnected during sentence {i+1}, stopping TTS")
                    break
            
            print(f"[DEBUG] Completed streaming sentence {i+1} ({chunk_count} chunks)")

        # Send completion signal
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
