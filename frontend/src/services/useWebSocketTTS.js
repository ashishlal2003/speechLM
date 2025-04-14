import { useEffect, useRef, useState, useCallback } from 'react';

export default function useWebSocketTTS() {
  const [status, setStatus] = useState(null);
  const [responseText, setResponseText] = useState("");
  const audioContextRef = useRef(null);
  const socketRef = useRef(null);
  const audioQueue = useRef([]);
  const isPlayingRef = useRef(false);
  const responseTimeoutRef = useRef(null);
  // Sample rate matching backend (22050 Hz)
  const SAMPLE_RATE = 22050;

  useEffect(() => {
    // Initialize audio context with matching sample rate
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
      sampleRate: SAMPLE_RATE
    });
    
    // Cleanup function
    return () => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      if (responseTimeoutRef.current) {
        clearTimeout(responseTimeoutRef.current);
      }
    };
  }, []);

  // Process and play PCM audio buffer
  const playPCMAudio = useCallback((arrayBuffer) => {
    if (!audioContextRef.current) return Promise.reject("Audio context not initialized");
    
    // Convert the received bytes back to Float32Array
    const floatArray = new Float32Array(arrayBuffer);
    
    // Create audio buffer with correct sample rate
    const audioBuffer = audioContextRef.current.createBuffer(1, floatArray.length, SAMPLE_RATE);
    
    // Copy PCM data to audio buffer
    const channelData = audioBuffer.getChannelData(0);
    channelData.set(floatArray);
    
    // Create and configure audio source
    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContextRef.current.destination);
    
    return new Promise((resolve) => {
      source.onended = resolve;
      source.start(0);
    });
  }, []);

  // Process audio queue sequentially
  const playNextChunk = useCallback(async () => {
    if (audioQueue.current.length === 0) {
      if (isPlayingRef.current) {
        isPlayingRef.current = false;
        
        // Set a timeout to detect end of stream
        // This assumes we'll get new chunks within 1 second if the stream is continuing
        responseTimeoutRef.current = setTimeout(() => {
          if (audioQueue.current.length === 0) {
            // Response is complete
            setStatus("Disconnected");
            
            // Close WebSocket if still open
            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
              socketRef.current.close();
            }
          }
        }, 1000);
      }
      return;
    }

    // Clear timeout if we're still getting chunks
    if (responseTimeoutRef.current) {
      clearTimeout(responseTimeoutRef.current);
      responseTimeoutRef.current = null;
    }

    isPlayingRef.current = true;
    const chunk = audioQueue.current.shift();
    
    try {
      await playPCMAudio(chunk);
      isPlayingRef.current = false;
      playNextChunk(); // Play next chunk when current one finishes
    } catch (error) {
      console.error("Error playing audio chunk:", error);
      isPlayingRef.current = false;
      playNextChunk(); // Try next chunk on error
    }
  }, [playPCMAudio]);

  // Send audio recording and handle response
  const sendAudioBlob = useCallback((blob) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.close();
    }
    
    if (responseTimeoutRef.current) {
      clearTimeout(responseTimeoutRef.current);
      responseTimeoutRef.current = null;
    }

    // Reset state
    audioQueue.current = [];
    setResponseText("");
    
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result;

      // Connect to WebSocket endpoint
      socketRef.current = new WebSocket("ws://localhost:9009/ws/tts");
      socketRef.current.binaryType = 'arraybuffer'; // Important for binary data

      socketRef.current.onopen = () => {
        setStatus("Connected");
        
        // Resume audio context if suspended (browsers with autoplay restrictions)
        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume().catch(err => console.error("Failed to resume AudioContext:", err));
        }
        
        socketRef.current.send(arrayBuffer);
      };

      socketRef.current.onmessage = (event) => {
        if (event.data instanceof ArrayBuffer) {
          // Queue audio chunk
          audioQueue.current.push(event.data);
          
          // Start playing if not already playing
          if (!isPlayingRef.current) {
            playNextChunk();
          }
        }
      };

      socketRef.current.onclose = () => {
        // Only update status if it's not already been set to Disconnected
        // This prevents race conditions with our timeout-based completion detection
        setStatus(prev => prev === "Connected" ? "Disconnected" : prev);
      };
      
      socketRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setStatus("Error");
      };
    };
    
    reader.readAsArrayBuffer(blob);
  }, [playNextChunk]);

  return { sendAudioBlob, status, responseText };
}
