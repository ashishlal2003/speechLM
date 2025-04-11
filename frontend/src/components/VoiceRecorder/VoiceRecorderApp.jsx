import { useState } from 'react';
import StatusDisplay from './StatusDisplay';
import RecordButton from './RecordButton';
import AudioPlayer from './AudioPlayer';
import useAudioRecorder from '../../hooks/useAudioRecorder';
import { uploadAudioToServer } from '../../services/audioApi';
import { motion } from 'framer-motion';

export default function VoiceRecorderApp() {
  const [uploadStatus, setUploadStatus] = useState(null);
  const [output, setOutput] = useState("")

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

  const sendRecording = async () => {
    if (!audioURL) return;

    setIsLoading(true);
    setError(null);
    setUploadStatus("uploading");

    try {
      const audioBlob = await getAudioBlob();
      const response = await uploadAudioToServer(audioBlob); // this already returns JSON

      const { output_audio_base64, output_mime, transcription, ai_response } = response;

      // Convert base64 to Blob
      const byteCharacters = atob(output_audio_base64);
      const byteNumbers = new Array(byteCharacters.length).fill().map((_, i) => byteCharacters.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);
      const audioBlobFromServer = new Blob([byteArray], { type: output_mime });

      // Create object URL
      const objectURL = URL.createObjectURL(audioBlobFromServer);
      setOutput(objectURL); // update state with playable blob URL

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


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden"
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Voice Recorder</h1>

          <StatusDisplay
            permissionGranted={permissionGranted}
            isRecording={isRecording}
            recordingTime={recordingTime}
            error={error}
            uploadStatus={uploadStatus}
          />

          <RecordButton
            isRecording={isRecording}
            isLoading={isLoading}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
          />
          {audioURL && (
            <AudioPlayer
              audioURL={audioURL}
              onDelete={deleteRecording}
              onSend={sendRecording}
              isLoading={isLoading}
            />
          )}

          {output && (
            <audio
              controls
              src={output}
              className="w-full h-12 mb-4"
            />
          )}


          {/* Permission request button */}
          {permissionGranted === false && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={requestMicrophonePermission}
              className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Allow Microphone Access
            </motion.button>
          )}
        </div>

        <div className="bg-gray-50 px-6 py-4 text-sm text-center text-gray-500">
          Your voice recordings are securely processed and not stored permanently.
        </div>
      </motion.div>
    </div>
  );
}
