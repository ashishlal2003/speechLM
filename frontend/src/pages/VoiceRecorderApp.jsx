import { useState, useEffect, useRef } from 'react';
import { Mic, Pause, Send, Trash2, AlertCircle, X, PlayCircle, Volume2 } from 'lucide-react';
import useAudioRecorder from '../hooks/useAudioRecorder';
import useWebSocketTTS from '../hooks/useWebSocketTTS';

export default function PremiumVoiceRecorder() {
  const [uploadStatus, setUploadStatus] = useState(null);
  const [circleVisualizationData, setCircleVisualizationData] = useState(Array(60).fill(0));
  const [horizontalWaveData, setHorizontalWaveData] = useState(Array(100).fill(0));
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const animationRef = useRef(null);
  const waveAnimationRef = useRef(null);
  const audioRef = useRef(null);
  
  const {
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
  } = useAudioRecorder();

  const { sendAudioBlob, status } = useWebSocketTTS();

  // Send recording to server
  const sendRecording = async () => {
    if (!audioURL) return;
    setIsLoading(true);
    setError(null);
    setUploadStatus("sending");

    try {
      const audioBlob = await getAudioBlob();
      sendAudioBlob(audioBlob);
      setUploadStatus("success");
      setTimeout(() => setUploadStatus(null), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to send audio. Please try again.");
      setUploadStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle audio playback
  const togglePlayback = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Reset playback when ended
  useEffect(() => {
    const handleEnded = () => {
      setIsPlaying(false);
    };
    
    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleEnded);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, [audioURL]);

  // Generate circular audio visualization data
  useEffect(() => {
    setIsPulsing(isRecording || isPlaying);
    
    const generateVisualization = () => {
      if (isRecording || isPlaying) {
        const newData = Array(60).fill(0).map(() => {
          const baseHeight = Math.random() * 0.7 + 0.3;
          return baseHeight;
        });
        setCircleVisualizationData(newData);
      } else if (audioURL) {
        // Static visualization when audio exists but not playing
        const newData = circleVisualizationData.map(value => {
          return value * 0.95 + (Math.random() * 0.1);
        });
        setCircleVisualizationData(newData);
      } else {
        // Minimal ambient movement when idle
        const newData = circleVisualizationData.map(value => {
          return value * 0.9 + (Math.random() * 0.05);
        });
        setCircleVisualizationData(newData);
      }
      
      animationRef.current = requestAnimationFrame(generateVisualization);
    };
    
    animationRef.current = requestAnimationFrame(generateVisualization);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRecording, isPlaying, audioURL]);

  // Generate horizontal wave animation data
  useEffect(() => {
    const generateWaveAnimation = () => {
      // Use a different pattern for horizontal wave animation
      if (isRecording || isPlaying) {
        // More dynamic wave when recording/playing
        const newData = [];
        for (let i = 0; i < 100; i++) {
          // Create a more natural wave pattern using sine functions
          const baseValue = Math.sin(Date.now() / 500 + i / 5) * 0.3 + 0.5;
          const randomFactor = Math.random() * 0.3;
          newData.push(baseValue + randomFactor);
        }
        setHorizontalWaveData(newData);
      } else if (audioURL) {
        // Subtle movement when audio exists but not playing
        const newData = [];
        for (let i = 0; i < 100; i++) {
          const baseValue = Math.sin(Date.now() / 1500 + i / 10) * 0.15 + 0.25;
          newData.push(baseValue);
        }
        setHorizontalWaveData(newData);
      } else {
        // Very minimal movement when idle
        const newData = [];
        for (let i = 0; i < 100; i++) {
          const baseValue = Math.sin(Date.now() / 2000 + i / 15) * 0.1 + 0.15;
          newData.push(baseValue);
        }
        setHorizontalWaveData(newData);
      }
      
      waveAnimationRef.current = requestAnimationFrame(generateWaveAnimation);
    };
    
    waveAnimationRef.current = requestAnimationFrame(generateWaveAnimation);
    
    return () => {
      if (waveAnimationRef.current) {
        cancelAnimationFrame(waveAnimationRef.current);
      }
    };
  }, [isRecording, isPlaying, audioURL]);

  // Format recording time (MM:SS format)
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.8) 0%, rgba(99,102,241,0) 70%)' }}
        ></div>
        <div 
          className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.8) 0%, rgba(139,92,246,0) 70%)' }}
        ></div>
      </div>

      {/* Main container - limiting to ~50% width */}
      <div className="relative w-full max-w-2xl mx-auto h-full max-h-screen flex flex-col items-center justify-center">
        {/* Header */}
        <div className="relative p-6 text-center z-10 mb-4">
          <h1 className="text-2xl font-light tracking-wider mb-2">VOICE STUDIO</h1>
          <p className="text-gray-400 text-sm">Professional Voice Recording</p>
        </div>

        {/* Main content area */}
        <div className="relative w-full flex flex-col items-center">
          {/* Horizontal wave visualization */}
          <div className="relative w-full h-24 mb-8 overflow-hidden">
            <div className="absolute inset-0 flex items-center">
              {horizontalWaveData.map((value, index) => (
                <div
                  key={index}
                  className="flex-1 h-full flex items-center justify-center"
                  style={{ minWidth: '2px' }}
                >
                  <div
                    className="w-1 bg-gradient-to-t from-indigo-600 to-purple-500 rounded-full"
                    style={{
                      height: `${value * 100}%`,
                      opacity: 0.3 + value * 0.7,
                      transition: isRecording || isPlaying ? 'height 0.05s ease-out' : 'height 0.3s ease-out',
                      transform: `scaleY(${isRecording || isPlaying ? 1 : 0.98})`,
                    }}
                  ></div>
                </div>
              ))}
            </div>
          </div>

          {/* Circular visualization area */}
          <div className="relative w-64 h-64 rounded-full border border-gray-700 flex items-center justify-center">
            {/* Pulse rings */}
            {isPulsing && (
              <>
                <div className="absolute inset-0 rounded-full border border-indigo-500 opacity-30"
                     style={{ animation: 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}></div>
                <div className="absolute inset-0 rounded-full border border-indigo-500 opacity-20"
                     style={{ animation: 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.5s' }}></div>
              </>
            )}
            
            {/* Circular visualization */}
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                <div className="absolute inset-0" style={{ transform: 'rotate(180deg)' }}>
                  {circleVisualizationData.map((value, index) => {
                    const angle = (index / circleVisualizationData.length) * Math.PI * 2;
                    const x = Math.cos(angle);
                    const y = Math.sin(angle);
                    const height = value * 40; // Length of visualization bars
                    const opacity = 0.2 + value * 0.8;
                    
                    return (
                      <div
                        key={index}
                        className="absolute bg-gradient-to-t from-indigo-600 to-purple-500"
                        style={{
                          width: '2px',
                          height: `${height}px`,
                          opacity: opacity,
                          transformOrigin: 'bottom center',
                          transform: `translate(${x * 128 + 128 - 1}px, ${y * 128 + 128}px) rotate(${angle * (180/Math.PI)}deg)`,
                          transition: isRecording ? 'height 0.05s ease-out' : 'height 0.3s ease-out, opacity 0.3s ease-out',
                        }}
                      ></div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Center recording button */}
            <button
              onClick={isRecording ? stopRecording : (audioURL ? togglePlayback : (permissionGranted ? startRecording : requestMicrophonePermission))}
              disabled={isLoading}
              className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-105 disabled:opacity-70 group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : isRecording ? (
                <Pause size={28} className="text-white" />
              ) : audioURL ? (
                isPlaying ? <Pause size={28} className="text-white" /> : <PlayCircle size={28} className="text-white" />
              ) : (
                <Mic size={28} className="text-white" />
              )}
              
              {/* Pulsing ring effect */}
              {isRecording && (
                <div className="absolute inset-0 rounded-full border-2 border-white opacity-30 animate-ping"></div>
              )}
            </button>
          </div>
          
          {/* Status badge */}
          <div className="absolute top-32 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-40 backdrop-blur-sm px-4 py-2 rounded-full">
            <div className="flex items-center text-sm">
              <div className={`w-2 h-2 rounded-full mr-2 ${
                isRecording ? 'bg-red-500 animate-pulse' : 
                audioURL ? 'bg-green-500' : 
                'bg-gray-400'
              }`}></div>
              <span>
                {isRecording ? `Recording ${formatTime(recordingTime)}` : 
                 audioURL ? 'Ready' : 
                 'Click to record'}
              </span>
            </div>
          </div>
          
          {/* Error message */}
          {error && (
            <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 bg-red-900 bg-opacity-80 backdrop-blur-sm px-4 py-2 rounded-md flex items-center">
              <AlertCircle size={16} className="mr-2" />
              <span className="text-sm">{error}</span>
              <button onClick={() => setError(null)} className="ml-2 opacity-70 hover:opacity-100">
                <X size={14} />
              </button>
            </div>
          )}
          
          {/* Upload status message */}
          {uploadStatus && (
            <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 backdrop-blur-sm px-4 py-2 rounded-md flex items-center">
              {uploadStatus === "sending" && <div className="w-3 h-3 mr-2 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>}
              {uploadStatus === "success" && <div className="w-3 h-3 mr-2 rounded-full bg-green-500"></div>}
              {uploadStatus === "error" && <div className="w-3 h-3 mr-2 rounded-full bg-red-500"></div>}
              <span className="text-sm">
                {uploadStatus === "sending" ? "Sending audio..." : 
                 uploadStatus === "success" ? "Audio sent successfully!" : 
                 "Failed to send audio"}
              </span>
            </div>
          )}
        </div>
        
        {/* Audio controls if recording exists */}
        {audioURL && (
          <div className="mt-8 flex space-x-4">
            <audio ref={audioRef} src={audioURL} className="hidden" />
            
            <button 
              onClick={deleteRecording}
              disabled={isLoading}
              className="w-12 h-12 rounded-full bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-opacity-60 disabled:opacity-50"
            >
              <Trash2 size={20} className="text-white" />
            </button>
              
            <button 
              onClick={sendRecording}
              disabled={isLoading}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-700 flex items-center justify-center transition-all hover:scale-105 disabled:opacity-50"
            >
              <Send size={20} className="text-white" />
            </button>
          </div>
        )}
        
        {/* WebSocket status indicator */}
        {status && (
          <div className="mt-4 bg-black bg-opacity-30 backdrop-blur-sm px-3 py-1 rounded-full">
            <div className="flex items-center text-xs text-gray-300">
              <Volume2 size={12} className="mr-1" />
              {status}
            </div>
          </div>
        )}
        
        {/* Permission request overlay */}
        {permissionGranted === false && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-md z-20">
            <div className="text-center p-8 max-w-sm bg-gray-900 bg-opacity-80 border border-gray-800 rounded-lg shadow-2xl">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-indigo-900 bg-opacity-50 flex items-center justify-center">
                <Mic size={30} className="text-indigo-300" />
              </div>
              <h3 className="text-xl font-medium mb-3">Microphone Access</h3>
              <p className="text-gray-300 text-sm mb-6">Please allow microphone access to create high-quality voice recordings</p>
              <button
                onClick={requestMicrophonePermission}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
              >
                Enable Microphone
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes pulse-ring {
          0% {
            transform: scale(0.95);
            opacity: 0.5;
          }
          70% {
            transform: scale(1.1);
            opacity: 0;
          }
          100% {
            transform: scale(0.95);
            opacity: 0;
          }
        }
        
        @keyframes wave-animation {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}