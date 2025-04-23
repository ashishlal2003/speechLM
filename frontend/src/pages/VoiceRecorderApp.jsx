// import { useState, useEffect, useRef } from 'react';
// import { Mic, Pause, Volume2, PlayCircle } from 'lucide-react';
// import useAudioRecorder from '../hooks/useAudioRecorder';
// import useWebSocketTTS from '../hooks/useWebSocketTTS';

// export default function VoiceRecorderApp() {
//   const [circleVisualizationData, setCircleVisualizationData] = useState(Array(60).fill(0));
//   const [isPulsing, setIsPulsing] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const animationRef = useRef(null);

//   const {
//     isRecording,
//     audioURL,
//     permissionGranted,
//     recordingTime,
//     isSilent,
//     requestMicrophonePermission,
//     startRecording,
//     stopRecording,
//     deleteRecording,
//     getAudioBlob
//   } = useAudioRecorder();

//   const { 
//     sendAudioBlob, 
//     replayResponse, 
//     responseText 
//   } = useWebSocketTTS();

//   // Auto-send when recording stops
//   useEffect(() => {
//     let autoSubmitTimeout = null;

//     // Auto-send logic when recording stops and we have audio
//     if (!isRecording && audioURL) {
//       // Small delay to ensure the audio is processed
//       autoSubmitTimeout = setTimeout(() => {
//         handleSendRecording();
//       }, 500);
//     }

//     return () => {
//       if (autoSubmitTimeout) {
//         clearTimeout(autoSubmitTimeout);
//       }
//     };
//   }, [isRecording, audioURL]);

//   // Send recording to server
//   const handleSendRecording = async () => {
//     if (!audioURL) return;
//     setIsLoading(true);

//     try {
//       const audioBlob = await getAudioBlob();
//       await sendAudioBlob(audioBlob);

//       // Auto-delete local recording after sending
//       setTimeout(() => {
//         deleteRecording();
//         setIsLoading(false);
//       }, 1000);
//     } catch (err) {
//       console.error(err);
//       setIsLoading(false);
//     }
//   };

//   // Handle record button action
//   const handleMainButtonClick = () => {
//     if (isRecording) {
//       stopRecording(true);
//     } else if (audioURL) {
//       // If there's audio, replay response
//       replayResponse();
//     } else if (permissionGranted) {
//       startRecording();
//     } else {
//       requestMicrophonePermission();
//     }
//   };

//   // Generate circular audio visualization data
//   useEffect(() => {
//     setIsPulsing(isRecording);

//     const generateVisualization = () => {
//       if (isRecording) {
//         // More dynamic visualization when recording
//         const newData = Array(60).fill(0).map(() => {
//           const baseHeight = Math.random() * 0.7 + 0.3;
//           // Make visualization respond to silence
//           return isSilent ? baseHeight * 0.3 : baseHeight;
//         });
//         setCircleVisualizationData(newData);
//       } else if (isLoading) {
//         // Pulsing visualization when loading
//         const time = Date.now() / 1000;
//         const pulseRate = 2; // Hz
//         const pulseDepth = 0.3;
//         const baseValue = 0.5 + Math.sin(time * pulseRate * Math.PI) * pulseDepth;

//         const newData = Array(60).fill(0).map((_, i) => {
//           const angle = (i / 60) * Math.PI * 2;
//           const variation = Math.sin(angle * 3 + time) * 0.1;
//           return baseValue + variation;
//         });
//         setCircleVisualizationData(newData);
//       } else {
//         // Minimal ambient movement when idle
//         const newData = circleVisualizationData.map(value => {
//           return value * 0.9 + (Math.random() * 0.05);
//         });
//         setCircleVisualizationData(newData);
//       }

//       animationRef.current = requestAnimationFrame(generateVisualization);
//     };

//     animationRef.current = requestAnimationFrame(generateVisualization);

//     return () => {
//       if (animationRef.current) {
//         cancelAnimationFrame(animationRef.current);
//       }
//     };
//   }, [isRecording, isLoading, isSilent]);

//   // Get the appropriate button icon based on current state
//   const getButtonIcon = () => {
//     if (isLoading) {
//       return <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>;
//     } else if (isRecording) {
//       return <Pause size={28} className="text-white" />;
//     } else {
//       return <Mic size={28} className="text-white" />;
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden">
//       {/* Background gradient */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div 
//           className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
//           style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.8) 0%, rgba(99,102,241,0) 70%)' }}
//         ></div>
//         <div 
//           className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-10 blur-3xl"
//           style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.8) 0%, rgba(139,92,246,0) 70%)' }}
//         ></div>
//       </div>

