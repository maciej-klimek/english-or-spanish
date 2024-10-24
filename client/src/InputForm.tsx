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
    <div
    style={{
      flex: 5,
      display: "flex",
      flexDirection: "column",
    }}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userInput}
          onChange={handleChange}
          placeholder="Enter your message"
          style={{
            marginTop:"20px",
            marginLeft:"5px",
            width:"88%",
            height:"100%",
            fontSize:"16px"
          }}
        />
        <select 
        value={language}
        onChange={handleLanguageChange}
        style={{
          marginLeft:"5px",
          width:"5%",
          height:"100%"
        }}

         >
          <option value="english">English</option>
          <option value="spanish">Spanish</option>
        </select>
        <button 
        type="submit"
        style={{
          marginLeft:"5px",
          width:"5%",
          height:"100%"
        }}
        >
          Send</button>
      </form>
    </div>
  );
};

export default InputForm;
