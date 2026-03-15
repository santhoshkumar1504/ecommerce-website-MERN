const { parseChatMessage } = require("../utils/chatbotParser");
const {
  searchProductsService,
  featuredProductsService,
  discountedProductsService,
  inStockProductsService,
  categoriesService,
} = require("../services/chatbotService");

const chatbotMessageController = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        reply: "Please enter a message.",
        type: "text",
      });
    }

    const parsed = parseChatMessage(message);
    const { intent, data } = parsed;

    if (intent === "GREETING") {
      return res.status(200).json({
        success: true,
        reply:
          "Hello! Ask me about products, featured items, discounts, stock, or categories.",
        type: "text",
      });
    }

    if (intent === "SHOW_FEATURED") {
      const products = await featuredProductsService(data);

      return res.status(200).json({
        success: true,
        reply:
          products.length > 0
            ? `I found ${products.length} featured product(s).`
            : "No featured products found.",
        type: "product_list",
        products,
      });
    }

    if (intent === "SHOW_DISCOUNTED") {
      const products = await discountedProductsService(data);

      return res.status(200).json({
        success: true,
        reply:
          products.length > 0
            ? `I found ${products.length} discounted product(s).`
            : "No discounted products found.",
        type: "product_list",
        products,
      });
    }

    if (intent === "SHOW_IN_STOCK") {
      const products = await inStockProductsService(data);

      return res.status(200).json({
        success: true,
        reply:
          products.length > 0
            ? `I found ${products.length} available product(s).`
            : "No in-stock products found.",
        type: "product_list",
        products,
      });
    }

    if (intent === "SHOW_CATEGORIES") {
      const categories = await categoriesService();

      return res.status(200).json({
        success: true,
        reply:
          categories.length > 0
            ? `I found ${categories.length} categories.`
            : "No categories found.",
        type: "category_list",
        categories,
      });
    }

    if (intent === "SEARCH_PRODUCTS") {
      const products = await searchProductsService(data);

      return res.status(200).json({
        success: true,
        reply:
          products.length > 0
            ? `I found ${products.length} product(s).`
            : "No matching products found.",
        type: "product_list",
        products,
      });
    }

    return res.status(200).json({
      success: true,
      reply:
        "I didn’t understand that. Try: show featured products, shoes under 2000, show categories.",
      type: "text",
    });
  } catch (error) {
    console.log("CHATBOT CONTROLLER ERROR:", error);
    return res.status(500).json({
      success: false,
      reply: error.message || "Chatbot backend failed",
    });
  }
};

module.exports = {
  chatbotMessageController,
};