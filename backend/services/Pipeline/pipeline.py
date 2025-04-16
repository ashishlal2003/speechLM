from services.LLM.utils import ai_response
import asyncio
import json

async def speech_ai_pipeline(input_path, api_key, recognizer, llm_model, tts_engine, websocket):

    transcription = recognizer.transcribe(input_path, language="en")
    print(f"Transcribed: {transcription}")

    response = ai_response(llm_model, transcription)
    print(f"Response to synthesize: {response}")

    try:
        async for audio_chunk in tts_engine.synthesize_streaming(response):
            if audio_chunk:
                await websocket.send_bytes(audio_chunk)
                await asyncio.sleep(0.01)
    except Exception as e:
            print(f"Error during audio synthesis: {e}")
            # Inform client about the error
            await websocket.send_text(json.dumps({
                "type": "error",
                "message": "Audio synthesis failed"
            }))