//       {/* Main container */}
//       <div className="relative w-full max-w-2xl mx-auto h-full max-h-screen flex flex-col items-center justify-center">
//         {/* Header */}
//         <div className="relative p-6 text-center z-10 mb-4">
//           <h1 className="text-2xl font-light tracking-wider mb-2">VOICE ASSISTANT</h1>
//           <p className="text-gray-400 text-sm">Just speak and release</p>
//         </div>

//         {/* Main content area */}
//         <div className="relative w-full flex flex-col items-center">
//           {/* Loading overlay */}
//           {isLoading && (
//             <div className="absolute inset-0 z-20 bg-black bg-opacity-70 backdrop-blur-sm rounded-full flex items-center justify-center">
//               <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
//             </div>
//           )}

//           {/* Circular visualization area */}
//           <div className="relative w-64 h-64 rounded-full border border-gray-700 flex items-center justify-center">
//             {/* Pulse rings */}
//             {isPulsing && (
//               <>
//                 <div className="absolute inset-0 rounded-full border border-indigo-500 opacity-30"
//                      style={{ animation: 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}></div>
//                 <div className="absolute inset-0 rounded-full border border-indigo-500 opacity-20"
//                      style={{ animation: 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.5s' }}></div>
//               </>
//             )}

//             {/* Circular visualization */}
//             <div className="absolute inset-0 rounded-full overflow-hidden">
//               <div className="w-full h-full flex items-center justify-center">
//                 <div className="absolute inset-0" style={{ transform: 'rotate(180deg)' }}>
//                   {circleVisualizationData.map((value, index) => {
//                     const angle = (index / circleVisualizationData.length) * Math.PI * 2;
//                     const x = Math.cos(angle);
//                     const y = Math.sin(angle);
//                     const height = value * 40; // Length of visualization bars
//                     const opacity = 0.2 + value * 0.8;

//                     return (
//                       <div
//                         key={index}
//                         className="absolute bg-gradient-to-t from-indigo-600 to-purple-500"
//                         style={{
//                           width: '2px',
//                           height: `${height}px`,
//                           opacity: opacity,
//                           transformOrigin: 'bottom center',
//                           transform: `translate(${x * 128 + 128 - 1}px, ${y * 128 + 128}px) rotate(${angle * (180/Math.PI)}deg)`,
//                           transition: isRecording ? 'height 0.05s ease-out' : 'height 0.3s ease-out, opacity 0.3s ease-out',
//                         }}
//                       ></div>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>

//             {/* Center recording button */}
//             <button
//               onClick={handleMainButtonClick}
//               disabled={isLoading}
//               className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-105 disabled:opacity-70 group"
//             >
//               {getButtonIcon()}

//               {/* Pulsing ring effect */}
//               {isRecording && (
//                 <div className="absolute inset-0 rounded-full border-2 border-white opacity-30 animate-ping"></div>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Response text display area - shown when we have a response */}
//         {responseText && (
//           <div className="mt-8 w-full max-w-md bg-black bg-opacity-40 backdrop-blur-sm rounded-lg p-4">
//             <div className="flex items-start mb-2">
//               <Volume2 size={18} className="text-indigo-400 mt-1 mr-2" />
//               <h3 className="text-indigo-300 font-medium">Assistant Response</h3>
//             </div>
//             <p className="text-gray-200 text-sm leading-relaxed">{responseText}</p>
//             <button 
//               onClick={replayResponse}
//               className="mt-2 text-indigo-400 text-xs flex items-center hover:text-indigo-300"
//             >
//               <PlayCircle size={14} className="mr-1" />
//               Play again
//             </button>
//           </div>
//         )}

//         {/* CSS for animations */}
//         <style jsx>{`
//           @keyframes pulse-ring {
//             0% {
//               transform: scale(0.95);
//               opacity: 0.5;
//             }
//             70% {
//               transform: scale(1.05);
//               opacity: 0.2;
//             }
//             100% {
//               transform: scale(0.95);
//               opacity: 0.5;
//             }
//           }
//         `}</style>
//       </div>
//     </div>
//   );
// }


////////////////////////////////////////////////////////////////////////////////////////////////////////////

// import React, { useState, useEffect, useRef } from 'react';
// import { Mic, Volume2 } from 'lucide-react';
// import useAudioRecorder from '../hooks/useAudioRecorder';
// import useWebSocketTTS from '../hooks/useWebSocketTTS';

