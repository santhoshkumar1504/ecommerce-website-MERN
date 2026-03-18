import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaStar } from "react-icons/fa";

const ReviewSection = ({ product, setProduct }) => {
  const [hover, setHover] = useState(0);
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!rating) {
      toast.error("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please enter your review");
      return;
    }

    try {
      setSubmitting(true);

      const res = await axios.post(
        `http://localhost:5000/api/v1/reviews/create-review/${product._id}`,
        {
          name,
          rating,
          comment,
        },
        { withCredentials: true }
      );

      toast.success(res.data.message || "Review added successfully");

      if (res.data?.data) {
        setProduct((prev) => ({
          ...prev,
          ratings: res.data.data.ratings,
          numReview: res.data.data.numReview,
          reviews: res.data.data.reviews,
        }));
      }

      setName("");
      setRating(0);
      setHover(0);
      setComment("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="review-section mt-5">
      <h3 className="mb-3">Customer Reviews</h3>

      <div className="review-summary mb-4">
        <h5 className="mb-1">
          {Number(product?.ratings || 0).toFixed(1)} / 5
        </h5>
        <p className="text-muted mb-0">
          {product?.numReview || 0} review{product?.numReview > 1 ? "s" : ""}
        </p>
      </div>

      <form onSubmit={handleSubmitReview} className="review-form mb-4">
        <div className="mb-3">
          <label className="form-label">Your Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label d-block">Your Rating</label>
          <div className="d-flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                size={26}
                style={{ cursor: "pointer" }}
                color={star <= (hover || rating) ? "#ffc107" : "#ddd"}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              />
            ))}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Your Review</label>
          <textarea
            className="form-control"
            rows="4"
            placeholder="Write your review here"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>

        <button
          type="submit"
          className="btn btn-dark px-4"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>

      <div className="review-list">
        {product?.reviews?.length > 0 ? (
          product.reviews
            .slice()
            .reverse()
            .map((review, index) => (
              <div className="card mb-3 shadow-sm border-0" key={index}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0 fw-bold">{review.name}</h6>
                    <div>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          size={16}
                          color={star <= review.rating ? "#ffc107" : "#ddd"}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mb-0 text-muted">{review.comment}</p>
                </div>
              </div>
            ))
        ) : (
          <p className="text-muted">No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;