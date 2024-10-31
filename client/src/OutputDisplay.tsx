import React from "react";

interface OutputDisplayProps {
  serverResponse: string;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ serverResponse }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <input
        type="text"
        value={serverResponse}
        readOnly
        placeholder="Server response"
        style={{
          width: "100%",
          height: "100%",
          fontSize: "16px",
        }}
      />
    </div>
  );
};

export default OutputDisplay;