// export default function VoiceAssistant() {
//   // State for visualization
//   const [visualizationBars, setVisualizationBars] = useState(Array(32).fill(0));
//   const [visualState, setVisualState] = useState('idle'); // idle, listening, processing, speaking
//   const animationRef = useRef(null);
//   const hasSpeechRef = useRef(false);
  
//   // Timeouts
//   const silenceTimeoutRef = useRef(null);
//   const listenTimeoutRef = useRef(null);

//   const {
//     isRecording,
//     audioURL,
//     permissionGranted,
//     isSilent,
//     requestMicrophonePermission,
//     startRecording,
//     stopRecording,
//     deleteRecording,
//     getAudioBlob
//   } = useAudioRecorder();

//   const {
//     sendAudioBlob,
//     responseText,
//     isProcessing,
//     isPlaying
//   } = useWebSocketTTS();

//   // Request microphone permission when component mounts
//   useEffect(() => {
//     if (!permissionGranted) {
//       requestMicrophonePermission();
//     }
//   }, []);

//   // Auto-listen mode
//   useEffect(() => {
//     if (!isRecording && permissionGranted && visualState === 'idle') {
//       listenTimeoutRef.current = setTimeout(() => {
//         startRecording();
//         setVisualState('listening');
//         hasSpeechRef.current = false; // Reset speech detection flag
//       }, 1000);
//     }

//     return () => {
//       if (listenTimeoutRef.current) {
//         clearTimeout(listenTimeoutRef.current);
//       }
//     };
//   }, [isRecording, permissionGranted, visualState]);

//   // Detect actual speech and handle auto-stop on silence
//   useEffect(() => {
//     if (isRecording) {
//       if (!isSilent) {
//         // If we detect sound, flag that we have speech
//         hasSpeechRef.current = true;
        
//         // Clear any existing silence timeout
//         if (silenceTimeoutRef.current) {
//           clearTimeout(silenceTimeoutRef.current);
//           silenceTimeoutRef.current = null;
//         }
//       } 
//       else if (hasSpeechRef.current) {
//         // Only start silence timeout if we previously detected speech
//         if (!silenceTimeoutRef.current) {
//           silenceTimeoutRef.current = setTimeout(() => {
//             stopRecording();
//             setVisualState('processing');
//           }, 1500); // Stop after 1.5s of silence following speech
//         }
//       }
//     }

//     return () => {
//       if (silenceTimeoutRef.current) {
//         clearTimeout(silenceTimeoutRef.current);
//       }
//     };
//   }, [isRecording, isSilent]);

//   // Auto-send when recording stops, but only if speech was detected
//   useEffect(() => {
//     if (!isRecording && audioURL && hasSpeechRef.current) {
//       handleSendRecording();
//     } else if (!isRecording && audioURL) {
//       // If we stopped but had no speech, clean up and return to idle
//       deleteRecording();
//       setVisualState('idle');
//     }
//   }, [isRecording, audioURL]);

//   // Update visual state based on current activity
//   useEffect(() => {
//     if (isRecording) {
//       setVisualState('listening');
//     } else if (isProcessing) {
//       setVisualState('processing');
//     } else if (isPlaying) {
//       setVisualState('speaking');
//     } else if (responseText && !isProcessing && !isPlaying) {
//       // Return to idle after response
//       setTimeout(() => {
//         setVisualState('idle');
//       }, 1000);
//     }
//   }, [isRecording, isProcessing, isPlaying, responseText]);

//   // Send recording to server
//   const handleSendRecording = async () => {
//     if (!audioURL) return;

//     try {
//       const audioBlob = await getAudioBlob();
//       await sendAudioBlob(audioBlob);
//       deleteRecording();
//     } catch (err) {
//       console.error("Error sending audio:", err);
//       setVisualState('idle');
//       deleteRecording();
//     }
//   };

//   // Handle manual toggle of listening
//   const handleToggleListening = () => {
//     if (isRecording) {
//       stopRecording();
//       // Only process if we detected speech
//       if (hasSpeechRef.current) {
//         setVisualState('processing');
//       } else {
//         setVisualState('idle');
//       }
//     } else if (permissionGranted) {
//       startRecording();
//       setVisualState('listening');
//       hasSpeechRef.current = false;
//     } else {
//       requestMicrophonePermission();
//     }
//   };

