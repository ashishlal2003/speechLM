export const uploadAudioToServer = async (audioBlob) => {
    if (!audioBlob) {
      throw new Error('No audio data to upload');
    }
    
    const formData = new FormData();
    formData.append('audio_file', audioBlob, 'recording.wav');
    
    // Replace with your actual API endpoint
    const response = await fetch('http://127.0.0.1:9000/process', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload audio');
    }
    
    return await response.json();
  };
  