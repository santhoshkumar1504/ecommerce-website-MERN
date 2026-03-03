const axios = require("axios");

const generateDescription = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: `Write a professional e-commerce product description for ${title}. Keep it attractive and SEO-friendly.`
          }
        ],
        temperature: 0.7,
        max_tokens: 200
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const generatedText =
      response.data.choices[0].message.content;

    res.json({ description: generatedText });

  } catch (error) {
    console.error("GROQ ERROR:", error.response?.data || error.message);

    res.status(500).json({
      message: "AI generation failed",
      error: error.response?.data || error.message
    });
  }
};

module.exports = { generateDescription };