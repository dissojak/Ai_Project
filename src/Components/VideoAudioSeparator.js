import React, { useState } from 'react';

const VideoAudioSeparator = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSeparateAudio = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('video', selectedFile);
  
      try {
        const response = await fetch('http://localhost:5000/api/separate-audio', {
          method: 'POST',
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
  
        const responseData = await response.json();
        console.log('Audio separated:', responseData);
        // Handle the response (e.g., download the audio)
      } catch (error) {
        console.error('Error separating audio:', error);
        // Handle errors
      }
    }
  };  

  return (
    <div>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <button onClick={handleSeparateAudio}>Separate Audio</button>
    </div>
  );
};

export default VideoAudioSeparator;
