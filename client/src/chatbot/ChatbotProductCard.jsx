import React from "react";
import { useNavigate } from "react-router-dom";

const ChatbotProductCard = ({ product }) => {
  const navigate = useNavigate();

  const imageUrl = product?.image
    ? `http://localhost:5000/uploads/${product.image}`
    : null;

  const handleOpenProduct = () => {
    // change this route based on your actual product detail route
    navigate(`products/${product._id}`);
  };

  return (
    <div className="cb-product-card" onClick={handleOpenProduct} role="button" tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleOpenProduct();
        }
      }}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={product.name} className="cb-product-img" />
      ) : (
        <div className="cb-product-placeholder">No Image</div>
      )}

      <div className="cb-product-info">
        <h4>{product?.name || "Unnamed Product"}</h4>
        <p>₹ {product?.price ?? "N/A"}</p>
        {product?.category && <p>Category: {product.category}</p>}
        {product?.brand && <p>Brand: {product.brand}</p>}
        {typeof product?.stock !== "undefined" && <p>Stock: {product.stock}</p>}

        <button
          className="cb-view-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenProduct();
          }}
        >
          View Product
        </button>
      </div>
    </div>
  );
};

export default ChatbotProductCard;