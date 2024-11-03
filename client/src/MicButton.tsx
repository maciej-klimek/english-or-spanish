import React, { useState, useEffect } from "react";
import "regenerator-runtime/runtime";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const MicrophoneButton = ({ onTranscriptChange }) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const [isMicOn, setIsMicOn] = useState(false);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser does not support speech recognition.</span>;
  }

  const handleSpeech = () => {
    if (isMicOn) {
      stopRecording();
    } else {
      startRecording();
    }
    setIsMicOn((prev) => !prev);
  };

  const startRecording = () => {
    onTranscriptChange("");
    SpeechRecognition.startListening({
      continuous: true,
    });
  };

  const stopRecording = () => {
    SpeechRecognition.stopListening();
    resetTranscript();
  };

  useEffect(() => {
    if (listening) {
      onTranscriptChange(transcript);
    }
  }, [transcript, listening, onTranscriptChange]);

  return (
    <div>
      <button
        onClick={handleSpeech}
        className={`ml-4 px-4 py-2 rounded-lg text-white ${
          isMicOn
            ? "bg-red-600 hover:bg-red-700"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        Speech
      </button>
    </div>
  );
};

export default MicrophoneButton;
