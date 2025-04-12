if __name__ == "__main__":
    print("Importing modules")
    from RealtimeTTS import TextToAudioStream, CoquiEngine

    print("Initializing engine")
    engine = CoquiEngine(voice="backend/converted_audio/ae05362a-4889-4a4c-93dc-32aab898d74f.wav")

    print("Initializing stream")
    stream = TextToAudioStream(engine)
    
    print("Ab start hoga")
    stream.feed("TThis week, we dove into the powerful capabilities of real-time speech systems. From understanding how text is converted into audio on the fly, to implementing our own streaming TTS pipeline, the session highlighted both the technical depth and practical applications of these systems. We discussed the role of engines like Coqui, how they manage voice synthesis, and the importance of low latency in interactive environments. Real-world use cases such as AI companions, customer service bots, and accessibility tools were explored. Challenges like voice consistency, emotion control, and streaming playback were addressed in detail. As we continue building our pipeline, we’re moving closer to a truly conversational system. In the coming sessions, we’ll look at speaker embedding, voice cloning, and more advanced features that push TTS beyond simple reading.")
    stream.play_async()

# import io
# import queue
# import threading
# import multiprocessing
# from fastapi import FastAPI, WebSocketDisconnect
# from fastapi.responses import HTMLResponse
# from fastapi.websockets import WebSocket
# import soundfile as sf
# from RealtimeTTS import TextToAudioStream, CoquiEngine
# import torch

# app = FastAPI()

# # Global variable to hold our engine
# engine = None

# def init_engine():
#     global engine
#     if engine is None:
#         print("Initializing TTS engine...")
#         engine = CoquiEngine()
#         print("TTS engine ready!")

# @app.get("/", response_class=HTMLResponse)
# async def get():
#     with open("index.html", "r") as f:
#         return f.read()

# @app.websocket("/ws")
# async def websocket_endpoint(websocket: WebSocket):
#     global engine
#     await websocket.accept()
    
#     # Make sure engine is initialized
#     if engine is None:
#         init_engine()
    
#     # Create a thread-safe queue for audio chunks
#     audio_queue = queue.Queue()
    
#     # Flag to signal when TTS is complete
#     tts_complete = threading.Event()
    
#     # Define the callback for audio chunks
    
    
#     def on_audio_chunk(chunk):
#         audio_queue.put(chunk)
    
#     # Define the callback for when audio stream stops
#     def on_audio_stream_stop():
#         tts_complete.set()
    
#     try:
#         while True:
#             # Receive text from the frontend
#             text = await websocket.receive_text()
#             print(f"Processing: {text}")
            
#             # Reset flags and queues
#             tts_complete.clear()
#             while not audio_queue.empty():
#                 audio_queue.get()
            
#             # Create and configure a new stream for this text
#             stream = TextToAudioStream(
#                 engine=engine,
#                 on_audio_stream_stop=on_audio_stream_stop
#             )
#             stream.feed(text)
            
#             # Start TTS in a separate thread
#             tts_thread = threading.Thread(
#                 target=lambda: stream.play_async(on_audio_chunk=on_audio_chunk)
#             )
#             tts_thread.start()
            
#             # Send chunks as they become available
#             while True:
#                 try:
#                     # Non-blocking get with timeout
#                     chunk = audio_queue.get(timeout=0.1)
                    
#                     # Convert to WAV and send
#                     wav_io = io.BytesIO()
#                     sf.write(wav_io, chunk, 22050, format='WAV')
#                     wav_io.seek(0)
#                     await websocket.send_bytes(wav_io.read())
#                 except queue.Empty:
#                     # If queue is empty and TTS is complete, break the loop
#                     if tts_complete.is_set():
#                         break
            
#             # Signal completion to the client
#             await websocket.send_json({"status": "complete"})
            
#     except WebSocketDisconnect:
#         print("Client disconnected")


# # This guard is crucial for Windows multiprocessing
# if __name__ == "__main__":
#     # Required for Windows to properly handle multiprocessing
#     multiprocessing.freeze_support()
    
#     # Initialize the engine in the main process
#     init_engine()
    
#     # Start the server
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)
 