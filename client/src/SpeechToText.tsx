import React, { useState, useEffect } from "react";
import "regenerator-runtime/runtime";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

interface MicrophoneButtonProps {
  onTranscriptChange: (transcript: string) => void;
}

const MicrophoneButton: React.FC<MicrophoneButtonProps> = ({ onTranscriptChange }) => {
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [isMicOn, setIsMicOn] = useState<boolean>(false);

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
        className={`mr-4 px-3 py-3 rounded-lg text-white ${
          isMicOn ? "bg-red-600 hover:bg-red-700" : "bg-purple-600 hover:bg-purple-700"
        }`}
      >
        🎤
      </button>
    </div>
  );
};

export default MicrophoneButton;
