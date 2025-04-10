import { Mic, Square, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RecordButton({ 
  isRecording, 
  isLoading, 
  onStartRecording, 
  onStopRecording 
}) {
  return (
    <div className="flex flex-col items-center justify-center mb-8">
      <motion.div 
        initial={{ scale: 1 }}
        animate={{ 
          scale: isRecording ? [1, 1.1, 1] : 1,
          boxShadow: isRecording ? [
            "0 0 0 0 rgba(239, 68, 68, 0.7)",
            "0 0 0 20px rgba(239, 68, 68, 0)"
          ] : "0 0 0 0 rgba(239, 68, 68, 0)"
        }}
        transition={{ 
          repeat: isRecording ? Infinity : 0,
          duration: 1.5
        }}
        className={`rounded-full p-6 mb-4 ${isRecording ? 'bg-red-500' : 'bg-blue-500'} text-white shadow-lg hover:shadow-xl transition-all cursor-pointer`}
      >
        {isLoading ? (
          <Loader className="w-12 h-12 animate-spin" />
        ) : isRecording ? (
          <Square className="w-12 h-12" onClick={onStopRecording} />
        ) : (
          <Mic className="w-12 h-12" onClick={onStartRecording} />
        )}
      </motion.div>
      
      <span className="text-gray-600 text-sm">
        {isRecording ? 'Tap to stop' : 'Tap to start recording'}
      </span>
    </div>
  );
}
