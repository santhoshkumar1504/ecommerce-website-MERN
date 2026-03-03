export const parseCommand = (command, navigate) => {

  // SEARCH
  if (
    command.includes("search") ||
    command.includes("खोज") ||
    command.includes("ढूंढ") ||
    command.includes("தேடு")
  ) {

    const cleaned = command
      .replace("search", "")
      .replace("खोज", "")
      .replace("ढूंढ", "")
      .replace("தேடு", "")
      .trim();

    navigate(`/products?query=${cleaned}`);
    return;
  }

  // CART
  if (
    command.includes("cart") ||
    command.includes("कार्ट") ||
    command.includes("கார்ட்")
  ) {
    navigate("/cart");
    return;
  }

  // HOME
  if (
    command.includes("home") ||
    command.includes("होम") ||
    command.includes("முகப்பு")
  ) {
    navigate("/");
    return;
  }

  // ORDERS
  if (
    command.includes("orders") ||
    command.includes("ऑर्डर") ||
    command.includes("ஆர்டர்")
  ) {
    navigate("/my-orders");
    return;
  }

  console.log("Unrecognized command:", command);
};