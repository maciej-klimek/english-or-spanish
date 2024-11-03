import React, { useState, useEffect, useRef } from "react";
import julianImage from "./assets/julian.jpg";
import jefImage from "./assets/jef.jpg";
import UserInput from "./UserInput";
import ChatHistory from "./ChatHistory";
import "./App.css";
import englishFlag from "./assets/english_flag.png";
import spanishFlag from "./assets/spanish_flag.png";

const App: React.FC = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [language, setLanguage] = useState<string>("English");
  const [conversationHistory, setConversationHistory] = useState<{ user: string; response?: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastAssistantMessage, setLastAssistantMessage] = useState<string>("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setConversationHistory([]);
    setUserInput("");
  };

  const handleSubmit = async (): Promise<void> => {
    const requestData = { user_input: userInput, language };

    setConversationHistory((prevHistory) => [...prevHistory, { user: userInput }]);
    setLoading(true);
    setUserInput("");

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
      const responseText = parsedResponse.openAI_response.response_data;
      setLastAssistantMessage(responseText);

      setConversationHistory((prevHistory) =>
        prevHistory.map((entry, index) =>
          index === prevHistory.length - 1 ? { ...entry, response: responseText } : entry
        )
      );
    } catch (error) {
      console.error("Error during POST request:", error);
    } finally {
      setLoading(false);
    }
  };

  const textToSpeech = (text: string) => {
    if ("speechSynthesis" in window) {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === "English" ? "en-US" : "es-ES";
      utterance.pitch = 0.6;
      utterance.rate = 0.8;

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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationHistory, loading]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-stone-900 text-stone-100 font-mono font-bold">
      <div className="flex flex-col w-3/4 rounded-lg shadow-lg overflow-hidden items-center">
        <h1 className="mb-20 text-3xl text-stone-700">
          {language === "English" ? "Learning English!" : "¡Estudiar Español!"}
        </h1>
        <div className="flex w-full border-b-4 border-stone-800">
          <div className="flex flex-col items-center w-1/2 p-6 border-r-4 border-stone-800">
            <div className="relative w-full h-96">
              <img
                src={language === "English" ? julianImage : jefImage}
                className="w-full h-full rounded-lg border-2 border-lime-700 object-cover"
                alt="Julian or Jef"
              />
              <div className="absolute inset-0 flex items-end justify-center w-full">
                <h2 className="bg-lime-800 bg-opacity-30 text-stone-200 p-4 text-center w-full max-h-[40%] overflow-hidden overflow-y-scroll scrollbar-hide">
                  {lastAssistantMessage ||
                    (language === "English"
                      ? "Hello, my name is Julian, let's learn some English today my friend."
                      : "Hola, me llamo Jeff, aprendamos un poco de español hoy amigo.")}
                </h2>
              </div>
            </div>
            <div className="w-full mt-12 mb-12">
              <div className="flex space-x-8 justify-center">
                <button
                  onClick={() => handleLanguageChange("English")}
                  className={`p-3 rounded-lg ${
                    language === "English" ? "bg-lime-700 text-white" : "bg-stone-700 text-gray-200"
                  }`}
                >
                  <img src={englishFlag} alt="English Flag" className="w-4 h-4 inline-block mr-2" />
                  English
                </button>
                <div className="flex items-center">or</div>
                <button
                  onClick={() => handleLanguageChange("Spanish")}
                  className={`p-3 rounded-lg ${
                    language === "Spanish" ? "bg-lime-700 text-white" : "bg-stone-700 text-gray-200"
                  }`}
                >
                  <img src={spanishFlag} alt="Spanish Flag" className="w-4 h-4 inline-block mr-2" />
                  Spanish
                </button>
                <div className="mt-3">?</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-1/2 p-6">
            <ChatHistory
              conversationHistory={conversationHistory}
              loading={loading}
              textToSpeech={textToSpeech}
              bottomRef={bottomRef}
            />
          </div>
        </div>
        <UserInput
          userInput={userInput}
          setUserInput={setUserInput}
          handleSubmit={handleSubmit}
          handleSpeechInputChange={handleSpeechInputChange}
        />
      </div>
    </div>
  );
};

export default App;
