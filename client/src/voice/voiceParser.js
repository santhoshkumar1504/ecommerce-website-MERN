export const parseCommand = (command, navigate, speak, language) => {
  if (!command) return;

  command = command.toLowerCase().trim();

  const respond = (textEN, textHI, textTA) => {
    if (language === "hi-IN") speak(textHI, language);
    else if (language === "ta-IN") speak(textTA, language);
    else speak(textEN, language);
  };

  if (
    command.includes("home") ||
    command.includes("होम") ||
    command.includes("முகப்பு")
  ) {
    navigate("/");
    respond("Navigated to Home", "होम पर पहुँचा गया", "முகப்பு பக்கம் திறக்கப்பட்டது");
    return;
  }

  if (command.includes("open product")) {
    const id = command.replace("open product", "").trim();

    if (id) {
      navigate(`/products/${id}`);
      respond("Opening product", "प्रोडक्ट खोला जा रहा है", "பொருள் திறக்கப்படுகிறது");
    } else {
      respond("Product ID not found", "प्रोडक्ट आईडी नहीं मिला", "பொருள் ஐடி கிடைக்கவில்லை");
    }
    return;
  }

  if (
    command === "products" ||
    command.includes("open products") ||
    command.includes("उत्पाद") ||
    command.includes("பொருட்கள்")
  ) {
    navigate("/products");
    respond("Navigated to Products", "प्रोडक्ट्स पर पहुँचा गया", "பொருட்கள் பக்கம் திறக்கப்பட்டது");
    return;
  }

  if (
    command.includes("categories") ||
    command.includes("श्रेणी") ||
    command.includes("வகைகள்")
  ) {
    navigate("/categories");
    respond("Navigated to Categories", "कैटेगरी खोला गया", "வகைகள் பக்கம் திறக்கப்பட்டது");
    return;
  }

  if (
    command.includes("login") ||
    command.includes("लॉगिन") ||
    command.includes("உள்நுழை")
  ) {
    navigate("/login");
    respond("Navigated to Login", "लॉगिन पेज खोला गया", "உள்நுழை பக்கம் திறக்கப்பட்டது");
    return;
  }

  if (
    command.includes("dashboard") ||
    command.includes("डैशबोर्ड") ||
    command.includes("டாஷ்போர்டு")
  ) {
    navigate("/dashboard");
    respond("Navigated to Dashboard", "डैशबोर्ड खोला गया", "டாஷ்போர்டு திறக்கப்பட்டது");
    return;
  }

  if (
    command.includes("search") ||
    command.includes("खोज") ||
    command.includes("தேடு")
  ) {
    let text = command.toLowerCase();

    text = text
      .replace("search for", "")
      .replace("search", "")
      .replace("खोजो", "")
      .replace("खोज", "")
      .replace("ढूंढो", "")
      .replace("ढूंढ", "")
      .replace("தேடு", "")
      .replace("தேட", "")
      .replace("products", "")
      .replace("product", "")
      .trim();

    const takeAfterKeyword = (src, keyword) => {
      const idx = src.indexOf(keyword);
      if (idx === -1) return "";
      return src.slice(idx + keyword.length).trim();
    };

    const removePhrase = (src, phrase) =>
      src.replaceAll(phrase, " ").replace(/\s+/g, " ").trim();

    let isFeatured = false;
    const featuredWords = [
      "featured",
      "is featured",
      "top products",
      "popular",
      "trending",
      "फीचर्ड",
      "टॉप",
      "लोकप्रिय",
      "பிரபலமான",
      "featured products",
      "சிறப்பு",
    ];

    if (featuredWords.some((w) => text.includes(w))) {
      isFeatured = true;
      featuredWords.forEach((w) => {
        text = removePhrase(text, w);
      });
    }

    let sort = "";
    if (text.includes("low to high") || text.includes("lowest price")) sort = "price-low";
    if (text.includes("high to low") || text.includes("highest price")) sort = "price-high";
    if (text.includes("newest") || text.includes("latest")) sort = "newest";
    if (text.includes("rating") || text.includes("top rated")) sort = "rating";

    text = text
      .replace("low to high", "")
      .replace("lowest price", "")
      .replace("high to low", "")
      .replace("highest price", "")
      .replace("newest", "")
      .replace("latest", "")
      .replace("rating", "")
      .replace("top rated", "")
      .trim();

    let brand = "";
    if (text.includes("brand ")) {
      brand = takeAfterKeyword(text, "brand ").split(" ")[0] || "";
      text = removePhrase(text, `brand ${brand}`);
    } else if (text.includes(" brand")) {
      const parts = text.split(" brand");
      brand = (parts[0] || "").trim().split(" ").pop() || "";
      text = removePhrase(text, `${brand} brand`);
    }

    let category = "";
    if (text.includes("category ")) {
      category = takeAfterKeyword(text, "category ").split(" ")[0] || "";
      text = removePhrase(text, `category ${category}`);
    } else if (text.includes(" category")) {
      const parts = text.split(" category");
      category = (parts[0] || "").trim().split(" ").pop() || "";
      text = removePhrase(text, `${category} category`);
    }

    let price = "";

    const rangeMatch = text.match(/(\d{3,})\s*-\s*(\d{3,})/);
    if (rangeMatch) {
      price = `${rangeMatch[1]}-${rangeMatch[2]}`;
      text = text.replace(rangeMatch[0], " ").trim();
    }

    const underMatchEN = text.match(/(under|below)\s*(\d{3,})/);
    const aboveMatchEN = text.match(/(above|over)\s*(\d{3,})/);
    const underMatchHI = text.match(/(\d{3,})\s*(के अंदर|के नीचे|से कम|से नीचे)/);
    const aboveMatchHI = text.match(/(\d{3,})\s*(से ऊपर|से ज्यादा|से अधिक|के ऊपर)/);
    const underMatchTA = text.match(/(\d{3,})\s*(க்குள்|கீழே|குறைவாக)/);
    const aboveMatchTA = text.match(/(\d{3,})\s*(மேல்|அதிகமாக)/);

    if (!price) {
      if (underMatchEN) {
        price = `0-${underMatchEN[2]}`;
        text = text.replace(underMatchEN[0], " ").trim();
      } else if (aboveMatchEN) {
        price = `${aboveMatchEN[2]}-9999999`;
        text = text.replace(aboveMatchEN[0], " ").trim();
      } else if (underMatchHI) {
        price = `0-${underMatchHI[1]}`;
        text = text.replace(underMatchHI[0], " ").trim();
      } else if (aboveMatchHI) {
        price = `${aboveMatchHI[1]}-9999999`;
        text = text.replace(aboveMatchHI[0], " ").trim();
      } else if (underMatchTA) {
        price = `0-${underMatchTA[1]}`;
        text = text.replace(underMatchTA[0], " ").trim();
      } else if (aboveMatchTA) {
        price = `${aboveMatchTA[1]}-9999999`;
        text = text.replace(aboveMatchTA[0], " ").trim();
      }
    }

    text = text
      .replaceAll("price", "")
      .replaceAll("with", "")
      .replaceAll("rs", "")
      .replaceAll("₹", "")
      .replaceAll("rupees", "")
      .replaceAll("रुपये", "")
      .replaceAll("ரூபாய்", "")
      .replace(/\s+/g, " ")
      .trim();

    const q = text;

    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (price) params.set("price", price);
    if (brand) params.set("brand", brand);
    if (category) params.set("category", category);
    if (sort) params.set("sort", sort);
    if (isFeatured) params.set("isFeatured", "true");

    navigate(`/search?${params.toString()}`);

    respond(
      q ? `Searching for ${q}` : "Searching products",
      q ? `${q} के लिए खोज रहा हूँ` : "प्रोडक्ट्स खोज रहा हूँ",
      q ? `${q} தேடுகிறேன்` : "பொருட்களை தேடுகிறேன்"
    );

    return;
  }

  if (
    command.includes("liked") ||
    command.includes("पसंदीदा") ||
    command.includes("விருப்பமான")
  ) {
    navigate("/likedproduct");
    respond("Navigated to Liked Products", "पसंदीदा प्रोडक्ट्स खोला गया", "விருப்பமான பொருட்கள் திறக்கப்பட்டது");
    return;
  }

  if (
    command.includes("orders") ||
    command.includes("ऑर्डर") ||
    command.includes("ஆர்டர்")
  ) {
    navigate("/orders");
    respond("Navigated to Orders", "ऑर्डर पेज खोला गया", "ஆர்டர் பக்கம் திறக்கப்பட்டது");
    return;
  }

  respond(
    "Command not recognized",
    "कमांड समझ में नहीं आया",
    "கட்டளை புரியவில்லை"
  );
};