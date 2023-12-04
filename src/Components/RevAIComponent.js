import React, { useState, useEffect } from "react";
import "./UI/RevUi.css";
import "./UI/UI.css";
import "./UI/UploadButton.css";
import "./UI/animation.css";
import "./UI/containerText.css";
import Loader from "./Loader";
import AudioPlayer from "./AudioPlayer";

const RevAIComponent = () => {
  const [transcription, setTranscription] = useState("");
  const [audioFile, setAudioFile] = useState();
  const [fileName, setFileName] = useState("");
  const [text, setText] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [typingText, setTypingText] = useState("");
  const typingSpeed = 50;
  const [audioPlayer, setAudioPlayer] = useState(null);

  useEffect(() => {
    if (audioPlayer) {
      audioPlayer.src = URL.createObjectURL(audioFile);
    }
  }, [audioFile, audioPlayer]);

  const handleAudioLoaded = (event) => {
    setAudioPlayer(event.target);
  };

  //typing animation
  const simulateTyping = async (finalText) => {
    if (!finalText) {
      return;
    }

    let currentIndex = 0;
    while (currentIndex < finalText.length) {
      await new Promise((resolve) => {
        setTimeout(() => {
          setTypingText(finalText.substring(0, currentIndex + 1));
          currentIndex++;
          resolve();
        }, typingSpeed);
      });
    }
  };

  useEffect(() => {
    simulateTyping(text);
  }, [text]);

  const transcribAudio = async () => {
    try {
      if (!audioFile) {
        alert("Please upload an audio file.");
        return;
      }
      setLoading(true);

      try {
        const rep = await fetch(
          "http://localhost:5000/api/getTextById/656e4160249d31c2db25cf2e",
          {
            method: "GET",
          }
        );
        const { txt } = await rep.json();
        setText(txt);
      } catch (err) {
        console.error("Error fetching transcript:", err);
      }
      console.log("text", text);
      const formData = new FormData();
      formData.append("audioUrl", audioFile);

      const postOptions = {
        method: "POST",
        body: formData,
      };

      const response = await fetch(
        "http://localhost:5000/api/transcribe",
        postOptions
      );
      const { jobId } = await response.json();

      const checkStatus = async () => {
        try {
          const transcriptResponse = await fetch(
            `http://localhost:5000/api/transcribe/${jobId}`
          );
          const { status, transcript } = await transcriptResponse.json();

          if (status === "transcribed") {
            setTranscription(transcript);
          } else {
            setTimeout(checkStatus, 3000);
          }
        } catch (error) {
          console.error("Error fetching transcript:", error);
        }
      };

      checkStatus();
      setTimeout(() => {
        setLoading(false); // Set loading state to false after X time
      }, 1000);
    } catch (error) {
      console.error("Error transcribing audio:", error);
      setLoading(false);
    }
  };

  const transcribeAudio = async () => {
    try {
      if (!audioFile) {
        alert("Please upload an audio file.");
        return;
      }
      setLoading(true);

      try {
        const rep = await fetch(
          //656e4160249d31c2db25cf2e
          //656e4f5a2484254f15816009
          "http://localhost:5000/api/getTextById/656e4f5a2484254f15816009",
          {
            method: "GET",
          }
        );
        const response = await rep.json();
        if (response && response.text !== undefined) {
          console.log("Fetched text:", response.txt);
          setText(response.text);
        } else {
          console.error("Invalid response format:", response);
        }
      } catch (err) {
        console.error("Error fetching transcript:", err);
      }

      setTimeout(() => {
        setLoading(false); // Set loading state to false after X time
      }, 5000);
    } catch (error) {
      console.error("Error transcribing audio:", error);
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setAudioFile(file);
    setFileName(file ? file.name : "");
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="container">
          <div className="center">
            <div className="button">
              <label
                className="file-label"
                htmlFor="file-upload"
                data-tooltip="Size: 20Mb"
              >
                <span className="button-wrapper">
                  <span className="text">Upload</span>
                  <span className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      role="img"
                      width="2em"
                      height="2em"
                      preserveAspectRatio="xMidYMid meet"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"
                      ></path>
                    </svg>
                  </span>
                </span>
                <input
                  id="file-upload"
                  className="inputB"
                  type="file"
                  onChange={handleFileChange}
                  accept="audio/*"
                />
              </label>
            </div>
            <div  className="file-name">
              {fileName && `Selected File: ${fileName}`}
              <br></br>
              {fileName && <AudioPlayer onLoadedData={handleAudioLoaded} />}
            </div >
            <div>
              <button onClick={transcribeAudio} className="btn">
                <i className="animation"></i>Transcribe Audio
                <i className="animation"></i>
              </button>
            </div>
          </div>
          <div className="result-container">
            <p className="result-title">Transcription Result:</p>
            <p className="result-text">{typingText}</p>
            <p className="result-text">{transcription}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default RevAIComponent;
