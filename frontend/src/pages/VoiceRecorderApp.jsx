import React, { useEffect, useRef, useState } from "react";
import { Canvas} from "@react-three/fiber";
import { OrbitControls} from "@react-three/drei";
import VibratingSphere from "../components/Tvara/VibratingSphere";
import ParticleField from "../components/Tvara/ParticleField";
import "../index.css";


function App() {
  const [socket, setSocket] = useState(null);
  const [amplitude, setAmplitude] = useState(0);
  const mediaRecorderRef = useRef(null);

  const audioQueueRef = useRef([]);
  const audioContextRef = useRef(null);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    const ws = new WebSocket("ws://localhost:8000/ws/processing");
    setSocket(ws);
    ws.binaryType = "arraybuffer";

    ws.onmessage = async (event) => {
      if (typeof event.data === "string") {
        const data = JSON.parse(event.data);
        if (data.type === "transcription") {
          console.log("[Socket] Received transcription:", data.text);
        } else if (data.type === "complete") {
          console.log("[Socket] TTS response complete");
        } else if (data.type === "error") {
          console.error("[Socket] Error:", data.message);
        }
      } else {
        const audioBuffer = await audioContextRef.current.decodeAudioData(event.data);
        audioQueueRef.current.push(audioBuffer);
        if (!isPlayingRef.current) playAudioQueue();
      }
    };

    return () => {
      ws.close();
      audioContextRef.current?.close();
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

    const analyser = audioContextRef.current.createAnalyser();
    source.connect(analyser);
    source.connect(audioContextRef.current.destination);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const updateAmplitude = () => {
      analyser.getByteTimeDomainData(dataArray);
      const norm = dataArray.reduce((a, b) => a + Math.abs(b - 128), 0) / dataArray.length;
      setAmplitude(norm / 128);
      if (isPlayingRef.current) requestAnimationFrame(updateAmplitude);
    };

    updateAmplitude();
    source.start();
    source.onended = playAudioQueue;
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    const processor = audioContext.createScriptProcessor(4096, 1, 1);

    source.connect(processor);
    processor.connect(audioContext.destination);

    const silenceThreshold = 0.01;
    const silenceDurationLimit = 1000;
    let silenceStart = null;
    let userSpeaking = false;

    let audioBuffer = [];

    processor.onaudioprocess = (event) => {
      const input = event.inputBuffer.getChannelData(0);
      const rms = Math.sqrt(input.reduce((acc, x) => acc + x * x, 0) / input.length);
      setAmplitude(rms);

      if (rms > silenceThreshold) {
        silenceStart = null;
        if (!userSpeaking) {
          userSpeaking = true;
          console.log("[VAD] User started speaking");
        }
        audioBuffer.push(...input);
      } else if (userSpeaking) {
        if (!silenceStart) silenceStart = Date.now();
        if (Date.now() - silenceStart > silenceDurationLimit) {
          userSpeaking = false;
          silenceStart = null;
          console.log("[VAD] User stopped speaking");

          processor.disconnect();
          source.disconnect();
          stream.getTracks().forEach((track) => track.stop());

          const pcm = audioBuffer.map((sample) => sample * 32767);
          const buffer = new Int16Array(pcm);

          if (socket && socket.readyState === WebSocket.OPEN) {
            console.log("[Socket] Sending audio buffer to server...");
            socket.send(buffer.buffer);
          }

          audioBuffer = [];
        }
      }
    };
  };

  return (
    <div className="App">
      <Canvas className="canvas">
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <spotLight position={[-10, 10, 10]} angle={0.3} penumbra={1} intensity={0.8} castShadow />
        
        <color attach="background" args={['#050520']} />
        
        <VibratingSphere amplitude={amplitude} />
        <ParticleField amplitude={amplitude} />
        
        <OrbitControls enableZoom={false} />
      </Canvas>

      <div className="overlay">
        <button onClick={startRecording} className="speak-button">
          🎙️ Speak
        </button>
      </div>
    </div>
  );
}


export default App;