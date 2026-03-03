import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useVoiceRecognition from "./useVoiceRecognition";
import { parseCommand } from "./voiceParser";
import { speak } from "./speak";

const VoiceAssistant = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("en-IN");

  const handleCommand = (command) => {
    parseCommand(command, navigate, speak, language);
  };

  const { listening, setListening } =
    useVoiceRecognition(handleCommand, language);

  return (
    <div style={wrapperStyle}>

      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        style={selectStyle}
      >
        <option value="en-IN">English</option>
        <option value="hi-IN">Hindi</option>
        <option value="ta-IN">Tamil</option>
      </select>

      <div
        onClick={() => setListening(!listening)}
        style={{
          ...micStyle,
          background: listening
            ? "linear-gradient(45deg,#ff0000,#ff5e5e)"
            : "linear-gradient(45deg,#6a11cb,#2575fc)"
        }}
      >
        🎤
      </div>
    </div>
  );
};

const wrapperStyle = {
  position: "fixed",
  bottom: "30px",
  right: "30px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "10px",
  zIndex: 9999
};

const selectStyle = {
  padding: "6px 10px",
  borderRadius: "20px",
  border: "none"
};

const micStyle = {
  width: "70px",
  height: "70px",
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "26px",
  color: "white",
  cursor: "pointer",
  transition: "0.3s"
};

export default VoiceAssistant;