import React, { useEffect, useRef, useState } from 'react';

function App() {
  const [sttSocket, setSttSocket] = useState(null);
  const [ttsSocket, setTtsSocket] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [textToSynthesize, setTextToSynthesize] = useState('');
  const mediaRecorderRef = useRef(null);

  // Refs for real-time audio playback
  const audioQueueRef = useRef([]);
  const audioContextRef = useRef(null);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    // Create AudioContext only once
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();

    const sttWs = new WebSocket('ws://localhost:8000/ws/stt');
    const ttsWs = new WebSocket('ws://localhost:8000/ws/tts');

    sttWs.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'transcription') {
        setTranscription(data.text);
      }
    };

    ttsWs.onmessage = async (event) => {
      const arrayBuffer = await event.data.arrayBuffer();
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);

      // Push to playback queue
      audioQueueRef.current.push(audioBuffer);
      if (!isPlayingRef.current) {
        playAudioQueue();
      }
    };

    setSttSocket(sttWs);
    setTtsSocket(ttsWs);

    return () => {
      sttWs.close();
      ttsWs.close();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playAudioQueue = () => {
    if (audioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      return;
    }

    isPlayingRef.current = true;
    const buffer = audioQueueRef.current.shift();

    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    source.start();

    source.onended = () => {
      playAudioQueue();
    };
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.start();

    mediaRecorderRef.current.ondataavailable = async (event) => {
      if (event.data.size > 0 && sttSocket) {
        sttSocket.send(await event.data.arrayBuffer());
      }
    };

    setTimeout(() => {
      mediaRecorderRef.current.stop();
    }, 5000); // Record for 5 seconds
  };

  const handleTts = () => {
    if (textToSynthesize && ttsSocket) {
      ttsSocket.send(JSON.stringify({ text: textToSynthesize }));
    }
  };

  return (
    <div>
      <h1>Speech-to-Text and Text-to-Speech Test</h1>

      <h2>Speech-to-Text</h2>
      <button onClick={startRecording}>Start STT</button>
      <div>Transcription: {transcription}</div>

      <h2>Text-to-Speech</h2>
      <textarea
        rows="4"
        cols="50"
        placeholder="Type text here..."
        value={textToSynthesize}
        onChange={(e) => setTextToSynthesize(e.target.value)}
      ></textarea>
      <br />
      <button onClick={handleTts}>Start TTS</button>
    </div>
  );
}

export default App;
