import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";
import remarkGfm from "remark-gfm";
import ProductReviews from "./ProductReviews";


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

  // Buying the product

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
    <div className="detailed-page py-5">
      <div className="container">

        {/* TOP SECTION */}
        <div className="row product-top">

          {/* LEFT IMAGE */}
          <div className="col-md-5">
            <div className="image-box">

              {discountPercent > 0 && (
                <span className="discount-badge">
                  {discountPercent}% OFF
                </span>
              )}

              <img
                src={imageUrl}
                alt={product.productName}
                className="product-img1"
              />

            </div>
          </div>


          {/* RIGHT DETAILS */}
          <div className="col-md-7 ps-5">

            <h2 className="title">
              {product.productName}
            </h2>

            <p className="meta fw-semibold fs-4">
              Brand: {product.brand} <br />
            </p>
            <p className="fs-5">
              Category: {product.category?.title}
            </p>


            {/* PRICE */}
            <div className="price-box">

              <span className="discount">
                ₹{product.discountedPrice}.00
              </span>

              {product.discountedPrice < product.price && (
                <span className="original ms-2">
                  ₹{product.price}.00
                </span>
              )}

            </div>


            {/* STOCK */}
            <p>
              {product.quantity > 0 ? (
                <span className="stock fs-6">
                  In Stock ({product.quantity})
                </span>
              ) : (
                <span className="out fs-6 fw-bold">
                  Out of stock
                </span>
              )}
            </p>


            {/* QUANTITY */}
            <div className="qty-box">

              <button
                onClick={() =>
                  setQuantity(quantity > 1 ? quantity - 1 : 1)
                }
              >
                -
              </button>

              <span>{quantity}</span>

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
            <div className="btns">

              <button
                className="add-btn"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>

              <button
                className="buy-btn"
                onClick={() => navigate("/cart")}
              >
                Buy Now
              </button>

            </div>

            <ProductReviews product={product} />

          </div>

        </div>


        {/* FULL WIDTH DESCRIPTION */}
        <div className="desc-box">

          <h4>Product Description</h4>

          <div className="product-markdown">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ node, ...props }) => <h2 className="pm-h2" {...props} />,
                h3: ({ node, ...props }) => <h3 className="pm-h3" {...props} />,
                p: ({ node, ...props }) => <p className="pm-p" {...props} />,
                ul: ({ node, ...props }) => <ul className="pm-ul" {...props} />,
                li: ({ node, ...props }) => <li className="pm-li" {...props} />,
                table: ({ node, ...props }) => (
                  <div className="pm-table-wrap">
                    <table className="pm-table" {...props} />
                  </div>
                ),
                thead: ({ node, ...props }) => <thead className="pm-thead" {...props} />,
                th: ({ node, ...props }) => <th className="pm-th" {...props} />,
                td: ({ node, ...props }) => <td className="pm-td" {...props} />,
                strong: ({ node, ...props }) => <strong className="pm-strong" {...props} />,
              }}
            >
              {product.productDesc}
            </ReactMarkdown>
          </div>

        </div>

      </div>



      <style>{`

.detailed-page {
  background: #f1f3f6;
}

/* TOP */
.image-box {
  position: relative;
  background: #ffffff;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #eee;
  min-height:50vh;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.product-img1 {
  max-width: 100%;
  min-height: 50vh;
  object-fit: contain;
  transition: 0.3s;
}

.product-img:hover {
  transform: scale(1.05);
}

.discount-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #ff3f6c;
  color: white;
  padding: 5px 12px;
  border-radius: 20px;
  z-index:2;
  font-size: 13px;
  font-weight: 600;
}

.product-top {
  background: white;
  padding: 25px;
  border-radius: 10px;
}

/* IMAGE */

/* TEXT */

.title {
  font-weight: 900;
  margin-top:40px;
  margin-bottom:25px;
}

.meta {
  color: gray;
  font-size:18px;
}

.price-box {
  margin: 10px 0;
}

.discount {
  font-size: 28px;
  color: red;
  font-weight: 700;
}

.original {
  margin-left: 10px;
  text-decoration: line-through;
}

/* STOCK */

.stock {
  color: green;
}

.out {
  color: red;
}

/* QTY */

.qty-box {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 30px 0;
}

.qty-box button {
  width: 38px;
  height: 38px;
  border: none;
  background: #111;
  color: white;
  font-size: 18px;
  border-radius: 8px;
  transition: 0.2s;
}

.qty-box button:hover {
  background: #333;
}

.qty-box span {
  font-size: 18px;
  font-weight: 600;
  width: 40px;
  text-align: center;
}

/* BUTTON */

.btns {
  display: flex;
  gap: 30px;
  margin-top: 35px;
}


/* ADD TO CART */

.add-btn {
  background: linear-gradient(45deg, #ff8008, #ffc837);
  border: none;
  padding: 12px 25px;
  border-radius: 30px;
  font-weight: 600;
  color: white;
  transition: 0.3s;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 10px rgba(0,0,0,0.2);
}


/* BUY NOW */

.buy-btn {
  background: black;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 30px;
  font-weight: 600;
  transition: 0.3s;
}

.buy-btn:hover {
  background: #333;
  transform: translateY(-2px);
}

/* DESCRIPTION */

.desc-box {
  margin-top: 20px;
  background: white;
  padding: 20px;
  border-radius: 10px;
}

.desc-box table {
  width: 100%;
  border-collapse: collapse;
}

.product-markdown {
  background: #ffffff;
  border-radius: 22px;
  padding: 24px 26px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
  border: 1px solid #eef2f7;
  line-height: 1.75;
}

.pm-h2 {
  font-size: 2rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 1.25rem 0;
  padding-bottom: 0.7rem;
  border-bottom: 2px solid #e2e8f0;
  letter-spacing: -0.02em;
}

.pm-h3 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2563eb;
  margin-top: 1.7rem;
  margin-bottom: 0.9rem;
  padding-left: 12px;
  border-left: 4px solid #2563eb;
  background: linear-gradient(to right, rgba(37, 99, 235, 0.08), transparent);
  border-radius: 6px;
  min-height: 38px;
  display: flex;
  align-items: center;
}

.pm-p {
  font-size: 1rem;
  color: #475569;
  margin-bottom: 1rem;
  text-align: justify;
}

.pm-strong {
  color: #111827;
  font-weight: 700;
}

.pm-ul {
  margin: 0.4rem 0 1.1rem 0;
  padding-left: 0;
  list-style: none;
}

.pm-li {
  position: relative;
  padding-left: 1.6rem;
  margin-bottom: 0.7rem;
  color: #475569;
  font-size: 0.98rem;
}

.pm-li::before {
  content: "•";
  position: absolute;
  left: 0;
  top: 0;
  color: #2563eb;
  font-size: 1.2rem;
  line-height: 1.2;
}

.pm-table-wrap {
  width: 100%;
  overflow-x: auto;
  margin-top: 1rem;
  margin-bottom: 1.2rem;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
}

.pm-table {
  width: 100%;
  border-collapse: collapse;
  background: #ffffff;
  min-width: 520px;
}

.pm-thead {
  background: linear-gradient(to right, #eff6ff, #f8fafc);
}

.pm-th {
  padding: 14px 16px;
  text-align: left;
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
  border-bottom: 1px solid #e5e7eb;
}

.pm-td {
  padding: 13px 16px;
  font-size: 0.95rem;
  color: #475569;
  border-bottom: 1px solid #f1f5f9;
}

.pm-table tr:last-child .pm-td {
  border-bottom: none;
}

.pm-table tr:hover {
  background: #f8fafc;
}

@media (max-width: 768px) {
  .product-markdown {
    padding: 18px 16px;
    border-radius: 16px;
  }

  .pm-h2 {
    font-size: 1.55rem;
  }

  .pm-h3 {
    font-size: 1.05rem;
    margin-top: 1.4rem;
  }

  .pm-p,
  .pm-li,
  .pm-th,
  .pm-td {
    font-size: 0.92rem;
  }
}

`}</style>

    </div>
  );
};

export default DetailedProduct;