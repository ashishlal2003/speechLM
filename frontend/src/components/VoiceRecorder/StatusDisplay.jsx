import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

export default function StatusDisplay({ 
  permissionGranted, 
  isRecording, 
  recordingTime, 
  error, 
  uploadStatus 
}) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mb-8 text-center">
      {permissionGranted === false && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center text-red-500 mb-4"
        >
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>Microphone access required</span>
        </motion.div>
      )}
      
      {isRecording && (
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-center mb-4"
        >
          <div className="inline-block px-4 py-2 bg-red-100 text-red-600 rounded-full">
            Recording... {formatTime(recordingTime)}
          </div>
        </motion.div>
      )}
      
      {error && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-500 mb-4"
        >
          {error}
        </motion.div>
      )}
      
      {uploadStatus === "success" && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-green-500 mb-4"
        >
          Audio successfully uploaded!
        </motion.div>
      )}
    </div>
  );
}
