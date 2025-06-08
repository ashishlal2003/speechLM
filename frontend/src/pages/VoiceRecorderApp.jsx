import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, MeshDistortMaterial, Sphere } from "@react-three/drei";
import "../index.css";
import Button from "../components/elements/Button";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Modified AnimatedSphere to take amplitude as a prop
function AnimatedSphere({ amplitude }) {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      const scale = 1 + amplitude * 1.5;
      meshRef.current.scale.set(scale, scale, scale);
      meshRef.current.material.distort = 0.3 + amplitude * 1.2;
    }
  });

  return (
    <Sphere args={[1.5, 128, 128]} ref={meshRef}>
      <MeshDistortMaterial
        color="#eb7067"
        speed={2}
      />
    </Sphere>
  );
}

function App(props) {
  const [socket, setSocket] = useState(null);
  const [amplitude, setAmplitude] = useState(0);
  const mediaRecorderRef = useRef(null);

  // Audio playback management
  const audioQueueRef = useRef([]);
  const audioContextRef = useRef(null);
  const isPlayingRef = useRef(false);
  const currentSourceRef = useRef(null);
  const nextScheduledTimeRef = useRef(0);
  const bufferingRef = useRef(false);

  // Recording management
  const recordingStreamRef = useRef(null);
  const recordingProcessorRef = useRef(null);
  const recordingAudioContextRef = useRef(null);

  const navigate = useNavigate();

  // Constants for smooth audio playback
  const MIN_BUFFER_SIZE = 3; // Minimum chunks to buffer before starting playback
  const FADE_DURATION = 0.01; // 10ms fade for smooth transitions

  useEffect(() => {
    // AudioContext for playback
    audioContextRef.current = new (window.AudioContext ||
      window.webkitAudioContext)();
    
    const token = localStorage.getItem("token");
    const userId = token ? jwtDecode(token).sub : "default_user";

    console.log("userId", userId);

    const ws = new WebSocket(
      `ws://localhost:8000/ws/processing?token=${encodeURIComponent(
        token
      )}&userId=${encodeURIComponent(userId)}`
    );
    setSocket(ws);
    ws.binaryType = "arraybuffer";

    ws.onmessage = async (event) => {
      if (typeof event.data === "string") {
        const data = JSON.parse(event.data);
        if (data.type === "transcription") {
          console.log("[Socket] Received transcription:", data.text);
        } else if (data.type === "complete") {
          console.log("[Socket] TTS response complete");
          bufferingRef.current = false; // Allow playback of remaining chunks
          // Start playback if we have any chunks waiting
          if (!isPlayingRef.current && audioQueueRef.current.length > 0) {
            playAudioQueue();
          }
        } else if (data.type === "error") {
          console.error("[Socket] Error:", data.message);
        }
      } else {
        const audioData = event.data;
        try {
          const audioBuffer = await audioContextRef.current.decodeAudioData(
            audioData.slice(0)
          );
          audioQueueRef.current.push(audioBuffer);
          
          // Start playback when we have enough chunks buffered OR when complete
          if (!isPlayingRef.current && 
              (audioQueueRef.current.length >= MIN_BUFFER_SIZE || !bufferingRef.current)) {
            playAudioQueue();
          }
        } catch (e) {
          console.error("Error decoding audio data:", e);
        }
      }
    };

    return () => {
      ws.close();
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        audioContextRef.current.close();
      }
      stopRecordingResources();
    };
  }, []);

  const playAudioQueue = async () => {
    if (audioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      setAmplitude(0);
      nextScheduledTimeRef.current = 0;
      return;
    }

    if (isPlayingRef.current) return; // Prevent multiple simultaneous playbacks

    isPlayingRef.current = true;
    
    // Ensure audio context is running
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    const playNextChunk = () => {
      if (audioQueueRef.current.length === 0) {
        isPlayingRef.current = false;
        setAmplitude(0);
        nextScheduledTimeRef.current = 0;
        return;
      }

      const buffer = audioQueueRef.current.shift();
      const sourceNode = audioContextRef.current.createBufferSource();
      sourceNode.buffer = buffer;

      // Create gain node for smooth transitions
      const gainNode = audioContextRef.current.createGain();
      sourceNode.connect(gainNode);

      // Set up amplitude monitoring
      const analyserNode = audioContextRef.current.createAnalyser();
      analyserNode.fftSize = 256;
      gainNode.connect(analyserNode);
      analyserNode.connect(audioContextRef.current.destination);

      const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
      
      const updateAmplitude = () => {
        if (!isPlayingRef.current) {
          setAmplitude(0);
          return;
        }
        analyserNode.getByteTimeDomainData(dataArray);
        const norm = dataArray.reduce((a, b) => a + Math.abs(b - 128), 0) / dataArray.length;
        setAmplitude(norm / 128);
        requestAnimationFrame(updateAmplitude);
      };

      // Schedule playback for smooth continuation
      const currentTime = audioContextRef.current.currentTime;
      const startTime = Math.max(currentTime, nextScheduledTimeRef.current);
      
      sourceNode.start(startTime);
      nextScheduledTimeRef.current = startTime + buffer.duration;

      // Add small fade-in to prevent clicks
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(1, startTime + FADE_DURATION);

      updateAmplitude();
      currentSourceRef.current = sourceNode;

      sourceNode.onended = () => {
        // Small delay to prevent rapid-fire playback
        setTimeout(playNextChunk, 10);
      };
    };

    playNextChunk();
  };

  const stopAllAudio = () => {
    if (currentSourceRef.current) {
      try {
        currentSourceRef.current.stop();
      } catch (e) {
        // Source might already be stopped
      }
      currentSourceRef.current = null;
    }
    
    audioQueueRef.current = [];
    isPlayingRef.current = false;
    nextScheduledTimeRef.current = 0;
    setAmplitude(0);
  };

  const stopRecordingResources = () => {
    stopAllAudio(); // Stop any playing audio
    
    if (recordingProcessorRef.current) {
      recordingProcessorRef.current.disconnect();
      recordingProcessorRef.current = null;
    }
    if (recordingStreamRef.current) {
      recordingStreamRef.current.getTracks().forEach((track) => track.stop());
      recordingStreamRef.current = null;
    }
    if (
      recordingAudioContextRef.current &&
      recordingAudioContextRef.current.state !== "closed"
    ) {
      recordingAudioContextRef.current.close();
      recordingAudioContextRef.current = null;
    }
    console.log("[VAD] Recording resources stopped and cleaned up.");
  };

  const startRecording = async () => {
    if (recordingStreamRef.current) {
      console.log(
        "[VAD] Recording already in progress or not cleaned up. Stopping previous."
      );
      stopRecordingResources();
    }
    setAmplitude(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000
        } 
      });
      recordingStreamRef.current = stream;

      recordingAudioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
      const audioCtx = recordingAudioContextRef.current;

      const source = audioCtx.createMediaStreamSource(stream);
      const processor = audioCtx.createScriptProcessor(4096, 1, 1);
      recordingProcessorRef.current = processor;

      source.connect(processor);
      processor.connect(audioCtx.destination);

      const silenceThreshold = 0.01;
      const silenceDurationLimit = 1000; // 1 second of silence
      let silenceStart = null;
      let userSpeaking = false;
      let audioBuffer = [];

      console.log("[VAD] Listening for speech...");

      processor.onaudioprocess = (event) => {
        if (!recordingStreamRef.current) return;

        const input = event.inputBuffer.getChannelData(0);
        const rms = Math.sqrt(
          input.reduce((acc, x) => acc + x * x, 0) / input.length
        );
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
            console.log("[VAD] User stopped speaking. Processing audio.");

            stopRecordingResources();
            setAmplitude(0);

            if (audioBuffer.length > 0) {
              const pcmFloat = new Float32Array(audioBuffer);
              const pcmInt16 = new Int16Array(pcmFloat.length);
              for (let i = 0; i < pcmFloat.length; i++) {
                pcmInt16[i] = Math.max(
                  -32768,
                  Math.min(32767, pcmFloat[i] * 32767)
                );
              }

              if (socket && socket.readyState === WebSocket.OPEN) {
                console.log("[Socket] Sending audio buffer to server...");
                bufferingRef.current = true; // Start buffering mode
                audioQueueRef.current = []; // Clear any existing queue
                socket.send(pcmInt16.buffer);
              }
            }
            audioBuffer = [];
          }
        }
      };
    } catch (error) {
      console.error("Error starting recording:", error);
      setAmplitude(0);
      stopRecordingResources();
    }
  };

  const location = useLocation();
  console.log(location.pathname);
  
  useEffect(() => {
    if (location.pathname !== "/tvara") {
      handleLogout();
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    if (socket) {
      if (socket.readyState === WebSocket.OPEN) {
        console.log(
          "[Logout] Sending logout message and closing WebSocket connection..."
        );

        socket.send(JSON.stringify({ type: "logout" }));
        socket.close(1000, "User logout");
      } else if (socket.readyState === WebSocket.CLOSING) {
        console.log("[Logout] WebSocket is already closing...");
      } else if (socket.readyState === WebSocket.CLOSED) {
        console.log("[Logout] WebSocket is already closed.");
      }

      await new Promise((resolve) => {
        const checkClosed = () => {
          if (socket.readyState === WebSocket.CLOSED) {
            console.log("[Logout] WebSocket closed successfully");
            resolve();
          } else {
            setTimeout(checkClosed, 10);
          }
        };
        checkClosed();
      });
    }

    stopRecordingResources();
  };

  return (
    <div className="App">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 40 }}
        style={{ height: "100vh", width: "100%" }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <AnimatedSphere amplitude={amplitude} />
        <OrbitControls enableZoom={true} />
      </Canvas>
      <div className="overlay">
        <button onClick={startRecording} className="speak-button">
          🎤 Speak
        </button>
      </div>
    </div>
  );
}

export default App;