//   // Generate cool visualization based on state
//   useEffect(() => {
//     const generateVisualization = () => {
//       const now = Date.now() / 1000;
//       let newBars;
      
//       switch (visualState) {
//         case 'listening':
//           // Dynamic bars that respond to sound level
//           newBars = Array(32).fill(0).map((_, i) => {
//             // Center bars higher than edges for a wave pattern
//             const position = Math.abs((i / 31) - 0.5) * 2; // 0-1 value, 0 at center
//             const baseFactor = 1 - (position * 0.7); // Higher in center
            
//             // Add sound activity influence
//             const activityFactor = isSilent ? 0.3 : 1;
            
//             // Add some randomness for natural movement
//             const randomFactor = Math.random() * 0.3;
            
//             // Combined height factor (0-1)
//             return baseFactor * activityFactor * (0.7 + randomFactor);
//           });
//           break;
          
//         case 'processing':
//           // Circular wave effect
//           newBars = Array(32).fill(0).map((_, i) => {
//             const angle = (i / 32) * Math.PI * 2;
//             const wave = Math.sin(angle * 3 + now * 2) * 0.3 + 0.4;
//             return wave;
//           });
//           break;
          
//         case 'speaking':
//           // Audio response visualization - more energetic waves
//           newBars = Array(32).fill(0).map((_, i) => {
//             // Create multiple frequency waves
//             const highFreq = Math.sin(now * 15 + i * 0.4) * 0.3;
//             const midFreq = Math.sin(now * 7 + i * 0.2) * 0.4;
//             const lowFreq = Math.sin(now * 3 + i * 0.1) * 0.2;
            
//             // Combine frequencies with position-based shape
//             const position = i / 31;
//             const shapeFactor = Math.sin(position * Math.PI) * 0.5 + 0.5;
            
//             return (highFreq + midFreq + lowFreq) * shapeFactor + 0.3;
//           });
//           break;
          
//         default: // 'idle'
//           // Subtle breathing animation
//           const pulse = Math.sin(now * 0.8) * 0.15 + 0.25;
//           newBars = Array(32).fill(0).map((_, i) => {
//             // Make idle state a subtle arc shape
//             const position = i / 31;
//             const arcShape = Math.sin(position * Math.PI) * 0.3;
//             return arcShape + pulse;
//           });
//           break;
//       }

//       setVisualizationBars(newBars);
//       animationRef.current = requestAnimationFrame(generateVisualization);
//     };

//     animationRef.current = requestAnimationFrame(generateVisualization);

//     return () => {
//       if (animationRef.current) {
//         cancelAnimationFrame(animationRef.current);
//       }
//     };
//   }, [visualState, isSilent]);

//   // State-based styling
//   const getStateColor = () => {
//     switch (visualState) {
//       case 'listening': return 'bg-blue-600';
//       case 'processing': return 'bg-indigo-600';
//       case 'speaking': return 'bg-purple-600';
//       default: return 'bg-gray-700';
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
//       {/* Simple background gradient */}
//       <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black"></div>
      
//       {/* Main container */}
//       <div className="relative w-full max-w-sm mx-auto flex flex-col items-center justify-center gap-8">
//         {/* Status text */}
//         <div className="text-center">
//           <p className="text-xl font-light">
//             {visualState === 'listening' ? 'Listening...' : 
//              visualState === 'processing' ? 'Processing...' :
//              visualState === 'speaking' ? 'Speaking...' : 'Ready'}
//           </p>
//         </div>
        
//         {/* Visualization container */}
//         <div className="relative w-64 h-64 flex items-center justify-center">
//           {/* Cool visualization bars */}
//           <div className="absolute inset-0 flex items-center justify-center">
//             <div className="w-56 h-56 rounded-full bg-black bg-opacity-40 flex items-center justify-center">
//               {visualizationBars.map((height, index) => {
//                 const angle = (index / visualizationBars.length) * 360;
//                 const barHeight = height * 80; // Scale factor for bar height
//                 const barWidth = visualState === 'speaking' ? 3 : 2; // Thicker bars when speaking
                
//                 // Color based on state
//                 let barColor;
//                 switch (visualState) {
//                   case 'listening': barColor = 'bg-blue-500'; break;
//                   case 'processing': barColor = 'bg-indigo-500'; break;
//                   case 'speaking': barColor = 'bg-purple-500'; break;
//                   default: barColor = 'bg-gray-500'; break;
//                 }
                
