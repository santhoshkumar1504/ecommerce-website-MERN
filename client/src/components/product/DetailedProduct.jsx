import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";

const DetailedProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchCartCount } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  // Fetch Product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/v1/products/${id}`
        );
        setProduct(res?.data?.data?.product);
      } catch (error) {
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  // Add To Cart
  const handleAddToCart = async () => {
    try {
      setAdding(true);

      await axios.post(
        `http://localhost:5000/api/v1/checkouts/addCheckout/${product._id}`,
        { quantity },
        { withCredentials: true }
      );

      fetchCartCount();
      toast.success("Added to cart 🛒");

    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Please login first");
        navigate("/login");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-dark"></div>
      </div>
    );
  }

  if (!product) return <h3 className="text-center mt-5">Product Not Found</h3>;

  const imageUrl = `http://localhost:5000/images/${product?.pic?.fileName}`;

  const discountPercent = product.price
    ? Math.round(
        ((product.price - product.discountedPrice) / product.price) * 100
      )
    : 0;

  return (
    <div className="detailed-page py-5 fade-in">
      <div className="container">
        <div className="product-card row align-items-center">

          {/* IMAGE */}
          <div className="col-md-6">
            <div className="image-wrapper">
              {discountPercent > 0 && (
                <div className="discount-badge">
                  {discountPercent}% OFF
                </div>
              )}
              <img
                src={imageUrl}
                alt={product.productName}
                className="img-fluid main-img"
              />
            </div>
          </div>

          {/* DETAILS */}
          <div className="col-md-6">
            <h2 className="product-title">{product.productName}</h2>

            <p className="meta-text">
              Brand: {product.brand}  |  Category: {product.category?.title}
            </p>

            {/* PRICE */}
            <div className="price-section">
              <span className="discount-price">
                ₹ {product.discountedPrice}
              </span>

              {product.discountedPrice < product.price && (
                <span className="original-price">
                  ₹{product.price}
                </span>
              )}
            </div>

            {/* STOCK */}
            <p>
              {product.quantity > 0 ? (
                <span className="in-stock">
                  In Stock ({product.quantity})
                </span>
              ) : (
                <span className="out-stock">Out of Stock</span>
              )}
            </p>

            {/* DESCRIPTION */}
            <div className="ai-description">
              <ReactMarkdown>
                {product.productDesc}
              </ReactMarkdown>
            </div>

            {/* QUANTITY */}
            <div className="quantity-box">
              <button
                onClick={() =>
                  setQuantity(quantity > 1 ? quantity - 1 : 1)
                }
              >
                -
              </button>

              <strong>{quantity}</strong>

              <button
                onClick={() =>
                  setQuantity(
                    quantity < product.quantity
                      ? quantity + 1
                      : quantity
                  )
                }
              >
                +
              </button>
            </div>

            {/* BUTTONS */}
            <div className="btn-group-custom">
              <button
                className="cart-btn"
                onClick={handleAddToCart}
                disabled={product.quantity === 0 || adding}
              >
                {adding ? "Adding..." : "Add To Cart"}
              </button>

              <button
                className="buy-btn"
                onClick={() => navigate("/cart")}
              >
                Go To Cart
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* YOUR CUSTOM CSS */}
      <style>{`

      .detailed-page {
        background: linear-gradient(to right, #f8f9fa, #eef1f5);
        min-height: 100vh;
      }

      .product-card {
        background: rgba(255, 255, 255, 0.6);
        backdrop-filter: blur(15px);
        border-radius: 20px;
        padding: 45px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.08);
      }

      .image-wrapper {
        position: relative;
        overflow: hidden;
        border-radius: 20px;
      }

      .main-img {
        transition: transform 0.5s ease;
      }

      .main-img:hover {
        transform: scale(1.12);
      }

      .discount-badge {
        position: absolute;
        top: 15px;
        left: 15px;
        background: linear-gradient(45deg, red, darkred);
        color: white;
        padding: 8px 14px;
        border-radius: 50px;
        font-weight: bold;
        font-size: 14px;
      }

      .product-title {
        font-weight: 700;
        margin-bottom: 10px;
      }

      .meta-text {
        color: #666;
      }

      .price-section {
        margin: 20px 0;
      }

      .discount-price {
        color: #e63946;
        font-size: 28px;
      }

      .original-price {
        margin-left: 15px;
        text-decoration: line-through;
        color: #888;
      }

      .in-stock {
        color: green;
        font-weight: 600;
      }

      .out-stock {
        color: red;
        font-weight: 600;
      }

      .ai-description {
        background: #f9f7ff;
        padding: 15px;
        border-radius: 10px;
        border-left: 4px solid #6f42c1;
        font-size: 14px;
        line-height: 1.6;
      }

      .quantity-box {
        display: flex;
        align-items: center;
        gap: 15px;
        margin: 25px 0;
      }

      .quantity-box button {
        background: #111;
        color: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 10px;
        font-size: 18px;
        transition: 0.3s;
      }

      .quantity-box button:hover {
        background: #333;
      }

      .btn-group-custom {
        display: flex;
        gap: 20px;
      }

      .cart-btn {
        background: black;
        color: white;
        padding: 12px 30px;
        border: none;
        border-radius: 30px;
        transition: 0.3s;
      }

      .cart-btn:hover {
        background: #333;
        transform: translateY(-4px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.2);
      }

      .buy-btn {
        background: transparent;
        border: 2px solid black;
        padding: 12px 30px;
        border-radius: 30px;
        transition: 0.3s;
      }

      .buy-btn:hover {
        background: black;
        color: white;
      }

      .fade-in {
        animation: fadeIn 0.8s ease-in-out;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }

      `}</style>
    </div>
  );
};

export default DetailedProduct;