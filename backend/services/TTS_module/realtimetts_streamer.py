from RealtimeTTS import TextToAudioStream, CoquiEngine

engine = None

def stream_tts_audio(on_stop):
    global engine
    if engine is None:
        engine = CoquiEngine()

    stream = TextToAudioStream(
        engine=engine,
        on_audio_stream_stop=on_stop
    )
    # stream.feed(text)
    # stream.play()
    return stream
