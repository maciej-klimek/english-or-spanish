import React, { useState } from "react";
import InputForm from "./InputForm";
import OutputDisplay from "./OutputDisplay";
import makloImage from "./assets/maklo.png";

const App: React.FC = () => {
  const [serverResponse, setServerResponse] = useState<string>("");

  const handleSubmit = async (
    userInput: string,
    language: string
  ): Promise<void> => {
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
      console.log("Response from server:", responseData);
      setServerResponse(responseData.message);
    } catch (error) {
      console.error("Error during POST request:", error);
    }
  };

  return (
    <div style={{ display: "flex", width: "1900px", height: "920px" }}>
      {/* Div for Div 1 and Div 2*/}
      <div
        style={{
          flex: 5,
          display: "flex",
          flexDirection: "column",
          marginRight:"1px"
        }}
      >
        {/* Div 1 */}
        <div style={{ flex: 3 }}>
          <img
            src={makloImage}
            alt="Maklo"
            style={{ 
              border: "5px solid",
              borderColor:"white",
              width: "100%",
              height: "100%",
              objectFit: "cover" }}
          />
        </div>

        {/* Div 2 */}
        <div style={{ flex: 2 }}>
          <InputForm onSubmit={handleSubmit} />
        </div>
      </div>

      {/* Div 3 */}
      <div style={{ 
        flex: 1,
        marginLeft:"10px"
         }}>
        <OutputDisplay serverResponse={serverResponse} />{" "}
      </div>
    </div>
  );
};

export default App;
