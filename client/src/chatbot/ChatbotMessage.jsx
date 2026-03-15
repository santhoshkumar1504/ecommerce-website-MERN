import React from "react";

const ChatbotMessage = ({ sender, text }) => {
  return (
    <div className={`cb-message-row ${sender === "user" ? "user" : "bot"}`}>
      <div className={`cb-message ${sender === "user" ? "cb-user" : "cb-bot"}`}>
        {text}
      </div>
    </div>
  );
};

export default ChatbotMessage;