import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, MeshDistortMaterial, Sphere } from "@react-three/drei";
import "../index.css"; // Assuming this contains styles for .App, .overlay, .speak-button

// Modified AnimatedSphere to take amplitude as a prop
function AnimatedSphere({ amplitude }) { // [[3]] (concept of reacting to audio)
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
      <MeshDistortMaterial color="#eb7067
      " speed={2} />
    </Sphere>
  );
}

function App() {
  const [socket, setSocket] = useState(null);
  const [amplitude, setAmplitude] = useState(0);
  // mediaRecorderRef is not used in the VAD logic, but kept if needed for other types of recording
  const mediaRecorderRef = useRef(null);

  const audioQueueRef = useRef([]);
  const audioContextRef = useRef(null); // For playing back audio
  const isPlayingRef = useRef(false);

  // Refs for recording stream and processor to manage them
  const recordingStreamRef = useRef(null);
  const recordingProcessorRef = useRef(null);
  const recordingAudioContextRef = useRef(null);


  useEffect(() => {
    // AudioContext for playback
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
        const audioData = event.data; // event.data is ArrayBuffer
        try {
            const audioBuffer = await audioContextRef.current.decodeAudioData(audioData.slice(0)); // Use slice(0) to create a copy if needed
            audioQueueRef.current.push(audioBuffer);
            if (!isPlayingRef.current) playAudioQueue();
        } catch (e) {
            console.error("Error decoding audio data:", e);
        }
      }
    };

    return () => {
      ws.close();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      // Ensure recording resources are cleaned up on unmount
      stopRecordingResources();
    };
  }, []);

  const playAudioQueue = () => {
    if (audioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      setAmplitude(0); // Reset amplitude when queue is empty
      return;
    }

    isPlayingRef.current = true;
    const buffer = audioQueueRef.current.shift();
    const sourceNode = audioContextRef.current.createBufferSource();
    sourceNode.buffer = buffer;

    const analyserNode = audioContextRef.current.createAnalyser();
    sourceNode.connect(analyserNode);
    analyserNode.connect(audioContextRef.current.destination); // Connect analyser to output

    const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
    const updateAmplitudeCallback = () => {
      if (!isPlayingRef.current) {
        setAmplitude(0); // Ensure amplitude is zero if not playing
        return;
      }
      analyserNode.getByteTimeDomainData(dataArray);
      const norm = dataArray.reduce((a, b) => a + Math.abs(b - 128), 0) / dataArray.length;
      setAmplitude(norm / 128);
      requestAnimationFrame(updateAmplitudeCallback);
    };

    updateAmplitudeCallback();
    sourceNode.start();
    sourceNode.onended = () => {
        // Check if it was the last item
        if (audioQueueRef.current.length === 0) {
            isPlayingRef.current = false;
            setAmplitude(0); // Reset amplitude when playback ends
        }
        playAudioQueue(); // Continue with the next item or set isPlaying to false
    };
  };

  const stopRecordingResources = () => {
    if (recordingProcessorRef.current) {
      recordingProcessorRef.current.disconnect();
      recordingProcessorRef.current = null;
    }
    if (recordingStreamRef.current) {
      recordingStreamRef.current.getTracks().forEach((track) => track.stop());
      recordingStreamRef.current = null;
    }
    if (recordingAudioContextRef.current && recordingAudioContextRef.current.state !== 'closed') {
      recordingAudioContextRef.current.close();
      recordingAudioContextRef.current = null;
    }
     console.log("[VAD] Recording resources stopped and cleaned up.");
  };

  const startRecording = async () => { // [[4]] [[5]] General concept of audio recording in React
    if (recordingStreamRef.current) {
        console.log("[VAD] Recording already in progress or not cleaned up. Stopping previous.");
        stopRecordingResources(); // Ensure previous resources are stopped
    }
    setAmplitude(0); // Reset amplitude before starting new recording

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recordingStreamRef.current = stream; // Store stream

      recordingAudioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const audioCtx = recordingAudioContextRef.current;

      const source = audioCtx.createMediaStreamSource(stream);
      const processor = audioCtx.createScriptProcessor(4096, 1, 1);
      recordingProcessorRef.current = processor; // Store processor

      source.connect(processor);
      processor.connect(audioCtx.destination); // Essential for onaudioprocess to fire

      const silenceThreshold = 0.01;
      const silenceDurationLimit = 1000; // 1 second of silence
      let silenceStart = null;
      let userSpeaking = false;
      let audioBuffer = [];

      console.log("[VAD] Listening for speech...");

      processor.onaudioprocess = (event) => {
        if (!recordingStreamRef.current) return; // Stop processing if stream is stopped

        const input = event.inputBuffer.getChannelData(0);
        const rms = Math.sqrt(input.reduce((acc, x) => acc + x * x, 0) / input.length);
        setAmplitude(rms); // Update amplitude for sphere animation

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

            stopRecordingResources(); // Stop mic and processor
            setAmplitude(0); // Reset amplitude as recording part is done

            if (audioBuffer.length > 0) {
              const pcmFloat = new Float32Array(audioBuffer);
              const pcmInt16 = new Int16Array(pcmFloat.length);
              for (let i = 0; i < pcmFloat.length; i++) {
                pcmInt16[i] = Math.max(-32768, Math.min(32767, pcmFloat[i] * 32767));
              }

              if (socket && socket.readyState === WebSocket.OPEN) {
                console.log("[Socket] Sending audio buffer to server...");
                socket.send(pcmInt16.buffer);
              }
            }
            audioBuffer = []; // Reset buffer for next time
          }
        }
      };
    } catch (error) {
      console.error("Error starting recording:", error);
      setAmplitude(0); // Ensure amplitude is reset on error
      stopRecordingResources(); // Clean up resources on error
    }
  };

  return (
    <div className="App">
      <Canvas camera={{ position: [0, 0, 10], fov: 40 }} style={{ height: '100vh', width: '100vw' }}>
        <ambientLight intensity={0.5}/> {/* Adjusted intensity slightly */}
        <pointLight position={[10,10,10]} intensity={1}/>
        {/* Removed other lights from original for simplicity, can be added back */}
        {/* <color attach="background" args={['#050520']} /> */}
        
        <AnimatedSphere amplitude={amplitude} />
        
        <OrbitControls enableZoom={true} /> {/* Kept OrbitControls from new snippet, enabled zoom */}
      </Canvas>

      <div className="overlay">
        {/* Button text/functionality could be toggled if needed, e.g., "Stop Recording" [[6]] */}
        <button onClick={startRecording} className="speak-button">
          🎙️ Speak
        </button>
      </div>
    </div>
  );
}

export default App;
