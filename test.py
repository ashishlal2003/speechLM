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