//                 return (
//                   <div
//                     key={index}
//                     className={`absolute ${barColor} rounded-full`}
//                     style={{
//                       height: `${barHeight}px`,
//                       width: `${barWidth}px`,
//                       transformOrigin: 'bottom',
//                       transform: `rotate(${angle}deg) translateY(-50%)`,
//                       transition: visualState === 'listening' ? 'height 0.05s ease-out' : 'height 0.2s ease-out',
//                       opacity: 0.2 + height * 0.8 // Dynamic opacity
//                     }}
//                   />
//                 );
//               })}
//             </div>
//           </div>
          
//           {/* Center button */}
//           <button
//             onClick={handleToggleListening}
//             className={`z-10 w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${getStateColor()} transition-all duration-300`}
//           >
//             {visualState === 'listening' ? (
//               <Mic size={24} className="text-white animate-pulse" />
//             ) : visualState === 'speaking' ? (
//               <Volume2 size={24} className="text-white" />
//             ) : visualState === 'processing' ? (
//               <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//             ) : (
//               <Mic size={24} className="text-white" />
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


///////////////////////////////////////////////////////////////

import React, { useState, useEffect, useRef } from 'react';
import { Mic, Volume2 } from 'lucide-react';
import useAudioRecorder from '../hooks/useAudioRecorder';
import useWebSocketTTS from '../hooks/useWebSocketTTS';

