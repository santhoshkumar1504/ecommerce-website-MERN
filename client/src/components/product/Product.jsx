import '../../assets/styles/product.css';
import { GrFavorite } from "react-icons/gr";
import { IoIosHeartDislike } from "react-icons/io";
import { CiStar } from "react-icons/ci";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Product = ({ data }) => {
  const [likedProducts, setLikedProducts] = useState([]);

  // Fetch liked products of logged-in user
  useEffect(() => {
    const fetchLikedProducts = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/v1/liked",
          { withCredentials: true }
        );
        const ids = res.data.data.product.map(
          item => item.productId._id
        );

        setLikedProducts(ids);
      } catch (error) {
        // user may not be logged in → ignore silently
      }
    };

    fetchLikedProducts();
  }, []);

  const isLiked = likedProducts.includes(data._id);

  const addToLiked = async () => {
  try {
    await axios.post(
      `http://localhost:5000/api/v1/liked/addliked/${data._id}`,
      {},
      { withCredentials: true }
    );

    setLikedProducts(prev => [...prev, data._id]);
    toast.success("Added to liked products");
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to like product");
  }
};

  const removeFromLiked = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/v1/liked/${data._id}`,
        { withCredentials: true }
      );

      setLikedProducts(prev =>
        prev.filter(id => id !== data._id)
      );

      toast.success("Removed from liked products");
    } catch (error) {
      toast.error("Failed to remove product");
    }
  };

  return (
    <div className="products">
      <img
        src={`http://localhost:5000/images/${data.pic.fileName}`}
        alt={data.productName}
        className="product-img"
      />

      <h6 className="product-detail mt-2">{data.productName}</h6>

      <div className="product-detail">
        {data.productDesc}
        <br />
        <strong>Price: ₹{data.price}</strong>

        <div className="d-flex review mt-1">
          <CiStar className="star" /> {data.ratings} | {data.numReview} reviews
        </div>

        <div className="my-2 d-flex">
          {isLiked ? (
            <button
              className="btn btn-danger mx-1"
              onClick={removeFromLiked}
              title="Remove from liked"
            >
              <IoIosHeartDislike />
            </button>
          ) : (
            <button
              className="btn btn-danger mx-1"
              onClick={addToLiked}
              title="Add to liked"
            >
              <GrFavorite />
            </button>
          )}

          <button className="btn btn-primary mx-1">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
