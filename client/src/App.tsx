import React, { useState, useEffect, useRef } from "react";
import julianImage from "./assets/julian.jpg";
import jefImage from "./assets/jef.jpg";
import magikImage from "./assets/magik2.jpg";
import UserInput from "./UserInput";
import ChatHistory from "./ChatHistory";
import "./App.css";
import englishFlag from "./assets/english_flag.png";
import spanishFlag from "./assets/spanish_flag.png";
import polishFlag from "./assets/polish_flag.png";

const App: React.FC = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [language, setLanguage] = useState<string>("English");
  const [conversationHistory, setConversationHistory] = useState<
    { user: string; response?: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastAssistantMessage, setLastAssistantMessage] = useState<string>("");
  const [correctedMessage, setCorrectedMessage] = useState<string>("");
  const [errorList, setErrorList] = useState<
    { badWord: string; correctedWord: string }[]
  >([]);
  const [errorInfo, setErrorInfo] = useState<string>("");
  const [view, setView] = useState<"chat" | "error">("chat");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleLanguageChange = (newLanguage: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setLanguage(newLanguage);
    setConversationHistory([]);
    setCorrectedMessage("");
    setErrorList([]);
    setErrorInfo("");
    setLastAssistantMessage(
      newLanguage === "English"
        ? "Hello, my name is Julian, let's learn some English today my friend."
        : newLanguage === "Spanish"
        ? "Hola, me llamo Jeff, aprendamos un poco de español hoy amigo."
        : "Cześć, mam na imię Magik, uczmy się polskiego dzisiaj przyjacielu."
    );
    setView("chat");
  };

  const handleSubmit = async (): Promise<void> => {
    const requestData = { user_input: userInput, language };

    setConversationHistory((prevHistory) => [
      ...prevHistory,
      { user: userInput },
    ]);
    setLoading(true);
    setUserInput("");

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const response = await fetch("http://localhost:3000", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error("Error while sending the message");
      }

      const responseData = await response.json();
      console.log("Server response:", responseData);
      const parsedResponse = JSON.parse(responseData.prompt_response);
      const responseText = parsedResponse.openAI_response.response_data;
      setLastAssistantMessage(responseText);

      setConversationHistory((prevHistory) =>
        prevHistory.map((entry, index) =>
          index === prevHistory.length - 1
            ? { ...entry, response: responseText }
            : entry
        )
      );

      setCorrectedMessage(parsedResponse.corrected_input.message);

      const errorListData = parsedResponse.corrected_input.error_list;
      console.log(errorListData);
      const errorList = errorListData.map((error: [string, string]) => ({
        badWord: error[0].trim(),
        correctedWord: error[1].trim(),
      }));

      setErrorList(errorList);
      setErrorInfo(parsedResponse.corrected_input.error_info);
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Request was aborted.");
      } else {
        console.error("Error during POST request:", error);
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const textToSpeech = (text: string) => {
    if ("speechSynthesis" in window) {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang =
        language === "English"
          ? "en-US"
          : language === "Spanish"
          ? "es-ES"
          : "pl-PL";
      utterance.pitch = 1;
      utterance.rate = 0.8;

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
          {language === "English"
            ? "Learning English!"
            : language === "Spanish"
            ? "¡Estudiar Español!"
            : "Nauka języka polskiego!"}
        </h1>
        <div className="flex w-full border-b-4 border-stone-800">
          <div className="flex flex-col items-center w-1/2 p-6 border-r-4 border-stone-800">
            <div className="relative w-full h-96">
              <img
                src={
                  language === "English"
                    ? julianImage
                    : language === "Spanish"
                    ? jefImage
                    : magikImage
                }
                className="w-full h-full rounded-lg border-2 border-lime-700 object-cover"
                alt="Julian, Jef, or Magik"
              />
              <div className="absolute inset-0 flex items-end justify-center w-full">
                <h2 className="bg-lime-800 bg-opacity-30 text-stone-200 p-4 text-center w-full max-h-[40%] overflow-hidden overflow-y-scroll scrollbar-hide">
                  {lastAssistantMessage ||
                    (language === "English"
                      ? "Hello, my name is Julian, let's learn some English today my friend."
                      : language === "Spanish"
                      ? "Hola, me llamo Jeff, aprendamos un poco de español hoy amigo."
                      : "Cześć, mam na imię Magik, uczmy się polskiego dzisiaj przyjacielu.")}{" "}
                </h2>
              </div>
            </div>

            <div className="w-full mt-12 mb-12">
              <div className="flex space-x-8 justify-center">
                <button
                  onClick={() => handleLanguageChange("English")}
                  className={`p-3 rounded-lg ${
                    language === "English"
                      ? "bg-lime-700 text-white"
                      : "bg-stone-700 text-gray-200"
                  }`}
                >
                  <img
                    src={englishFlag}
                    alt="English Flag"
                    className="w-4 h-4 inline-block mr-2"
                  />
                  English
                </button>
                <div className="flex items-center">or</div>
                <button
                  onClick={() => handleLanguageChange("Spanish")}
                  className={`p-3 rounded-lg ${
                    language === "Spanish"
                      ? "bg-lime-700 text-white"
                      : "bg-stone-700 text-gray-200"
                  }`}
                >
                  <img
                    src={spanishFlag}
                    alt="Spanish Flag"
                    className="w-4 h-4 inline-block mr-2"
                  />
                  Spanish
                </button>
                <div className="flex items-center">or</div>
                <button
                  onClick={() => handleLanguageChange("Polish")}
                  className={`p-3 rounded-lg ${
                    language === "Polish"
                      ? "bg-lime-700 text-white"
                      : "bg-stone-700 text-gray-200"
                  }`}
                >
                  <img
                    src={polishFlag}
                    alt="Polish Flag"
                    className="w-4 h-4 inline-block mr-2"
                  />
                  Polish
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-1/2 p-6">
            <div className="flex mt-4 space-x-4">
              <button
                onClick={() => setView("chat")}
                className={`p-2 rounded-md ${
                  view === "chat"
                    ? "bg-lime-700 text-white"
                    : "bg-stone-700 text-gray-200"
                }`}
              >
                Chat
              </button>
              <button
                onClick={() => setView("error")}
                className={`p-2 rounded-md ${
                  view === "error"
                    ? "bg-lime-700 text-white"
                    : "bg-stone-700 text-gray-200"
                }`}
              >
                Errors
              </button>
            </div>
            {view === "chat" ? (
              <ChatHistory
                conversationHistory={conversationHistory}
                loading={loading}
                textToSpeech={textToSpeech}
                bottomRef={bottomRef}
              />
            ) : (
              <div className="text-stone-300 overflow-y-auto max-h-full">
                <h3 className="text-xl mb-4">
                  {language === "English"
                    ? "I think you tried to say:"
                    : language === "Spanish"
                    ? "Creo que intentaste decir:"
                    : language === "Polish"
                    ? "Myślę, że próbowałeś powiedzieć:"
                    : ""}
                </h3>

                <p className="text-lime-300 mb-4 text-xl">
                  "{correctedMessage}"
                </p>
                <h3 className="text-xl mb-4 mt-4 pt-4 border-t-4 border-stone-800">
                  Errors:
                </h3>
                {errorList.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {errorList.map(({ badWord, correctedWord }, index) => (
                      <li key={index}>
                        <span className="text-red-400">{badWord}</span> &rarr;{" "}
                        <span className="text-lime-300">{correctedWord}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">No errors found.</p>
                )}
                <p className="text-gray-300 mt-4 pt-4 border-t-4 border-stone-800">
                  {errorInfo}
                </p>
              </div>
            )}
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
