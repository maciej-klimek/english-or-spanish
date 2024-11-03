import React, { useState } from "react";
import julianImage from "./assets/julian.jpg";
import jefImage from "./assets/jef.jpg";
import MicrophoneButton from "./MicButton";

const App: React.FC = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [language, setLanguage] = useState<string>("English");
  const [conversationHistory, setConversationHistory] = useState<
    { user: string; response: string }[]
  >([]);
  const [serverResponse, setServerResponse] = useState<string>("");

  const handleSubmit = async (): Promise<void> => {
    const requestData = { user_input: userInput, language };

    try {
      const response = await fetch("http://localhost:3000", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Error while sending the message");
      }

      const responseData = await response.json();
      const parsedResponse = JSON.parse(responseData.prompt_response);
      setServerResponse(parsedResponse);
      console.log("Associated Response:", parsedResponse);

      const responseText = parsedResponse.openAI_response.response_data;

      setConversationHistory((prevHistory) => [
        ...prevHistory,
        {
          user: userInput,
          response: responseText,
        },
      ]);

      setUserInput("");
    } catch (error) {
      console.error("Error during POST request:", error);
    }
  };
  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      // Sprawdź, czy nie ma innych aktywnych wypowiedzi
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel(); // przerwij, jeśli coś już jest odtwarzane
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === "English" ? "en-US" : "es-ES";
      utterance.pitch = 1;
      utterance.rate = 0.9;

      utterance.onend = () => {
        console.log("Speech has finished.");
      };

      utterance.onerror = (event) => {
        console.error("Error occurred in speech synthesis:", event.error);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      console.log("Text-to-Speech not supported in this browser.");
    }
  };

  const handleSpeechInputChange = (transcript: string) => {
    setUserInput(transcript);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-stone-900 text-stone-100 font-mono font-bold">
      <div className="flex flex-col w-3/4 rounded-lg shadow-lg overflow-hidden items-center">
        <div className="flex w-full border-b-4 border-stone-800">
          {/* left side */}
          <div className="flex flex-col items-center w-1/2 p-6 border-r-4 border-stone-800">
            <img
              src={language === "English" ? julianImage : jefImage}
              className="w-full h-96 rounded-lg border-2 border-lime-700 object-cover"
            />
            <div className="w-full mt-12 mb-12">
              <div className="flex space-x-8 justify-center">
                <button
                  onClick={() => setLanguage("English")}
                  className={`p-3 rounded-lg ${
                    language === "English"
                      ? "bg-lime-700 text-white"
                      : "bg-stone-700 text-gray-200"
                  }`}
                >
                  🇬🇧 English
                </button>
                <div className="flex items-center">or</div>
                <button
                  onClick={() => setLanguage("Spanish")}
                  className={`p-3 rounded-lg ${
                    language === "Spanish"
                      ? "bg-lime-700 text-white"
                      : "bg-stone-700 text-gray-200"
                  }`}
                >
                  🇪🇸 Spanish
                </button>
                <div className="mt-3">?</div>
              </div>
            </div>
          </div>

          {/* right side */}
          <div className="flex flex-col w-1/2 p-6">
            <h2 className="text-2xl font-semibold text-stone-300">
              Conversation History
            </h2>
            <div className="max-h-[500px] overflow-auto space-y-4 px-10">
              {conversationHistory.map((entry, index) => (
                <div key={index} className="flex flex-col mb-8">
                  {/* User Message on the right */}
                  {entry.user && (
                    <div className="flex justify-end mb-4">
                      <div className="bg-lime-700 p-4 rounded-lg shadow-md max-w-[70%]">
                        <p className="text-sm font-bold text-stone-400">You:</p>
                        <p className="text-stone-200">{entry.user}</p>
                      </div>
                    </div>
                  )}
                  {/* AI Response on the left */}
                  {entry.response && (
                    <div className="flex justify-start items-center">
                      <div className="bg-stone-700 p-4 rounded-lg shadow-md max-w-[70%]">
                        <p className="text-sm font-bold text-stone-400">
                          Assistant:
                        </p>
                        <p className="text-stone-300">{entry.response}</p>
                      </div>
                      <button
                        onClick={() => speakText(entry.response)}
                        className="ml-2 p-2 bg-lime-700 rounded-full text-white hover:bg-lime-800"
                        aria-label="Play response"
                      >
                        🔊
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* user input */}
        <div className="flex items-center w-1/2 p-4 mt-8">
          <input
            type="text"
            className="w-1/2 flex-grow p-3 rounded-lg bg-stone-700 text-gray-200 placeholder-gray-400"
            placeholder="Enter your message"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            className="ml-4 px-4 py-2 rounded-lg bg-lime-700 hover:bg-lime-800 text-white"
          >
            Send
          </button>
          {/* Microphone Button for Speech Input */}
          <MicrophoneButton onTranscriptChange={handleSpeechInputChange} />
        </div>
      </div>
    </div>
  );
};

export default App;
