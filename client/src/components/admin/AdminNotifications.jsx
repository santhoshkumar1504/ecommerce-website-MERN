import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminNotifications = () => {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | unread | read

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/v1/notifications", {
        withCredentials: true,
      });

      setNotifications(res?.data?.data?.notifications || []);
    } catch (err) {
      toast.error("Failed to load notifications");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/v1/notifications/${id}/read`,
        {},
        { withCredentials: true }
      );

      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      toast.success("Marked as read");
    } catch {
      toast.error("Failed to mark as read");
    }
  };

  const markAllRead = async () => {
    try {
      await axios.put(
        "http://localhost:5000/api/v1/notifications/read-all",
        {},
        { withCredentials: true }
      );

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("All marked as read");
    } catch {
      toast.error("Failed to mark all read");
    }
  };

  const clearAll = async () => {
    try {
      await axios.delete("http://localhost:5000/api/v1/notifications/clear", {
        withCredentials: true,
      });
      setNotifications([]);
      toast.success("Cleared notifications");
    } catch {
      toast.error("Failed to clear notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const filteredNotifications = useMemo(() => {
    const s = search.trim().toLowerCase();

    return notifications
      .filter((n) => {
        if (filter === "unread") return !n.isRead;
        if (filter === "read") return n.isRead;
        return true;
      })
      .filter((n) => {
        if (!s) return true;
        const title = (n.title || "").toLowerCase();
        const msg = (n.message || "").toLowerCase();
        return title.includes(s) || msg.includes(s);
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // newest first
  }, [notifications, search, filter]);

  const getTypeBadge = (n) => {
    // Optional: if backend sends type like "order" / "product" / "system"
    const type = (n.type || "system").toLowerCase();
    if (type === "order") return <span className="badge bg-primary">Order</span>;
    if (type === "product") return <span className="badge bg-success">Product</span>;
    if (type === "warning") return <span className="badge bg-warning text-dark">Warning</span>;
    return <span className="badge bg-secondary">System</span>;
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-dark" />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Header like AllOrders */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
        <div>
          <h2 className="mb-1">Notifications</h2>
          <div className="text-muted">
            Unread:{" "}
            <span className={`badge ${unreadCount ? "bg-danger" : "bg-secondary"}`}>
              {unreadCount}
            </span>
          </div>
        </div>

        <div className="d-flex gap-2 flex-wrap">
          <button className="btn btn-outline-dark" onClick={fetchNotifications}>
            Refresh
          </button>

          <button
            className="btn btn-outline-primary"
            onClick={markAllRead}
            disabled={notifications.length === 0 || unreadCount === 0}
          >
            Mark All Read
          </button>

          <button
            className="btn btn-outline-danger"
            onClick={clearAll}
            disabled={notifications.length === 0}
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Controls row like AllOrders */}
      <div className="d-flex justify-content-between mb-3 flex-wrap gap-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by title or message..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            maxWidth: 420,
            height: "42px",
            padding: "0 12px",
            borderRadius: "8px",
            border: "1px solid #dee2e6",
            outline: "none",
            fontSize: "16px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          }}
        />

        <select
          className="form-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ maxWidth: 220, height: "42px" }}
        >
          <option value="all">All</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </select>
      </div>

      {filteredNotifications.length === 0 ? (
        <div className="alert alert-light border text-center">
          No notifications ✅
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover text-center align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Type</th>
                <th>Title</th>
                <th>Message</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredNotifications.map((n, idx) => (
                <tr
                  key={n._id}
                  className={!n.isRead ? "notif-unread-row" : ""}
                  style={{ transition: "0.2s" }}
                >
                  <td>{idx + 1}</td>

                  <td>{getTypeBadge(n)}</td>

                  <td style={{ fontWeight: 700 }}>{n.title}</td>

                  <td style={{ textAlign: "left" }}>
                    <div style={{ maxWidth: 520, margin: "0 auto" }}>
                      {n.message}
                    </div>
                  </td>

                  <td>
                    {n.createdAt
                      ? new Date(n.createdAt).toLocaleString()
                      : "N/A"}
                  </td>

                  <td>
                    {n.isRead ? (
                      <span className="badge bg-success">Read</span>
                    ) : (
                      <span className="badge bg-warning text-dark">Unread</span>
                    )}
                  </td>

                  <td>
                    {!n.isRead ? (
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => markAsRead(n._id)}
                      >
                        Mark Read
                      </button>
                    ) : (
                      <button className="btn btn-sm btn-secondary" disabled>
                        Done
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Extra styling like AllOrders */}
          <style>{`
            .notif-unread-row {
              background: rgba(255, 193, 7, 0.10) !important;
            }
            .notif-unread-row:hover {
              background: rgba(255, 193, 7, 0.18) !important;
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;