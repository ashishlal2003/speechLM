import React, { useEffect, useRef, useState } from "react";

function App() {
  const [sttSocket, setSttSocket] = useState(null);
  const [ttsSocket, setTtsSocket] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [textToSynthesize, setTextToSynthesize] = useState("");
  const [isListening, setIsListening] = useState(false);
  
  // Refs for VAD processing
  const audioContextRef = useRef(null);
  const streamRef = useRef(null);
  const processorRef = useRef(null);
  const audioBufferRef = useRef([]);
  const isSpeakingRef = useRef(false);
  const silenceStartRef = useRef(null);
  
  // IMPORTANT: Store socket reference directly in ref for reliable access in audio processor
  const sttSocketRef = useRef(null);
  
  // Refs for TTS audio playback
  const audioQueueRef = useRef([]);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    // Create WebSocket connections
    const sttWs = new WebSocket("ws://localhost:8000/ws/stt");
    const ttsWs = new WebSocket("ws://localhost:8000/ws/tts");
    
    // Store socket reference in ref immediately for direct access
    sttSocketRef.current = sttWs;
    
    // Set binary type for proper binary data transmission
    sttWs.binaryType = "arraybuffer";

    sttWs.onopen = () => {
      console.log("STT WebSocket connection established");
      setSttSocket(sttWs);
    };

    sttWs.onclose = () => {
      console.log("STT WebSocket connection closed");
      // Clear the refs when connection is closed
      sttSocketRef.current = null;
      setSttSocket(null);
    };

    sttWs.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "transcription") {
          setTranscription(data.text);
        }
      } catch (error) {
        console.error("Error parsing STT WebSocket message:", error);
      }
    };

    ttsWs.onmessage = async (event) => {
      const arrayBuffer = await event.data.arrayBuffer();
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      audioQueueRef.current.push(audioBuffer);
      if (!isPlayingRef.current) {
        playAudioQueue();
      }
    };

    setTtsSocket(ttsWs);

    return () => {
      stopVAD();
      sttWs.close();
      ttsWs.close();
      // Clear the refs when component unmounts
      sttSocketRef.current = null;
    };
  }, []);

  // Start listening automatically when WebSocket is ready
  useEffect(() => {
    if (sttSocket && !isListening) {
      startContinuousVAD();
    }
  }, [sttSocket, isListening]);

  const playAudioQueue = () => {
    if (audioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      return;
    }

    isPlayingRef.current = true;
    const buffer = audioQueueRef.current.shift();
    
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    source.start();
    source.onended = playAudioQueue;
  };

  const startContinuousVAD = async () => {
    if (isListening) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;
      
      source.connect(processor);
      processor.connect(audioContext.destination);
      
      const silenceThreshold = 0.01;
      const silenceDurationLimit = 1000; // ms
      
      // Reset state
      audioBufferRef.current = [];
      isSpeakingRef.current = false;
      silenceStartRef.current = null;
      
      processor.onaudioprocess = (event) => {
        const input = event.inputBuffer.getChannelData(0);
        
        // Calculate RMS for voice activity detection
        const rms = Math.sqrt(
          input.reduce((acc, x) => acc + x * x, 0) / input.length
        );
        
        if (rms > silenceThreshold) {
          // Voice detected
          silenceStartRef.current = null;
          
          if (!isSpeakingRef.current) {
            console.log("Speech started");
            isSpeakingRef.current = true;
            // Clear buffer when starting new speech
            audioBufferRef.current = [];
          }
          
          // Copy audio data to buffer
          const inputCopy = new Float32Array(input.length);
          inputCopy.set(input);
          audioBufferRef.current.push(inputCopy);
          
        } else if (isSpeakingRef.current) {
          // Silence after speech
          if (!silenceStartRef.current) {
            silenceStartRef.current = Date.now();
          }
          
          // If silence duration exceeds limit, process the audio
          if (Date.now() - silenceStartRef.current > silenceDurationLimit) {
            console.log("Speech ended, processing audio");
            isSpeakingRef.current = false;
            
            // Process the accumulated audio data
            const totalLength = audioBufferRef.current.reduce((acc, buf) => acc + buf.length, 0);
            if (totalLength > 0) {
              // Merge all audio buffers
              const mergedBuffer = new Float32Array(totalLength);
              let offset = 0;
              for (const buffer of audioBufferRef.current) {
                mergedBuffer.set(buffer, offset);
                offset += buffer.length;
              }
              
              // Convert float32 (-1.0 to 1.0) to int16 (-32768 to 32767)
              const pcmBuffer = new Int16Array(mergedBuffer.length);
              for (let i = 0; i < mergedBuffer.length; i++) {
                const sample = Math.max(-1, Math.min(1, mergedBuffer[i]));
                pcmBuffer[i] = Math.round(sample < 0 ? sample * 0x8000 : sample * 0x7FFF);
              }
              
              // IMPORTANT: Use the direct ref to the WebSocket instead of the state variable
              if (sttSocketRef.current && sttSocketRef.current.readyState === WebSocket.OPEN) {
                console.log(`Sending ${pcmBuffer.buffer.byteLength} bytes of audio data`);
                sttSocketRef.current.send(pcmBuffer.buffer);
              } else {
                console.error("WebSocket not ready:", 
                  sttSocketRef.current ? `State: ${sttSocketRef.current.readyState}` : "Socket is null");
              }
            }
            
            // Reset buffer for next utterance
            audioBufferRef.current = [];
            silenceStartRef.current = null;
          }
        }
      };
      
      setIsListening(true);
      console.log("Continuous listening started");
      
    } catch (error) {
      console.error("Error starting VAD:", error);
    }
  };
  
  const stopVAD = () => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setIsListening(false);
    console.log("VAD stopped");
  };

  const handleTts = () => {
    if (textToSynthesize && ttsSocket && ttsSocket.readyState === WebSocket.OPEN) {
      ttsSocket.send(JSON.stringify({ text: textToSynthesize }));
    }
  };

  return (
    <div>
      <h1>Speech-to-Text and Text-to-Speech Test</h1>

      <h2>Speech-to-Text</h2>
      <div>Status: {isListening ? "Listening (VAD Active)" : "Not Listening"}</div>
      <button onClick={startContinuousVAD} disabled={isListening || !sttSocket}>
        Start Listening
      </button>
      <button onClick={stopVAD} disabled={!isListening}>
        Stop Listening
      </button>
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

// import React, { useEffect, useRef, useState } from "react";

// function App() {
//   const [sttSocket, setSttSocket] = useState(null);
//   const [ttsSocket, setTtsSocket] = useState(null);
//   const [transcription, setTranscription] = useState("");
//   const [textToSynthesize, setTextToSynthesize] = useState("");
//   const mediaRecorderRef = useRef(null);

//   // Refs for real-time audio playback
//   const audioQueueRef = useRef([]);
//   const audioContextRef = useRef(null);
//   const isPlayingRef = useRef(false);

//   useEffect(() => {
//     // Create AudioContext only once
//     audioContextRef.current = new (window.AudioContext ||
//       window.webkitAudioContext)();

//     const sttWs = new WebSocket("ws://localhost:8000/ws/stt");
//     const ttsWs = new WebSocket("ws://localhost:8000/ws/tts");

//     sttWs.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       if (data.type === "transcription") {
//         setTranscription(data.text);
//       }
//     };

//     ttsWs.onmessage = async (event) => {
//       const arrayBuffer = await event.data.arrayBuffer();
//       const audioBuffer = await audioContextRef.current.decodeAudioData(
//         arrayBuffer
//       );

//       // Push to playback queue
//       audioQueueRef.current.push(audioBuffer);
//       if (!isPlayingRef.current) {
//         playAudioQueue();
//       }
//     };

//     setSttSocket(sttWs);
//     setTtsSocket(ttsWs);

//     return () => {
//       sttWs.close();
//       ttsWs.close();
//       if (audioContextRef.current) {
//         audioContextRef.current.close();
//       }
//     };
//   }, []);

//   const playAudioQueue = () => {
//     if (audioQueueRef.current.length === 0) {
//       isPlayingRef.current = false;
//       return;
//     }

//     isPlayingRef.current = true;
//     const buffer = audioQueueRef.current.shift();

//     const source = audioContextRef.current.createBufferSource();
//     source.buffer = buffer;
//     source.connect(audioContextRef.current.destination);
//     source.start();

//     source.onended = () => {
//       playAudioQueue();
//     };
//   };

//   const startRecording = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     const audioContext = new (window.AudioContext ||
//       window.webkitAudioContext)();
//     const source = audioContext.createMediaStreamSource(stream);
//     const processor = audioContext.createScriptProcessor(4096, 1, 1);

//     source.connect(processor);
//     processor.connect(audioContext.destination);

//     const silenceThreshold = 0.01; // Adjust based on mic sensitivity
//     const silenceDurationLimit = 1000; // in ms
//     let silenceStart = null;
//     let isSpeaking = false;

//     // Buffer to accumulate audio data
//     let audioBuffer = [];

//     processor.onaudioprocess = async (event) => {
//       const input = event.inputBuffer.getChannelData(0);
//       const rms = Math.sqrt(
//         input.reduce((acc, x) => acc + x * x, 0) / input.length
//       );

//       if (rms > silenceThreshold) {
//         // Detected speaking
//         silenceStart = null;
//         if (!isSpeaking) {
//           isSpeaking = true;
//           console.log("[VAD] Started speaking");
//         }

//         // Buffer audio while speaking
//         audioBuffer.push(...input);
//       } else if (isSpeaking) {
//         // Detected silence, stop recording
//         if (!silenceStart) silenceStart = Date.now();
//         if (Date.now() - silenceStart > silenceDurationLimit) {
//           isSpeaking = false;
//           console.log("[VAD] Detected silence. Stopping speaking...");
//           silenceStart = null;

//           // Stop the audio stream
//           processor.disconnect();
//           source.disconnect();
//           stream.getTracks().forEach((track) => track.stop());

//           // Convert buffered audio to Int16 PCM format and send once
//           const pcm = audioBuffer.map((sample) => sample * 32767); // float32 to int16
//           const buffer = new Int16Array(pcm);

//           // Send the final buffered audio as a single chunk to the backend
//           if (sttSocket && sttSocket.readyState === WebSocket.OPEN) {
//             sttSocket.send(buffer.buffer);
//           }

//           // Reset the audio buffer for the next recording
//           audioBuffer = [];
//         }
//       }
//     };
//   };

//   const handleTts = () => {
//     if (textToSynthesize && ttsSocket) {
//       ttsSocket.send(JSON.stringify({ text: textToSynthesize }));
//     }
//   };

//   return (
//     <div>
//       <h1>Speech-to-Text and Text-to-Speech Test</h1>

//       <h2>Speech-to-Text</h2>
//       <button onClick={startRecording}>Start STT</button>
//       <div>Transcription: {transcription}</div>

//       <h2>Text-to-Speech</h2>
//       <textarea
//         rows="4"
//         cols="50"
//         placeholder="Type text here..."
//         value={textToSynthesize}
//         onChange={(e) => setTextToSynthesize(e.target.value)}
//       ></textarea>
//       <br />
//       <button onClick={handleTts}>Start TTS</button>
//     </div>
//   );
// }

// export default App;