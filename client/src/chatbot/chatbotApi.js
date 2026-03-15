import axios from "axios";

export const sendChatMessage = async (message) => {
  const res = await axios.post("http://localhost:5000/api/chatbot/message", {
    message,
  });

  return res.data;
};