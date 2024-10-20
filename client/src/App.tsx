import React, { useState } from "react";
import "./App.css"; // Zaktualizowany plik CSS
import Avatar from "./assets/maklo.png";
const App: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<string[]>([]);

  // Obsługa zmiany w polu input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setText(e.target.value);
  };

  // Obsługa wysłania wiadomości
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (text.trim()) {
      // Aktualizacja historii czatu
      setChatHistory([...chatHistory, text]);

      // Przygotowanie danych do wysłania
      const messageData = { message: text };

      // Wyślij POST request na localhost:3000
      try {
        const response = await fetch("http://localhost:3000", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messageData), // Zawartość wysyłana jako JSON
        });

        if (!response.ok) {
          throw new Error("Błąd podczas wysyłania wiadomości");
        }

        // Opcjonalnie: obsłuż odpowiedź z serwera, np. sprawdź status
        const responseData = await response.json();
        console.log("Odpowiedź serwera:", responseData);
      } catch (error) {
        console.error("Błąd podczas wysyłania POST request:", error);
      }

      // Wyczyść pole tekstowe po wysłaniu wiadomości
      setText("");
    }
  };

  return (
    <div className="chat-container">
      {/* Sekcja z obrazem i polem tekstowym */}
      <div className="photo-input-section">
        <img src={Avatar} alt="Avatar" className="avatar" />
        <div className="input-section">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={text}
              onChange={handleChange}
              placeholder="Enter your message"
              className="chat-input"
            />
            <button type="submit" className="send-button">
              Send
            </button>
          </form>
        </div>
      </div>

      {/* Sekcja z historią czatu */}
      <div className="chat-history-section">
        <div className="chat-history">
          {chatHistory.map((message, index) => (
            <div key={index} className="chat-message">
              {message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
