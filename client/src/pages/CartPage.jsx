import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { fetchCartCount } = useCart();
  const [cartItems, setCartItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/checkouts", {
        withCredentials: true,
      });
      const items = res?.data?.data?.product || [];
      setCartItems(items);

      // ✅ first time select all
      setSelectedIds(new Set(items.map((i) => i._id)));
    } catch (error) {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const allSelected = cartItems.length > 0 && selectedIds.size === cartItems.length;

  const toggleAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(cartItems.map((i) => i._id)));
  };

  const toggleItem = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectedItems = useMemo(
    () => cartItems.filter((i) => selectedIds.has(i._id)),
    [cartItems, selectedIds]
  );

  const totalQty = useMemo(
    () => selectedItems.reduce((sum, i) => sum + Number(i.quantity || 1), 0),
    [selectedItems]
  );

  const totalPrice = useMemo(() => {
    return selectedItems.reduce((sum, item) => {
      const p = item.productId;
      const price = Number(p?.discountedPrice || p?.price || 0);
      const qty = Number(item.quantity || 1);
      return sum + price * qty;
    }, 0);
  }, [selectedItems]);

  const handleRemove = async (checkoutId) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/checkouts/${checkoutId}`, {
        withCredentials: true,
      });

      toast.success("Removed from cart");

      setCartItems((prev) => prev.filter((x) => x._id !== checkoutId));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(checkoutId);
        return next;
      });

      fetchCartCount();
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const updateQty = async (checkoutId, newQty) => {
    if (newQty < 1) return;

    // optimistic UI
    setCartItems((prev) =>
      prev.map((i) => (i._id === checkoutId ? { ...i, quantity: newQty } : i))
    );

    try {
      await axios.put(
        `http://localhost:5000/api/v1/checkouts/${checkoutId}`,
        { quantity: newQty },
        { withCredentials: true }
      );
    } catch (err) {
      toast.error("Failed to update quantity");
      fetchCart(); // rollback by refetch
    }
  };

  const handleBuyNow = async () => {
    if (selectedItems.length === 0) {
      toast.error("Select at least one product");
      return;
    }

    try {
      setBuying(true);

      // simple: pass selected items to /checkout
      navigate("/checkout", {
        state: {
          items: selectedItems,
          totalQty,
          totalPrice,
        },
      });
    } finally {
      setBuying(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-dark"></div>
      </div>
    );
  }

  return (
    <div className="cart-page py-5">
      <div className="container">
        <div className="topbar">
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            ← Go Back
          </button>

          <div className="select-all">
            <input id="selectAll" type="checkbox" checked={allSelected} onChange={toggleAll} />
            <label htmlFor="selectAll">Select All</label>
          </div>
        </div>

        <div className="cart-layout">
          <div className="cart-wrapper">
            <h2 className="mb-4 text-center fw-bold">Your Shopping Cart</h2>

            {cartItems.length === 0 ? (
              <h5 className="text-center text-muted">Your cart is empty 🛒</h5>
            ) : (
              cartItems.map((item) => {
                const product = item.productId;
                const imageUrl = `http://localhost:5000/images/${product?.pic?.fileName}`;
                const price = Number(product?.discountedPrice || product?.price || 0);
                const qty = Number(item.quantity || 1);

                return (
                  <div className="cart-card mb-3" key={item._id}>
                    <div className="cart-check">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(item._id)}
                        onChange={() => toggleItem(item._id)}
                      />
                    </div>

                    <div className="cart-left">
                      <img src={imageUrl} alt={product?.productName || "Product"} />
                    </div>

                    <div className="cart-middle">
                      <h5 className="m-0">{product?.productName}</h5>
                      <p className="desc m-0">{(product?.productDesc || "").slice(0, 90)}...</p>

                      <div className="qty-row">
                        <button
                          className="qty-btn"
                          onClick={() => updateQty(item._id, qty - 1)}
                          disabled={qty <= 1}
                        >
                          −
                        </button>
                        <span className="qty">{qty}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateQty(item._id, qty + 1)}
                        >
                          +
                        </button>
                        <span className="line-price">₹{price * qty}</span>
                      </div>
                    </div>

                    <div className="cart-right">
                      <button className="remove-btn" onClick={() => handleRemove(item._id)}>
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="summary-card">
            <h4 className="fw-bold mb-3">Order Summary</h4>

            <div className="summary-row">
              <span>Selected Items</span>
              <b>{selectedItems.length}</b>
            </div>
            <div className="summary-row">
              <span>Total Quantity</span>
              <b>{totalQty}</b>
            </div>
            <div className="summary-row total-row">
              <span>Total</span>
              <b>₹{totalPrice}</b>
            </div>

            <button
              className="buy-now-btn"
              onClick={handleBuyNow}
              disabled={selectedItems.length === 0 || buying}
            >
              {buying ? "Processing..." : "Buy Now"}
            </button>

            <p className="summary-note">Tip: unselect products you don’t want now.</p>
          </div>
        </div>
      </div>

      <style>{`
        .cart-page { background: linear-gradient(to right, #f8f9fa, #eef1f5); min-height: 100vh; }
        .topbar{ display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; }
        .select-all{ display:flex; align-items:center; gap:8px; font-weight:600; }
        .select-all input{ width:18px; height:18px; cursor:pointer; }

        .cart-layout{ display:grid; grid-template-columns: 1fr 320px; gap:20px; align-items:start; }
        @media (max-width: 992px){ .cart-layout{ grid-template-columns: 1fr; } }

        .cart-wrapper{ max-width: 900px; margin: 0 auto; }

        .cart-card{
          display:flex; align-items:center; gap:14px;
          background: rgba(255,255,255,0.75); backdrop-filter: blur(14px);
          border-radius:18px; padding:16px 18px;
          box-shadow: 0 12px 25px rgba(0,0,0,0.08);
          transition: 0.3s ease;
        }
        .cart-card:hover{ transform: translateY(-4px); box-shadow: 0 18px 35px rgba(0,0,0,0.12); }

        .cart-check input{ width:18px; height:18px; cursor:pointer; }
        .cart-left img{ width:92px; height:92px; object-fit:cover; border-radius:12px; }

        .cart-middle{ flex:1; }
        .cart-middle h5{ font-weight:800; margin-bottom:6px; }
        .desc{ color:#666; font-size:13.5px; margin-top:4px; }

        .qty-row{ display:flex; align-items:center; gap:10px; margin-top:10px; flex-wrap:wrap; }
        .qty-btn{
          width:34px; height:34px; border-radius:10px; border:none;
          background:#111; color:#fff; font-size:18px; transition:0.2s;
        }
        .qty-btn:disabled{ opacity:0.5; cursor:not-allowed; }
        .qty{ font-weight:800; min-width:18px; text-align:center; }
        .line-price{ margin-left:auto; font-weight:900; color:#e63946; }

        .cart-right{ min-width:110px; text-align:right; }
        .remove-btn{
          background: transparent; border:2px solid #e63946; color:#e63946;
          padding:6px 16px; border-radius:25px; transition:0.3s;
        }
        .remove-btn:hover{ background:#e63946; color:white; }

        .summary-card{
          background: rgba(255,255,255,0.75); backdrop-filter: blur(14px);
          border-radius:18px; padding:18px;
          box-shadow: 0 12px 25px rgba(0,0,0,0.08);
          position: sticky; top: 20px;
        }
        .summary-row{ display:flex; justify-content:space-between; margin-bottom:10px; color:#333; }
        .total-row{ border-top:1px solid rgba(0,0,0,0.08); padding-top:12px; margin-top:12px; font-size:18px; }

        .buy-now-btn{
          width:100%; margin-top:14px;
          background:black; color:white; border:none; padding:12px;
          border-radius:999px; font-weight:800; transition:0.3s;
        }
        .buy-now-btn:hover{ transform: translateY(-3px); box-shadow: 0 10px 25px rgba(0,0,0,0.18); background:#111; }
        .buy-now-btn:disabled{ opacity:0.6; cursor:not-allowed; transform:none; box-shadow:none; }

        .summary-note{ margin-top:10px; font-size:12.5px; color:#666; }
      `}</style>
    </div>
  );
};

export default Cart;