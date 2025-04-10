import { useState, useRef, useEffect } from 'react';

export default function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  
  useEffect(() => {
    // Clean up function to handle component unmount
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
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
      setError("Microphone permission denied. Please allow access to record audio.",err);
      setPermissionGranted(false);
      return null;
    }
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
    
    mediaRecorder.start();
    setIsRecording(true);
    
    // Start timer
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all tracks in the stream
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
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
    setIsLoading,
    setError,
    requestMicrophonePermission,
    startRecording,
    stopRecording,
    deleteRecording,
    getAudioBlob
  };
}