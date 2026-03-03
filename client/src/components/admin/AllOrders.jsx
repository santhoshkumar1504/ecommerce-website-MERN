import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const AllOrders = () => {
  const [orders, setOrders] = useState([])
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [search, setSearch] = useState("");
const [uuidSearch, setUuidSearch] = useState("");
  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowModal(true);
  };

  const handleUpdateStatus = async () => {
    try {
      // 🔹 Update backend (optional but recommended)
      await axios.put(
        `http://localhost:5000/api/v1/orders/status/${selectedOrder._id}`,
        { status: newStatus },
        { withCredentials: true }
      );

      // 🔹 Update UI instantly
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === selectedOrder._id
            ? { ...order, status: newStatus }
            : order
        )
      );

      setShowModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/v1/orders?q=${search}`,
        { withCredentials: true }
      );
      setOrders(res?.data?.data?.orders || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [search]);


  // useEffect(() => {
  //   try {
  //     async function fetch() {
  //       const res = await axios.get('http://localhost:5000/api/v1/orders', { withCredentials: true })
  //       setOrders(res?.data?.data?.orders)
  //     }
  //     fetch()
  //   }
  //   catch (error) {
  //     console.log(error)
  //   }
  // }, [])

  const getStatusBadge = (status) => {
    switch (status) {
      case "Ordered":
        return <span className="badge bg-primary">{status}</span>;

      case "Product delivered":
  return <span className="badge bg-success">{status}</span>;

      case "Order cancelled":
        return <span className="badge bg-danger">{status}</span>;

      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2 className="mb-4">All Orders</h2>
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search by name or mobile..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            height: "42px",
            padding: "0 12px 0 38px",
            borderRadius: "8px",
            border: "1px solid #dee2e6",
            outline: "none",
            fontSize: "16px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            transition: "all 0.2s ease-in-out",
          }}
        />
        <div className="d-flex gap-3 mb-3">
  <input
    type="text"
    className="form-control"
    placeholder="Search by UUID (Scan QR or Paste)"
    value={uuidSearch}
    onChange={(e) => setUuidSearch(e.target.value)}
  />
</div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover text-center">
          <thead className="table-dark">
            <tr>
              <th>UUID</th>
              <th>#</th>
              <th>Product</th>
              <th>Customer</th>
              <th>Mobile</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

         <tbody>
  {orders
    .filter((order) => {
      const name = order?.createdBy?.name?.toLowerCase() || "";
      const phone = order?.createdBy?.phone?.toLowerCase() || "";
      const uuid = order?.productDetail?.uuid?.toLowerCase() || "";

      const searchText = search.toLowerCase();
      const uuidText = uuidSearch.toLowerCase();

      const matchesText =
        searchText
          ? name.includes(searchText) || phone.includes(searchText)
          : true;

      const matchesUuid =
        uuidText ? uuid.includes(uuidText) : true;

      return matchesText && matchesUuid;
    })
    .map((order, index) => {
      const price =
        order?.productDetail?.discountedPrice ||
        order?.productDetail?.price ||
        0;

      const quantity = order?.orderQuantity || 0;

      return (
        <tr key={order._id}>
          <td>
  <span className="badge bg-dark">
    {order?.productDetail?.uuid || "N/A"}
  </span>
</td>
          <td>{index + 1}</td>
          <td>{order?.productDetail?.productName}</td>
          <td>{order?.createdBy?.name || "Guest"}</td>
          <td>{order?.createdBy?.phone || "N/A"}</td>
          <td>₹{price}</td>
          <td>{quantity}</td>
          <td>₹{price * quantity}</td>
          <td>{getStatusBadge(order?.status)}</td>
          <td>
            <button
              className="btn btn-sm btn-warning"
              onClick={() => handleOpenModal(order)}
            >
              Update
            </button>
          </td>
        </tr>
      );
    })}
</tbody>
        </table>

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Update Order Status</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Select Status</Form.Label>
                <Form.Select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="Ordered">Ordered</option>
                  <option value="Product delivered">Product delivered</option>
                  <option value="Order cancelled">Order Cancelled</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdateStatus}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default AllOrders;