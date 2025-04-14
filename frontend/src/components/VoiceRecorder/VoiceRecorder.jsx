import { useState, useRef, useEffect } from 'react';
import { Mic, Pause, Loader, Volume2, VolumeX } from 'lucide-react';

export default function VoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const audioPlayerRef = useRef(null);
  
  // Audio visualization state
  const [audioData, setAudioData] = useState(Array(64).fill(0));
  const [amplitude, setAmplitude] = useState(0);
  
  // Ghost mouse effect state
  const [mouseTrail, setMouseTrail] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Particle systems
  const [particles, setParticles] = useState([]);
  const [soundCircles, setSoundCircles] = useState([]);
  
  // Animation frame ID for cleanup
  const requestAnimationFrameId = useRef(null);

  // Handle recording start/stop
  const toggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        
        // Stop audio analysis
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      }
    } else {
      // Start recording
      audioChunksRef.current = [];
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        mediaRecorderRef.current = new MediaRecorder(stream);
        
        // Set up audio analysis
        setupAudioAnalysis(stream);
        
        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };
        
        mediaRecorderRef.current.onstop = sendAudioToBackend;
        
        mediaRecorderRef.current.start();
        setIsRecording(true);
        setAudioURL(null);
        
        // Add interaction - trigger particles on record start
        createExplosion(window.innerWidth / 2, window.innerHeight / 2);
      } catch (err) {
        console.error("Error accessing microphone:", err);
        alert("Could not access microphone. Please check permissions.");
      }
    }
  };

  // Set up audio analysis
  const setupAudioAnalysis = (stream) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      const analyser = audioContext.createAnalyser();
      analyserRef.current = analyser;
      analyser.fftSize = 256; // Power of 2
      
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      
      // Start visualization loop
      visualize();
    } catch (err) {
      console.error("Error setting up audio analysis:", err);
    }
  };

  // Audio visualization loop
  const visualize = () => {
    if (!analyserRef.current) return;
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const updateData = () => {
      if (!analyserRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      setAudioData(Array.from(dataArray));
      
      // Calculate overall amplitude
      const sum = dataArray.reduce((acc, val) => acc + val, 0);
      const avg = sum / dataArray.length / 255;
      setAmplitude(avg);
      
      // Create sound circle on beat detection
      if (avg > 0.25 && Math.random() > 0.7) {
        const x = window.innerWidth * Math.random();
        const y = window.innerHeight * Math.random();
        createSoundCircle(x, y, avg * 100);
      }
      
      requestAnimationFrameId.current = requestAnimationFrame(updateData);
    };
    
    updateData();
  };

  // Create sound circle
  const createSoundCircle = (x, y, radius) => {
    const newCircle = {
      id: Date.now() + Math.random(),
      x,
      y, 
      radius,
      maxRadius: radius * 3,
      opacity: 0.8,
      borderWidth: Math.random() * 10 + 2
    };
    
    setSoundCircles(prev => [...prev, newCircle]);
    
    // Remove circle after animation
    setTimeout(() => {
      setSoundCircles(prev => prev.filter(circle => circle.id !== newCircle.id));
    }, 2000);
  };

  // Create particle explosion
  const createExplosion = (x, y) => {
    const newParticles = Array.from({ length: 30 }, () => ({
      id: Date.now() + Math.random(),
      x,
      y,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      radius: Math.random() * 8 + 2,
      opacity: 1,
      life: 1,
      rotation: Math.random() * 360,
      shape: Math.random() > 0.5 ? 'circle' : 'square'
    }));
    
    setParticles(prev => [...prev, ...newParticles]);
  };

  // Send audio to backend
  const sendAudioToBackend = async () => {
    setIsProcessing(true);
    
    try {
      // Create audio blob from recorded chunks
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      // Create FormData to send to server
      const formData = new FormData();
      formData.append('audio', audioBlob);
      
      // Mock API call - replace with your actual endpoint
      // For demo purposes, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would do:
      // const response = await fetch('your-backend-url/process-audio', {
      //   method: 'POST',
      //   body: formData,
      // });
      // const responseData = await response.json();
      
      // For demo, we'll just use the original recording
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
      
      // Add success particle effect
      createExplosion(window.innerWidth / 2, window.innerHeight / 2);
      
    } catch (err) {
      console.error("Error processing audio:", err);
      alert("Failed to process audio. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Connect audio player to analyzer when it starts playing
  const handleAudioPlay = (event) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      if (!analyserRef.current) {
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
      }
      
      const source = audioContextRef.current.createMediaElementSource(event.target);
      source.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
      
      // Start visualization loop
      visualize();
    } catch (err) {
      console.log("Note: Audio analyzer may already be connected");
    }
  };
  
  // Toggle mute for audio player
  const toggleMute = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.muted = !audioPlayerRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  // Update particles animation
  useEffect(() => {
    if (particles.length > 0) {
      const interval = setInterval(() => {
        setParticles(prev => 
          prev
            .map(p => ({
              ...p,
              x: p.x + p.vx,
              y: p.y + p.vy,
              vx: p.vx * 0.98,
              vy: p.vy * 0.98 + 0.1, // Add gravity
              opacity: p.opacity - 0.02,
              life: p.life - 0.02,
              rotation: p.rotation + 2
            }))
            .filter(p => p.life > 0)
        );
      }, 16);
      
      return () => clearInterval(interval);
    }
  }, [particles]);
  
  // Update sound circles animation
  useEffect(() => {
    if (soundCircles.length > 0) {
      const interval = setInterval(() => {
        setSoundCircles(prev => 
          prev.map(circle => ({
            ...circle,
            radius: circle.radius + 2,
            opacity: circle.opacity - 0.02,
            borderWidth: circle.borderWidth * 0.95
          })).filter(circle => circle.opacity > 0)
        );
      }, 16);
      
      return () => clearInterval(interval);
    }
  }, [soundCircles]);

  // Ghost mouse effect implementation
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      setMousePosition({ x: clientX, y: clientY });
      
      // Add current position to trail
      setMouseTrail(prev => {
        const newTrail = [...prev, { x: clientX, y: clientY, id: Date.now() }];
        if (newTrail.length > 15) {
          return newTrail.slice(newTrail.length - 15);
        }
        return newTrail;
      });
      
      // Occasionally add particles based on mouse movement
      if (isRecording && Math.random() > 0.9) {
        createSoundCircle(clientX, clientY, 20 + amplitude * 40);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isRecording, amplitude]);

  // Fade out trail particles over time
  useEffect(() => {
    if (mouseTrail.length > 0) {
      const timeout = setTimeout(() => {
        setMouseTrail(prev => prev.slice(1));
      }, 50);
      
      return () => clearTimeout(timeout);
    }
  }, [mouseTrail]);
  
  // Handle clicks to create particle effects
  useEffect(() => {
    const handleClick = (e) => {
      createExplosion(e.clientX, e.clientY);
    };
    
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);
  
  // Clean up animations and audio context on unmount
  useEffect(() => {
    return () => {
      if (requestAnimationFrameId.current) {
        cancelAnimationFrame(requestAnimationFrameId.current);
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Audio visualization grid */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="h-full w-full grid grid-cols-8 grid-rows-8 gap-px">
          {Array.from({ length: 64 }).map((_, index) => {
            const intensity = audioData[index] ? audioData[index] / 255 : 0;
            return (
              <div 
                key={`grid-${index}`}
                className="bg-white transition-all duration-100"
                style={{ opacity: intensity * 0.7 }}
              />
            );
          })}
        </div>
      </div>
      
      {/* Sound waveform visualization */}
      <div className="absolute left-0 right-0 top-1/2 h-px z-0">
        <svg className="w-full" style={{ height: '150px', transform: 'translateY(-50%)' }}>
          <path
            d={generateWaveformPath(audioData, window.innerWidth)}
            stroke="white"
            strokeWidth="1"
            fill="none"
            className="transition-all duration-100"
          />
        </svg>
      </div>
      
      {/* Sound circles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {soundCircles.map(circle => (
          <div
            key={circle.id}
            className="absolute rounded-full border-white"
            style={{
              left: circle.x,
              top: circle.y,
              width: circle.radius * 2,
              height: circle.radius * 2,
              borderWidth: circle.borderWidth,
              opacity: circle.opacity,
              transform: 'translate(-50%, -50%)',
              transition: 'border-width 0.2s'
            }}
          />
        ))}
      </div>
      
      {/* Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {particles.map(particle => (
          <div
            key={particle.id}
            className={`absolute bg-white`}
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.radius * 2,
              height: particle.radius * 2,
              opacity: particle.opacity,
              transform: `translate(-50%, -50%) rotate(${particle.rotation}deg)`,
              borderRadius: particle.shape === 'circle' ? '50%' : '0%'
            }}
          />
        ))}
      </div>
      
      {/* Audio frequency visualization */}
      <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end justify-center gap-px z-0">
        {audioData.slice(0, 64).map((value, index) => (
          <div 
            key={`freq-${index}`}
            className="w-2 bg-white"
            style={{ 
              height: `${value * 0.3}px`,
              opacity: value / 510 + 0.05, // Higher contrast
              transition: 'height 0.05s ease'
            }}
          />
        ))}
      </div>
      
      {/* Ghost mouse effect */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {mouseTrail.map((point, index) => {
          const opacity = (index / mouseTrail.length) * 0.6;
          const size = 8 + (index / mouseTrail.length) * 15;
          
          return (
            <div
              key={point.id}
              className="absolute rounded-full bg-white"
              style={{
                left: `${point.x}px`,
                top: `${point.y}px`,
                width: `${size}px`,
                height: `${size}px`,
                opacity: opacity,
                transform: 'translate(-50%, -50%)',
                transition: 'width 0.2s, height 0.2s'
              }}
            />
          );
        })}
        
        {/* Current mouse position */}
        {mousePosition.x > 0 && (
          <div
            className={`absolute rounded-full shadow-lg ${isRecording ? 'bg-white' : 'bg-white'}`}
            style={{
              left: `${mousePosition.x}px`,
              top: `${mousePosition.y}px`,
              width: '20px',
              height: '20px',
              opacity: isRecording ? '0.9' : '0.7',
              transform: 'translate(-50%, -50%)',
              boxShadow: isRecording ? '0 0 20px rgba(255, 255, 255, 0.8)' : '0 0 10px rgba(255, 255, 255, 0.5)'
            }}
          />
        )}
      </div>
      
      {/* Main content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full">
        <div className={`backdrop-blur-lg p-8 rounded-2xl shadow-2xl text-center max-w-md w-full 
                        ${isRecording ? 'bg-opacity-5 border border-white border-opacity-10' : 'bg-black bg-opacity-50 border border-white border-opacity-5'}`}
              style={{ transition: 'all 0.3s ease' }}>
          <h1 className="text-3xl font-bold text-white mb-6">
            {/* Animated Typing Effect */}
            <span className="inline-block relative">
              Audio <span className="text-white opacity-70">Recorder</span>
              <span className={`absolute -bottom-px left-0 bg-white h-px ${isRecording ? 'w-full' : 'w-0'}`} 
                    style={{ transition: 'width 0.8s ease' }}></span>
            </span>
          </h1>
          
          {/* Visual amplitude indicator */}
          <div className="w-full h-1 bg-white bg-opacity-10 rounded-full mb-8 overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-75"
              style={{ width: `${amplitude * 100}%` }}
            />
          </div>
          
          {/* Recording button */}
          <button
            onClick={toggleRecording}
            disabled={isProcessing}
            className={`relative flex items-center justify-center p-8 rounded-full shadow-xl transition-all duration-300 mx-auto mb-6 
                      ${isRecording 
                        ? 'bg-white hover:bg-gray-200' 
                        : 'bg-black hover:bg-gray-900 border border-white border-opacity-30'
                      }`}
          >
            {isRecording ? (
              <Pause size={48} className={`${isRecording ? 'text-black' : 'text-white'}`} />
            ) : (
              <Mic size={48} className="text-white" />
            )}
            
            {/* Circular ripple effect */}
            {isRecording && (
              <>
                <div className="absolute w-full h-full rounded-full bg-white opacity-20 animate-ping"></div>
                <div className="absolute w-full h-full rounded-full border-2 border-white border-opacity-40 animate-pulse"></div>
              </>
            )}
          </button>
          
          <p className="text-lg text-white mb-6">
            {isProcessing ? 'Processing your audio...' : 
             isRecording ? 'Recording in progress... Tap to stop.' : 
             'Tap the microphone to start recording'}
          </p>
          
          {/* Processing indicator */}
          {isProcessing && (
            <div className="flex justify-center mb-4">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-4 border-white border-opacity-10"></div>
                <div className="absolute top-0 bottom-0 left-0 right-0 rounded-full border-t-4 border-white animate-spin"></div>
              </div>
            </div>
          )}
          
          {/* Audio player for response */}
          {audioURL && (
            <div className="mt-6 p-5 bg-opacity-5 border border-white border-opacity-10 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-white">Processed Audio</h2>
                <button onClick={toggleMute} className="text-white p-2">
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
              </div>
              <audio 
                ref={audioPlayerRef}
                controls 
                className="w-full" 
                src={audioURL}
                onPlay={handleAudioPlay}
                style={{ 
                  filter: 'grayscale(1)', 
                  opacity: 0.9,
                  height: '36px'
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function to generate waveform path
function generateWaveformPath(audioData, width) {
  if (!audioData.length) return '';
  
  const height = 100;
  const middle = height / 2;
  const step = width / (audioData.length - 1);
  
  let path = `M 0 ${middle}`;
  
  for (let i = 0; i < audioData.length; i++) {
    const x = i * step;
    const amplitude = (audioData[i] / 255) * middle;
    const y = middle - amplitude;
    path += ` L ${x} ${y}`;
  }
  
  // Mirror the waveform for a symmetrical effect
  for (let i = audioData.length - 1; i >= 0; i--) {
    const x = i * step;
    const amplitude = (audioData[i] / 255) * middle;
    const y = middle + amplitude;
    path += ` L ${x} ${y}`;
  }
  
  path += ' Z'; // Close the path
  return path;
}