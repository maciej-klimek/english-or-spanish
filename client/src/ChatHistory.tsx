import React, { useEffect } from "react";

interface ChatEntry {
  user: string;
  response?: string;
}

interface ChatHistoryProps {
  conversationHistory: ChatEntry[];
  loading: boolean;
  textToSpeech: (text: string) => void;
  bottomRef: React.RefObject<HTMLDivElement>;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ conversationHistory, loading, textToSpeech, bottomRef }) => {
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [bottomRef, conversationHistory, loading]);

  return (
    <div className="max-h-[500px] overflow-auto space-y-4 px-10">
      {conversationHistory.map((entry, index) => (
        <div key={index} className="flex flex-col mb-8">
          {entry.user && (
            <div className="flex justify-end mb-4">
              <div className="bg-lime-700 p-4 rounded-lg shadow-md max-w-[70%]">
                <p className="text-sm font-bold text-stone-400">You:</p>
                <p className="text-stone-200">{entry.user}</p>
              </div>
            </div>
          )}
          {entry.response && (
            <div className="flex justify-start items-center">
              <div className="bg-stone-700 p-4 rounded-lg shadow-md max-w-[70%]">
                <p className="text-sm font-bold text-stone-400">Assistant:</p>
                <p className="text-stone-300">{entry.response}</p>
              </div>
              <button
                onClick={() => textToSpeech(entry.response ? entry.response : "")}
                className="ml-4 p-2 bg-stone-500 rounded-full text-white hover:bg-lime-700"
                aria-label="Play response"
              >
                🔊
              </button>
            </div>
          )}
        </div>
      ))}
      {loading && (
        <div className="flex justify-start items-center mb-8">
          <div className="bg-stone-700 p-4 rounded-lg shadow-md max-w-[70%]">
            <p className="text-sm font-bold text-stone-400">Assistant:</p>
            <div className="flex items-center space-x-2 mt-2">
              <div className="loader border-b-4 border-lime-500 rounded-full w-5 h-5 animate-spin"></div>
              <span className="text-stone-300">Typing...</span>
            </div>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatHistory;
