import "../../assets/styles/product.css";
import { GrFavorite } from "react-icons/gr";
import { IoIosHeartDislike } from "react-icons/io";
import { CiStar } from "react-icons/ci";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const ProductP = ({ data }) => {
  const [likedProducts, setLikedProducts] = useState([]);
  const navigate = useNavigate();
  const { fetchCartCount } = useCart();
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchLikedProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/v1/liked", {
          withCredentials: true,
        });

        const ids = res.data.data.product.map((item) => item.productId._id);
        setLikedProducts(ids);
      } catch (error) {
        // ignore if not logged in
      }
    };

    fetchLikedProducts();
  }, []);

  const isLiked = likedProducts.includes(data._id);

  const addToLiked = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await axios.post(
        `http://localhost:5000/api/v1/liked/addliked/${data._id}`,
        {},
        { withCredentials: true }
      );

      setLikedProducts((prev) => [...prev, data._id]);
      toast.success("Added to liked products");
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Please login first");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Failed to like product");
      }
    }
  };

  const removeFromLiked = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await axios.delete(`http://localhost:5000/api/v1/liked/${data._id}`, {
        withCredentials: true,
      });

      setLikedProducts((prev) => prev.filter((id) => id !== data._id));
      toast.success("Removed from liked products");
    } catch (error) {
      toast.error("Failed to remove product");
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setAdding(true);

      await axios.post(
        `http://localhost:5000/api/v1/checkouts/addCheckout/${data._id}`,
        { quantity: 1 },
        { withCredentials: true }
      );

      fetchCartCount();
      toast.success("Added to cart 🛒");
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Please login first");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Failed to add to cart");
      }
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="products modern-product-card">
      <Link
        to={`/products/${data._id}`}
        className="text-decoration-none product-link-area"
      >
        <div className="product-img-wrapper">
          <img
            src={`http://localhost:5000/images/${data.pic.fileName}`}
            alt={data.productName}
            className="product-img"
          />
        </div>

        <h6 className="product-detail mt-2 product-title">{data.productName}</h6>

        <div className="product-detail">
          <p className="product-desc">{data.productDesc}</p>

          <strong className="product-price">Price: ₹{data.price}</strong>

          <div className="d-flex review mt-2 align-items-center">
            <CiStar className="star" />
            <span className="ms-1">
              {data.ratings} | {data.numReview} reviews
            </span>
          </div>
        </div>
      </Link>

      <div className="my-3 d-flex btn-group-custom">
        {isLiked ? (
          <button
            className="modern-like-btn liked"
            onClick={removeFromLiked}
            title="Remove from liked"
            type="button"
          >
            <IoIosHeartDislike />
          </button>
        ) : (
          <button
            className="modern-like-btn"
            onClick={addToLiked}
            title="Add to liked"
            type="button"
          >
            <GrFavorite />
          </button>
        )}

        <button
          className="modern-cart-btn"
          onClick={handleAddToCart}
          disabled={adding}
          type="button"
        >
          {adding ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductP;