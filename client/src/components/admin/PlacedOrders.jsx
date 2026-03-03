import axios from "axios";
import React, { useEffect, useState } from "react";

const PlacedOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/v1/orders",
          { withCredentials: true }
        );

        setOrders(res?.data?.data?.orders || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Ordered":
        return <span className="badge bg-primary">{status}</span>;

      case "Product deliveried":
        return <span className="badge bg-success">{status}</span>;

      case "Order cancelled":
        return <span className="badge bg-danger">{status}</span>;

      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Ordered Products</h2>

      <div className="table-responsive">
        <table className="table table-bordered table-hover text-center">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Product Image</th>
              <th>Product</th>
              <th>UUID</th>
              <th>QR</th>
              <th>Customer</th>
              <th>Mobile</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="11">No Orders Found</td>
              </tr>
            ) : (
              orders
                .filter((order) => order.status === "Ordered")
                .map((order, index) => {
                  const product = order?.productDetail;

                  const price =
                    product?.discountedPrice || product?.price || 0;

                  const quantity = order?.orderQuantity || 0;
                  console.log(product)
                  console.log(product.pic.fileName)
                  return (
                    <tr key={order._id}>
                      <td>{index + 1}</td>

                      {/* ✅ Product Image */}
                      <td>
                        {product?.pic?.fileName && (
                          <img
                            src={`http://localhost:5000/images/${product.pic.fileName}`}
                            alt="product"
                            style={{ width: "60px", borderRadius: "8px" }}
                          />
                        )}
                      </td>

                      <td>{product?.productName}</td>

                      {/* ✅ UUID */}
                      <td>
                        <span className="badge bg-dark">
                          {product?.uuid || "N/A"}
                        </span>
                      </td>

                      {/* ✅ QR Code */}
                      <td>
                        {product?.qrCode && (
                          <img
                            src={`http://localhost:5000/${product.qrCode}`}
                            alt="QR"
                            style={{ width: "60px" }}
                          />
                        )}
                      </td>

                      <td>{order?.createdBy?.name || "Guest"}</td>

                      <td>{order?.createdBy?.phone || "N/A"}</td>

                      <td>₹{price}</td>

                      <td>{quantity}</td>

                      <td>₹{price * quantity}</td>

                      <td>{getStatusBadge(order?.status)}</td>
                    </tr>
                  );
                })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlacedOrders;