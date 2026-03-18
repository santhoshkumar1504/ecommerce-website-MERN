import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/common/Footer";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { MdDelete, MdCancel, MdLocationOn } from "react-icons/md";
import { FaBoxOpen } from "react-icons/fa";
import { toast } from "react-toastify";
import ReviewSection from "../components/product/ReviewSection";

const Orders = () => {
  const [products, setProducts] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/v1/orders/user", {
          withCredentials: true,
        });
        setProducts(res?.data?.data?.order || []);
      } catch (error) {
        if (error.response?.status === 401) {
          setIsAuthenticated(false);
        } else {
          toast.error("Failed to load orders");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleClick = () => {
    navigate("/");
  };

  const handleCancelOrder = async (orderId) => {
    try {
      setCancellingId(orderId);

      const res = await axios.put(
        `http://localhost:5000/api/v1/orders/cancel-order/${orderId}`,
        {},
        { withCredentials: true }
      );

      if (res?.data?.status) {
        toast.success(res?.data?.message || "Order Cancelled");

        setProducts((prev) =>
          prev.map((item) =>
            item._id === orderId
              ? { ...item, status: "Order cancelled" }
              : item
          )
        );
      } else {
        toast.error(res?.data?.message || "Failed to cancel order");
      }
    } catch (error) {
      console.log("Cancel order error:", error);
      toast.error(error.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancellingId("");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      setDeletingId(orderId);

      const res = await axios.delete(
        `http://localhost:5000/api/v1/orders/delete-order/${orderId}`,
        { withCredentials: true }
      );

      if (res?.data?.status) {
        toast.success(res?.data?.message || "Order deleted");

        setProducts((prev) => prev.filter((item) => item._id !== orderId));
      } else {
        toast.error(res?.data?.message || "Failed to delete order");
      }
    } catch (error) {
      console.log("Delete order error:", error);
      toast.error(error.response?.data?.message || "Failed to delete order");
    } finally {
      setDeletingId("");
    }
  };

  if (loading) {
    return (
      <div className="loader-wrap">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="auth-box">
        <h2 className="msg">Please login to view your orders</h2>
        <Link to="/login">
          <button className="login-btn">Login</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container py-4">
        <div className="orders-topbar">
          <button className="back-btn" onClick={handleClick}>
            <IoArrowBackCircleSharp className="me-2" />
            Back
          </button>
        </div>

        <div className="orders-header">
          <h2>Your Orders</h2>
          <p>Track, cancel, or remove cancelled orders.</p>
        </div>

        {products.length === 0 ? (
          <div className="empty-state">
            <FaBoxOpen size={42} />
            <h4>No orders yet</h4>
            <p>Your placed orders will appear here.</p>
          </div>
        ) : (
          <div className="orders-grid">
            {products.map((item) => {
              const product = item.product;
              const imageName = product?.pic || "";
              const imageUrl = `http://localhost:5000/images/${imageName}`;
              const isCancelled = item.status === "Order cancelled";

              return (
                <div key={item._id} className="order-card">
                  <div className="order-image-wrap">
                    <img
                      src={imageUrl}
                      alt={product?.name || "product"}
                      className="order-image"
                    />
                    <span
                      className={`status-badge ${isCancelled ? "cancelled" : "ordered"}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="order-body">
                    <h4 className="order-title">{product?.name}</h4>

                    <div className="order-meta">
                      <span><strong>Brand:</strong> {product?.brand}</span>
                      <span><strong>Qty:</strong> {item?.orderQuantity}</span>
                      <span>
                        <strong>Price:</strong> ₹
                        {product?.discountedPrice || product?.price}
                      </span>
                    </div>

                    <p className="order-desc">
                      {product?.desc?.slice(0, 110) || "No description"}
                      {(product?.desc || "").length > 110 ? "..." : ""}
                    </p>

                    <div className="address-chip">
                      <MdLocationOn size={18} />
                      <span>{item?.address || "No address available"}</span>
                    </div>

                    <ReviewSection product={product}/>

                    <div className="actions-row">
                      <button
                        className="view-btn"
                        onClick={() => navigate(`/products/${product?._id}`)}
                      >
                        View Product
                      </button>

                      {!isCancelled ? (
                        <button
                          className="cancel-btn"
                          onClick={() => handleCancelOrder(item._id)}
                          disabled={cancellingId === item._id}
                        >
                          <MdCancel size={18} />
                          {cancellingId === item._id ? "Cancelling..." : "Cancel"}
                        </button>
                      ) : (
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteOrder(item._id)}
                          disabled={deletingId === item._id}
                        >
                          <MdDelete size={18} />
                          {deletingId === item._id ? "Deleting..." : "Delete"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />

      <style>{`
        .orders-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(13,110,253,0.10), transparent 28%),
            radial-gradient(circle at bottom right, rgba(255,99,132,0.10), transparent 25%),
            linear-gradient(135deg, #f8fafc, #eef2f7);
        }

        .orders-topbar {
          display: flex;
          justify-content: flex-start;
          margin-bottom: 18px;
        }

        .back-btn {
          border: none;
          background: linear-gradient(135deg, #0d6efd, #3d8bfd);
          color: #fff;
          padding: 10px 18px;
          border-radius: 999px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          box-shadow: 0 10px 24px rgba(13,110,253,0.25);
          transition: 0.25s ease;
        }

        .back-btn:hover {
          transform: translateY(-2px);
        }

        .orders-header {
          text-align: center;
          margin-bottom: 28px;
        }

        .orders-header h2 {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 6px;
          color: #111827;
        }

        .orders-header p {
          color: #6b7280;
          margin-bottom: 0;
        }

        .orders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
        }

        .order-card {
          background: rgba(255,255,255,0.78);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.55);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 18px 40px rgba(15, 23, 42, 0.10);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .order-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 50px rgba(15, 23, 42, 0.14);
        }

        .order-image-wrap {
          position: relative;
          height: 230px;
          background: #f3f4f6;
        }

        .order-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .status-badge {
          position: absolute;
          top: 14px;
          right: 14px;
          padding: 8px 14px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
          color: #fff;
          letter-spacing: 0.2px;
        }

        .status-badge.ordered {
          background: linear-gradient(135deg, #198754, #20c997);
        }

        .status-badge.cancelled {
          background: linear-gradient(135deg, #dc3545, #ff6b6b);
        }

        .order-body {
          padding: 18px;
        }

        .order-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #111827;
          margin-bottom: 12px;
        }

        .order-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 12px;
        }

        .order-meta span {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 999px;
          padding: 6px 12px;
          font-size: 13px;
          color: #374151;
        }

        .order-desc {
          color: #6b7280;
          font-size: 14px;
          line-height: 1.6;
          min-height: 46px;
          margin-bottom: 14px;
        }

        .address-chip {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          background: linear-gradient(135deg, #eef4ff, #f6f8ff);
          border: 1px solid #dbe7ff;
          border-radius: 14px;
          padding: 12px 14px;
          color: #374151;
          font-size: 14px;
          margin-bottom: 16px;
        }

        .actions-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .view-btn,
        .cancel-btn,
        .delete-btn {
          border: none;
          border-radius: 14px;
          padding: 11px 14px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: 0.25s ease;
        }

        .view-btn {
          background: #111827;
          color: #fff;
        }

        .view-btn:hover {
          background: #1f2937;
        }

        .cancel-btn {
          background: linear-gradient(135deg, #fff5f5, #ffe3e3);
          color: #c92a2a;
          border: 1px solid #ffc9c9;
        }

        .cancel-btn:hover {
          transform: translateY(-2px);
        }

        .delete-btn {
          background: linear-gradient(135deg, #dc3545, #ef476f);
          color: #fff;
          box-shadow: 0 10px 22px rgba(220,53,69,0.22);
        }

        .delete-btn:hover {
          transform: translateY(-2px);
        }

        .view-btn:disabled,
        .cancel-btn:disabled,
        .delete-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
        }

        .empty-state {
          background: rgba(255,255,255,0.78);
          border-radius: 24px;
          padding: 54px 20px;
          text-align: center;
          color: #6b7280;
          box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
        }

        .empty-state h4 {
          margin-top: 14px;
          font-weight: 800;
          color: #111827;
        }

        .auth-box,
        .loader-wrap {
          min-height: 70vh;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }

        .login-btn {
          margin-top: 14px;
          border: none;
          background: #0d6efd;
          color: #fff;
          padding: 10px 18px;
          border-radius: 999px;
          font-weight: 700;
        }

        @media (max-width: 576px) {
          .actions-row {
            grid-template-columns: 1fr;
          }

          .order-image-wrap {
            height: 200px;
          }
        }
      `}</style>
    </div>
  );
};

export default Orders;