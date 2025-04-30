import React, { useEffect, useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, Float } from "@react-three/drei";
import * as THREE from "three";
import "./App.css";


function VibratingSphere({ amplitude }) {
  const meshRef = useRef();

  useFrame(() => {
    if (!meshRef.current) return;

    meshRef.current.rotation.y += 0.01;
    meshRef.current.rotation.x += 0.005;

    const scale = 1 + Math.min(amplitude * 2, 0.3);
    meshRef.current.scale.set(scale, scale, scale);

    const material = meshRef.current.material;
    material.emissiveIntensity = amplitude * 2;
    material.color.setHSL(0.6 - amplitude * 0.5, 1, 0.6 + amplitude * 0.3);
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color="#66ccff"
          metalness={0.5}
          roughness={0.1}
          emissive={"#00aaff"}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      <mesh scale={1.05}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial 
          color="#66ccff" 
          transparent 
          opacity={0.1 + amplitude * 0.2} 
        />
      </mesh>
    </group>
  );
}


function ParticleField({ amplitude }) {
  const particlesRef = useRef();
  const count = 100;
  
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 2 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    return positions;
  }, []);
  
  useFrame(() => {
    if (!particlesRef.current) return;
    
    particlesRef.current.rotation.y += 0.001;
    
    const positionAttribute = particlesRef.current.geometry.attributes.position;
    const sizes = particlesRef.current.geometry.attributes.size;
    
    for (let i = 0; i < count; i++) {
      sizes.array[i] = 0.05 + amplitude * 0.1;
    }
    
    sizes.needsUpdate = true;
  });
}


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