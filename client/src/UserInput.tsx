import React from "react";
import SpeechToText from "./SpeechToText";

interface UserInputProps {
  userInput: string;
  setUserInput: (input: string) => void;
  handleSubmit: () => Promise<void>;
  handleSpeechInputChange: (transcript: string) => void;
}

const UserInput: React.FC<UserInputProps> = ({ userInput, setUserInput, handleSubmit, handleSpeechInputChange }) => {
  return (
    <div className="flex items-center w-1/2 p-4 mt-8">
      <SpeechToText onTranscriptChange={handleSpeechInputChange} />
      <input
        type="text"
        className="w-1/2 flex-grow p-3 rounded-lg bg-stone-700 text-gray-200 placeholder-gray-400"
        placeholder="Enter your message"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      />
      <button onClick={handleSubmit} className="ml-4 px-4 py-3 rounded-lg bg-lime-700 hover:bg-lime-800 text-white">
        ✔
      </button>
    </div>
  );
};

export default UserInput;
