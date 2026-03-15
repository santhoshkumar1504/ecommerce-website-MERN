import React, { useState } from "react";
import { sendChatMessage } from "./chatbotApi";
import ChatbotMessage from "./ChatbotMessage";
import ChatbotProductCard from "./ChatbotProductCard";
import "./chatbot.css";

const starterSuggestions = [
  "Show featured products",
  "Search iPhone",
  "Shoes under 2000",
  "Show categories",
];

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi, I’m your shopping assistant. Ask me about products, price, featured items, or categories.",
    },
  ]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const handleSend = async (customMessage = null) => {
    const messageToSend = (customMessage ?? input).trim();
    if (!messageToSend) return;

    setMessages((prev) => [...prev, { sender: "user", text: messageToSend }]);
    setInput("");
    setLoading(true);
    setProducts([]);
    setCategories([]);

    try {
      const data = await sendChatMessage(messageToSend);

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data?.reply || "No reply received." },
      ]);

      if (data?.type === "product_list") {
        setProducts(data?.products || []);
      }

      if (data?.type === "category_list") {
        setCategories(data?.categories || []);
      }
    } catch (error) {
  console.log("CHATBOT ERROR:", error);
  console.log("CHATBOT ERROR RESPONSE:", error?.response?.data);

  setMessages((prev) => [
    ...prev,
    {
      sender: "bot",
      text:
        error?.response?.data?.reply ||
        error?.response?.data?.message ||
        "Something went wrong while contacting the chatbot.",
    },
  ]);
}
  };

  return (
    <>
      <button className="cb-float-btn" onClick={() => setOpen((prev) => !prev)}>
        💬
      </button>

      {open && (
        <div className="cb-wrapper">
          <div className="cb-header">
            <h3>Shop Assistant</h3>
            <button className="cb-close-btn" onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>

          <div className="cb-body">
            {messages.map((msg, index) => (
              <ChatbotMessage key={index} sender={msg.sender} text={msg.text} />
            ))}

            {loading && (
              <div className="cb-message-row bot">
                <div className="cb-message cb-bot">Typing...</div>
              </div>
            )}

            {products.length > 0 && (
              <div className="cb-results">
                {products.map((product) => (
                  <ChatbotProductCard
                    key={product._id || product.uuid || Math.random()}
                    product={product}
                  />
                ))}
              </div>
            )}

            {categories.length > 0 && (
              <div className="cb-category-list">
                {categories.map((category) => (
                  <div key={category._id} className="cb-category-item">
                    {category.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="cb-suggestions">
            {starterSuggestions.map((item) => (
              <button key={item} onClick={() => handleSend(item)}>
                {item}
              </button>
            ))}
          </div>

          <div className="cb-footer">
            <input
              type="text"
              placeholder="Ask about products..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;