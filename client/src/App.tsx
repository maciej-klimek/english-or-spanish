import React, { useState } from "react";

const App: React.FC = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [language, setLanguage] = useState<string>("english");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUserInput(e.target.value);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setLanguage(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (userInput.trim()) {
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
        console.log("Server response:", responseData);
      } catch (error) {
        console.error("Error during POST request:", error);
      }

      setUserInput("");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={userInput} onChange={handleChange} placeholder="Enter your message" />
        <select value={language} onChange={handleLanguageChange}>
          <option value="english">English</option>
          <option value="spanish">Spanish</option>
        </select>
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default App;
