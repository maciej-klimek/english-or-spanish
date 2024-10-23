import React, { useState } from "react";

interface InputFormProps {
  onSubmit: (userInput: string, language: string) => void;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit }) => {
  const [userInput, setUserInput] = useState<string>("");
  const [language, setLanguage] = useState<string>("english");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      onSubmit(userInput, language);
      setUserInput("");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userInput}
          onChange={handleChange}
          placeholder="Enter your message"
        />
        <select value={language} onChange={handleLanguageChange}>
          <option value="english">English</option>
          <option value="spanish">Spanish</option>
        </select>
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default InputForm;
