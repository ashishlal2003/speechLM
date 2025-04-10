import { Trash2, Send, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AudioPlayer({ 
  audioURL, 
  onDelete, 
  onSend, 
  isLoading 
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <audio 
        controls 
        src={audioURL} 
        className="w-full h-12 mb-4"
      />
      
      <div className="flex justify-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onDelete}
          className="flex items-center justify-center p-3 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSend}
          disabled={isLoading}
          className="flex items-center justify-center px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
        >
          {isLoading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Send Recording
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
