import React from "react";

const ChatbotProductCard = ({ product }) => {
  return (
    <div className="cb-product-card">
      {product?.image ? (
        <img src={`http://localhost:5000/images/${product.image}`} alt={product.name} className="cb-product-img" />
      ) : (
        <div className="cb-product-placeholder">No Image</div>
      )}

      <div className="cb-product-info">
        <h4>{product?.name || "Unnamed Product"}</h4>
        <p>₹ {product?.price ?? "N/A"}</p>
        {product?.category && <p>Category: {product.category}</p>}
        {product?.brand && <p>Brand: {product.brand}</p>}
        {typeof product?.stock !== "undefined" && <p>Stock: {product.stock}</p>}
      </div>
    </div>
  );
};

export default ChatbotProductCard;