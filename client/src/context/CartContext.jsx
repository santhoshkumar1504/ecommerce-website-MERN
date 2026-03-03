import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/checkouts",
        { withCredentials: true }
      );

      // If backend sends count
      if (res.data?.data?.count !== undefined) {
        setCartCount(res.data.data.count);
      } else if (res.data?.data?.product) {
        // fallback if count not available
        setCartCount(res.data.data.product.length);
      } else {
        setCartCount(0);
      }

    } catch (error) {
      console.log("Cart fetch error:", error.response?.data || error.message);
      setCartCount(0);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);