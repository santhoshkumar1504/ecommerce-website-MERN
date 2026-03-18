import { useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

const ProductReviews = ({ product }) => {
    const [showAllReviews, setShowAllReviews] = useState(false);

    const reviews = product?.reviews || [];
    const averageRating = Number(product?.ratings || 0);

    const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 3);

    const renderStars = (rating) => {
        const rounded = Math.round(Number(rating || 0));

        return (
            <div className="review-stars">
                {[1, 2, 3, 4, 5].map((star) =>
                    star <= rounded ? (
                        <FaStar key={star} className="star-filled" />
                    ) : (
                        <FaRegStar key={star} className="star-empty" />
                    )
                )}
            </div>
        );
    };

    return (
        <div className="product-reviews-box">
            <div className="review-summary">
                <div className="review-summary-top">
                    <h4 className="review-title">Ratings & Reviews</h4>
                    <div className="review-average">
                        {renderStars(averageRating)}
                        <span className="review-average-text">
                            {averageRating.toFixed(1)} / 5
                        </span>
                    </div>
                </div>

                <p className="review-count">
                    {product?.numReview || 0} review{product?.numReview > 1 ? "s" : ""}
                </p>
            </div>

            <div className="review-list">
                {reviews.length === 0 ? (
                    <p className="no-reviews">No reviews yet.</p>
                ) : (
                    visibleReviews.map((item) => (
                        <div className="single-review-card" key={item._id}>
                            <div className="single-review-head">
                                <h6 className="review-user-name" title={item.name}>{item.name[0]}</h6>
                                {renderStars(item.rating)}
                            </div>
                            <p className="review-comment">{item.comment}</p>
                        </div>
                    ))
                )}
            </div>

            {reviews.length > 3 && (
                <button
                    className="see-more-reviews-btn"
                    onClick={() => setShowAllReviews((prev) => !prev)}
                >
                    {showAllReviews ? "Show Less" : "... See All Reviews"}
                </button>
            )}

            <style>
                {`
        .product-reviews-box {
  margin-top: 30px;
  padding: 20px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.review-summary {
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 14px;
}

.review-summary-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.review-title {
  margin: 0;
  font-weight: 700;
  color: #222;
}

.review-average {
  display: flex;
  align-items: center;
  gap: 8px;
}

.review-average-text {
  font-weight: 600;
  color: #444;
}

.review-count {
  margin-top: 8px;
  margin-bottom: 0;
  color: #666;
  font-size: 14px;
}

.review-stars {
  display: flex;
  align-items: center;
  gap: 4px;
}

.star-filled {
  color: #f4b400;
  font-size: 16px;
}

.star-empty {
  color: #d9d9d9;
  font-size: 16px;
}

.review-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.single-review-card {
  background: #f9fafb;
  border-radius: 14px;
  padding: 14px 16px;
  border: 1px solid #eee;
}

.single-review-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.review-user-name {
  margin: 0;
  background-color:blue;
  padding:8px 13px;
  border-radius:50%;
  cursor:pointer;
  font-weight: 700;
  color: #fff;
}

.review-comment {
  margin: 0;
  color: #555;
  line-height: 1.5;
  white-space: pre-line;
}

.no-reviews {
  color: #777;
  margin: 0;
}

.see-more-reviews-btn {
  margin-top: 16px;
  border: none;
  background: #111;
  color: #fff;
  padding: 10px 18px;
  border-radius: 999px;
  font-weight: 600;
  transition: 0.3s ease;
}

.see-more-reviews-btn:hover {
  background: #333;
}
        `}
            </style>
        </div>
    );
};

export default ProductReviews;