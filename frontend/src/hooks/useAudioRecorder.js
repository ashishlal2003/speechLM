import { useState, useRef, useEffect } from 'react';

export default function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isSilent, setIsSilent] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const analyserRef = useRef(null);
  const silenceStartRef = useRef(null);
  const silenceThresholdRef = useRef(15); // Silence detection threshold in dB
  const silenceDurationRef = useRef(1500); // 1.5 seconds of silence to auto-stop
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (silenceTimerRef.current) clearInterval(silenceTimerRef.current);
      if (audioURL) URL.revokeObjectURL(audioURL);
    };
  }, [audioURL]);
  
  const requestMicrophonePermission = async () => {
    setError(null);
    try {
      setIsLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermissionGranted(true);
      setIsLoading(false);
      return stream;
    } catch (err) {
      setIsLoading(false);
      setError("Microphone permission denied. Please allow access to record audio.");
      setPermissionGranted(false);
      return null;
    }
  };

  // Setup audio analyzer for voice activity detection
  const setupVoiceActivityDetection = (stream) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    
    microphone.connect(analyser);
    analyser.fftSize = 256;
    analyserRef.current = analyser;
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    // Monitor audio levels
    silenceTimerRef.current = setInterval(() => {
      if (!isRecording) return;
      
      analyser.getByteFrequencyData(dataArray);
      
      // Calculate volume level (rough approximation)
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      
      const average = sum / bufferLength;
      const dB = 20 * Math.log10(average / 255);
      
      if (dB < -silenceThresholdRef.current) {
        // If silence detected
        if (silenceStartRef.current === null) {
          silenceStartRef.current = Date.now();
          setIsSilent(true);
        } else if (Date.now() - silenceStartRef.current > silenceDurationRef.current) {
          // If silence lasted long enough, stop recording
          stopRecording(true); // Auto-submission
        }
      } else {
        // If voice detected
        silenceStartRef.current = null;
        setIsSilent(false);
      }
    }, 100);
  };

  const startRecording = async () => {
    setError(null);
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
      setAudioURL(null);
    }
    
    const stream = await requestMicrophonePermission();
    if (!stream) return;
    
    audioChunksRef.current = [];
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
      setRecordingTime(0);
    };
    
    // Reset silence detection
    silenceStartRef.current = null;
    setIsSilent(false);
    
    // Setup voice activity detection
    setupVoiceActivityDetection(stream);
    
    mediaRecorder.start();
    setIsRecording(true);
    
    // Start timer
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = (autoSubmit = false) => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all tracks in the stream
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      // Clear timers
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      if (silenceTimerRef.current) {
        clearInterval(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      
      return autoSubmit;
    }
    return false;
  };

  const deleteRecording = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
      setAudioURL(null);
    }
  };

  const getAudioBlob = async () => {
    if (!audioURL) return null;
    return await fetch(audioURL).then(r => r.blob());
  };

  return {
    isRecording,
    audioURL,
    permissionGranted,
    isLoading,
    error,
    recordingTime,
    isSilent,
    setIsLoading,
    setError,
    requestMicrophonePermission,
    startRecording,
    stopRecording,
    deleteRecording,
    getAudioBlob
  };
}


