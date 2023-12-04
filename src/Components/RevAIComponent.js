import React, { useState } from 'react';
import axios from 'axios';
import './RevUi.css';

const RevAIComponent = () => {
  const [transcription, setTranscription] = useState('');
  const [audioFile, setAudioFile] = useState(null);

const transcribeAudio = async () => {
    try {
      if (!audioFile) {
        alert('Please select an audio file.');
        return;
      }
  
      const formData = new FormData();
      formData.append('audioUrl', audioFile);
  
      const response = await axios.post(
        'http://localhost:5000/api/transcribe',
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      const jobId = response.data.jobId;
  
      const checkStatus = async () => {
        try {
          const transcriptResponse = await axios.get(
            `http://localhost:5000/api/transcribe/${jobId}`,
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
  
          if (transcriptResponse.data.status === "transcribed") {
            const text = transcriptResponse.data.transcript;
            setTranscription(text);
          } else {
            setTimeout(checkStatus, 3000);
          }
        } catch (error) {
          console.error('Error fetching transcript:', error);
        }
      };
  
      checkStatus();
    } catch (error) {
      console.error('Error transcribing audio:', error);
    }
  };  

  const handleFileChange = (event) => {
    setAudioFile(event.target.files[0]);
  };

  return (
    <div>
        <div>
          <div>
            <input type="file" onChange={handleFileChange} accept="audio/*" />
          </div>
            <button onClick={transcribeAudio} >
              Transcribe Audio
            </button>
        </div>
        <div>
          <p>Transcription Result:</p>
          <p>{transcription}</p>
        </div>
    </div>
  );
};

export default RevAIComponent;

// import React, { useState } from 'react';
// import axios from 'axios';
// import './RevUi.css';

// const RevAIComponent = () => {
//   const [transcription, setTranscription] = useState('');
//   const [jobIdInput, setJobIdInput] = useState('');

//   const fetchTranscript = async () => {
//     try {
//       const transcriptResponse = await axios.get(
//         `http://localhost:5000/api/transcript/${jobIdInput}`,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (transcriptResponse.data.status === 'transcribed') {
//         const text = transcriptResponse.data.transcript;
//         setTranscription(text);
//       } else {
//         setTimeout(fetchTranscript, 3000);
//       }
//     } catch (error) {
//       console.error('Error fetching transcript:', error);
//     }
//   };

//   const handleJobIdChange = (event) => {
//     setJobIdInput(event.target.value);
//   };

//   const handleFetchTranscript = () => {
//     if (!jobIdInput) {
//       alert('Please enter a jobId.');
//       return;
//     }
//     fetchTranscript();
//   };

//   return (
//     <div>
//       <div>
//         <div>
//           <input
//             type="text"
//             placeholder="Enter jobId"
//             value={jobIdInput}
//             onChange={handleJobIdChange}
//           />
//           <button onClick={handleFetchTranscript}>Fetch Transcript</button>
//         </div>
//       </div>
//       <div>
//         <p>Transcription Result:</p>
//         <p>{transcription}</p>
//       </div>
//     </div>
//   );
// };

// export default RevAIComponent;
