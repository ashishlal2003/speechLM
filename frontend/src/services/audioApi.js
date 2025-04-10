export const uploadAudioToServer = async (audioBlob) => {
    if (!audioBlob) {
      throw new Error('No audio data to upload');
    }
    
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');
    
    // Replace with your actual API endpoint
    const response = await fetch('https://your-api-endpoint.com/upload-audio', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload audio');
    }
    
    return await response.json();
  };
  