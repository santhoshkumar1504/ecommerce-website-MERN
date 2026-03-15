const extractPriceRange = (message) => {
  const text = message.toLowerCase();

  let maxPrice = null;
  let minPrice = null;

  const underMatch =
    text.match(/under\s+(\d+)/) ||
    text.match(/below\s+(\d+)/) ||
    text.match(/less than\s+(\d+)/);

  const aboveMatch =
    text.match(/above\s+(\d+)/) ||
    text.match(/more than\s+(\d+)/) ||
    text.match(/greater than\s+(\d+)/);

  const betweenMatch = text.match(/between\s+(\d+)\s+and\s+(\d+)/);

  if (betweenMatch) {
    minPrice = Number(betweenMatch[1]);
    maxPrice = Number(betweenMatch[2]);
  } else {
    if (underMatch) maxPrice = Number(underMatch[1]);
    if (aboveMatch) minPrice = Number(aboveMatch[1]);
  }

  return { minPrice, maxPrice };
};

const cleanKeyword = (message) => {
  return message
    .toLowerCase()
    .replace(/show|find|search|give me|i want|products|product|please/g, "")
    .replace(/featured|discounted|discount|in stock|available/g, "")
    .replace(/under\s+\d+|below\s+\d+|less than\s+\d+/g, "")
    .replace(/above\s+\d+|more than\s+\d+|greater than\s+\d+/g, "")
    .replace(/between\s+\d+\s+and\s+\d+/g, "")
    .trim();
};

const parseChatMessage = (message = "") => {
  const text = message.toLowerCase().trim();
  const { minPrice, maxPrice } = extractPriceRange(text);

  if (!text) {
    return {
      intent: "UNKNOWN",
      data: {},
    };
  }

  if (
    text === "hello" ||
    text === "hi" ||
    text === "hey" ||
    text.includes("hello") ||
    text.includes("hi")
  ) {
    return {
      intent: "GREETING",
      data: {},
    };
  }

  if (text.includes("featured")) {
    return {
      intent: "SHOW_FEATURED",
      data: { minPrice, maxPrice, keyword: cleanKeyword(text) },
    };
  }

  if (text.includes("discount") || text.includes("offer")) {
    return {
      intent: "SHOW_DISCOUNTED",
      data: { minPrice, maxPrice, keyword: cleanKeyword(text) },
    };
  }

  if (text.includes("category") || text.includes("categories")) {
    return {
      intent: "SHOW_CATEGORIES",
      data: {},
    };
  }

  if (
    text.includes("in stock") ||
    text.includes("available") ||
    text.includes("stock")
  ) {
    return {
      intent: "SHOW_IN_STOCK",
      data: { minPrice, maxPrice, keyword: cleanKeyword(text) },
    };
  }

  return {
    intent: "SEARCH_PRODUCTS",
    data: { minPrice, maxPrice, keyword: cleanKeyword(text) || text },
  };
};

module.exports = {
  parseChatMessage,
};