export default function VoiceAssistant() {
  // State
  const [animationSize, setAnimationSize] = useState(0);
  const [animationOpacity, setAnimationOpacity] = useState(0.5);
  const [animationColor, setAnimationColor] = useState('bg-blue-500');
  const [currentState, setCurrentState] = useState('idle'); // idle, listening, processing, speaking
  
  // Animation frame ref
  const animationRef = useRef(null);
  
  // Track if speech was detected
  const hasSpeechRef = useRef(false);
  
  // Timeout refs
  const silenceTimeoutRef = useRef(null);
  const listenTimeoutRef = useRef(null);

  const {
    isRecording,
    audioURL,
    permissionGranted,
    isSilent,
    requestMicrophonePermission,
    startRecording,
    stopRecording,
    deleteRecording,
    getAudioBlob
  } = useAudioRecorder();

  const {
    sendAudioBlob,
    responseText,
    isProcessing,
    isPlaying
  } = useWebSocketTTS();

  // Request microphone permission when component mounts
  useEffect(() => {
    if (!permissionGranted) {
      requestMicrophonePermission();
    }
  }, []);

  // Auto-listen mode
  useEffect(() => {
    if (!isRecording && permissionGranted && currentState === 'idle') {
      listenTimeoutRef.current = setTimeout(() => {
        startRecording();
        setCurrentState('listening');
        hasSpeechRef.current = false;
      }, 1000);
    }

    return () => {
      if (listenTimeoutRef.current) {
        clearTimeout(listenTimeoutRef.current);
      }
    };
  }, [isRecording, permissionGranted, currentState]);

  // Speech detection and auto-stop
  useEffect(() => {
    if (isRecording) {
      if (!isSilent) {
        // Speech detected
        hasSpeechRef.current = true;
        
        // Clear silence timeout
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
          silenceTimeoutRef.current = null;
        }
      } 
      else if (hasSpeechRef.current) {
        // Start silence timer after speech
        if (!silenceTimeoutRef.current) {
          silenceTimeoutRef.current = setTimeout(() => {
            stopRecording();
            setCurrentState('processing');
          }, 1500);
        }
      }
    }

    return () => {
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, [isRecording, isSilent]);

  // Auto-send when recording stops (only if speech detected)
  useEffect(() => {
    if (!isRecording && audioURL && hasSpeechRef.current) {
      handleSendRecording();
    } else if (!isRecording && audioURL) {
      // No speech detected, clean up
      deleteRecording();
      setCurrentState('idle');
    }
  }, [isRecording, audioURL]);

  // Update state based on current activity
  useEffect(() => {
    if (isRecording) {
      setCurrentState('listening');
    } else if (isProcessing) {
      setCurrentState('processing');
    } else if (isPlaying) {
      setCurrentState('speaking');
    } else if (responseText && !isProcessing && !isPlaying) {
      setTimeout(() => setCurrentState('idle'), 1000);
    }
  }, [isRecording, isProcessing, isPlaying, responseText]);

  // Send recording
  const handleSendRecording = async () => {
    if (!audioURL) return;

    try {
      const audioBlob = await getAudioBlob();
      await sendAudioBlob(audioBlob);
      deleteRecording();
    } catch (err) {
      console.error("Error sending audio:", err);
      setCurrentState('idle');
      deleteRecording();
    }
  };

  // Toggle listening manually
  const handleToggleListening = () => {
    if (isRecording) {
      stopRecording();
      if (hasSpeechRef.current) {
        setCurrentState('processing');
      } else {
        setCurrentState('idle');
      }
    } else if (permissionGranted) {
      startRecording();
      setCurrentState('listening');
      hasSpeechRef.current = false;
    } else {
      requestMicrophonePermission();
    }
  };

  // Simple animation based on state
  useEffect(() => {
    // Set base animation properties for each state
    switch (currentState) {
      case 'listening':
        setAnimationColor('bg-blue-500');
        break;
      case 'processing':
        setAnimationColor('bg-indigo-600');
        break;
      case 'speaking':
        setAnimationColor('bg-purple-600');
        break;
      default: // idle
        setAnimationColor('bg-gray-500');
    }
    
    // Animation loop
    const animate = () => {
      const time = Date.now() / 1000;
      
      switch (currentState) {
        case 'listening':
          // Responsive ripple animation - changes with voice input
          const speechFactor = isSilent ? 0.3 : 1;
          setAnimationSize(30 + (Math.sin(time * 4) * 5 * speechFactor));
          setAnimationOpacity(0.5 + (Math.sin(time * 4) * 0.2 * speechFactor));
          break;
          
        case 'processing':
          // Steady pulsing animation
          setAnimationSize(40 + Math.sin(time * 2) * 15);
          setAnimationOpacity(0.4 + Math.sin(time * 2) * 0.2);
          break;
          
        case 'speaking':
          // Dynamic wave animation for audio response
          const wave1 = Math.sin(time * 5) * 8;
          const wave2 = Math.sin(time * 12) * 5;
          setAnimationSize(45 + wave1 + wave2);
          setAnimationOpacity(0.6 + Math.sin(time * 8) * 0.2);
          break;
          
        default: // idle
          // Subtle breathing animation
          setAnimationSize(20 + Math.sin(time * 0.8) * 5);
          setAnimationOpacity(0.3 + Math.sin(time * 0.8) * 0.1);
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentState, isSilent]);

  // Get button icon based on state
  const getButtonIcon = () => {
    switch (currentState) {
      case 'listening':
        return <Mic size={24} className="text-white" />;
      case 'processing':
        return <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>;
      case 'speaking':
        return <Volume2 size={24} className="text-white" />;
      default:
        return <Mic size={24} className="text-white" />;
    }
  };

  // Get button color based on state
  const getButtonColor = () => {
    switch (currentState) {
      case 'listening': return 'bg-blue-600';
      case 'processing': return 'bg-indigo-600';
      case 'speaking': return 'bg-purple-600';
      default: return 'bg-gray-700';
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="relative w-full max-w-sm mx-auto flex flex-col items-center justify-center gap-8">
        {/* Status text */}
        <div className="text-center">
          <p className="text-lg font-light tracking-wide">
            {currentState === 'listening' ? 'Listening...' : 
             currentState === 'processing' ? 'Processing...' :
             currentState === 'speaking' ? 'Speaking...' : 'Ready'}
          </p>
        </div>
        
        {/* Simple animation container */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Animated circles */}
          <div 
            className={`absolute rounded-full ${animationColor} blur-sm transition-opacity duration-200`}
            style={{
              width: `${animationSize}px`,
              height: `${animationSize}px`,
              opacity: animationOpacity,
              transition: 'width 0.2s ease-out, height 0.2s ease-out'
            }}
          />
          
          <div 
            className={`absolute rounded-full ${animationColor} opacity-30`}
            style={{
              width: `${animationSize * 1.5}px`,
              height: `${animationSize * 1.5}px`,
              transition: 'width 0.5s ease-out, height 0.5s ease-out'
            }}
          />
          
          <div 
            className={`absolute rounded-full ${animationColor} opacity-10`}
            style={{
              width: `${animationSize * 2}px`,
              height: `${animationSize * 2}px`,
              transition: 'width 0.8s ease-out, height 0.8s ease-out'
            }}
          />
          
          {/* Center button */}
          <button
            onClick={handleToggleListening}
            className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${getButtonColor()} transition-all duration-300`}
          >
            {getButtonIcon()}
            
            {/* Active recording indication */}
            {currentState === 'listening' && (
              <span className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-white opacity-40 animate-ping" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}