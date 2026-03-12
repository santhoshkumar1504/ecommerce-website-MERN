import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./style.css";

const AdminLayout = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const userRes = await axios.get(
        "http://localhost:5000/api/v1/users/all-users",
        { withCredentials: true }
      );

      const productRes = await axios.get("http://localhost:5000/api/v1/products");

      const categoryRes = await axios.get("http://localhost:5000/api/v1/categorys");

      const orderRes = await axios.get("http://localhost:5000/api/v1/orders/", {
        withCredentials: true,
      });

      const usersData = userRes?.data?.data?.user || [];
      const productsData = productRes?.data?.data?.productDetails || [];
      const categoriesData = categoryRes?.data?.data?.categoryExist || [];
      const ordersData = orderRes?.data?.data?.orders || [];

      setUsers(usersData);
      setProducts(productsData);
      setOrders(ordersData);
      setCategories(categoriesData);

      generateMonthlyAnalytics(ordersData);
    } catch (error) {
      console.log(error);
    }
  };

  const generateMonthlyAnalytics = (ordersList = []) => {
    if (!Array.isArray(ordersList)) return;

    const monthly = {};

    ordersList.forEach((order) => {
      const month = new Date(order.orderDate).toLocaleString("default", {
        month: "short",
      });

      const price =
        order?.productDetail?.discountedPrice ||
        order?.productDetail?.price ||
        0;

      const quantity = order?.orderQuantity || 0;

      if (!monthly[month]) {
        monthly[month] = { month, revenue: 0, orders: 0 };
      }

      monthly[month].revenue += price * quantity;
      monthly[month].orders += 1;
    });

    setMonthlyData(Object.values(monthly));
  };

  const totalRevenue = Array.isArray(orders)
    ? orders.reduce((acc, order) => {
        const price =
          order?.productDetail?.discountedPrice ||
          order?.productDetail?.price ||
          0;

        const quantity = order?.orderQuantity || 0;

        return acc + price * quantity;
      }, 0)
    : 0;

  const topProducts = useMemo(() => {
    return Object.values(
      (orders || []).reduce((acc, o) => {
        const name = o?.productDetail?.productName || "Unknown";
        const qty = Number(o?.orderQuantity || 0);
        if (!acc[name]) acc[name] = { name, qty: 0 };
        acc[name].qty += qty;
        return acc;
      }, {})
    )
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
  }, [orders]);

  const formattedOrders = Array.isArray(orders)
    ? orders.map((order) => ({
        id: order._id,
        productName: order?.productDetail?.productName || "N/A",
        customerName: order?.createdBy?.name || "Guest",
        mobile: order?.createdBy?.phone || "N/A",
        price:
          order?.productDetail?.discountedPrice ||
          order?.productDetail?.price ||
          0,
        quantity: order?.orderQuantity || 0,
        status: order?.status || "N/A",
        date: order?.orderDate,
      }))
    : [];

  // ✅ STATUS CHART DATA (Ordered=primary, Delivered=success, Cancelled=danger)
  const STATUS_COLOR_MAP = {
    Ordered: "#0d6efd", // primary
    "Product delivered": "#198754", // success
    "Order cancelled": "#dc3545", // danger
    Other: "#6c757d", // secondary
  };

  const statusData = useMemo(() => {
    const base = [
      {
        name: "Ordered",
        value: (orders || []).filter((o) => (o.status || "").trim() === "Ordered").length,
      },
      {
        name: "Product delivered",
        value: (orders || []).filter((o) => (o.status || "").trim() === "Product delivered").length,
      },
      {
        name: "Order cancelled",
        value: (orders || []).filter((o) => (o.status || "").trim() === "Order cancelled").length,
      },
    ].filter((x) => x.value > 0);

    const known = ["Ordered", "Product delivered", "Order cancelled"];
    const otherCount = (orders || []).filter(
      (o) => !known.includes((o.status || "").trim())
    ).length;

    if (otherCount > 0) base.push({ name: "Other", value: otherCount });

    return base;
  }, [orders]);

  const totalStatusOrders = useMemo(
    () => statusData.reduce((sum, s) => sum + s.value, 0),
    [statusData]
  );

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Admin Dashboard</h2>

      {/* ===== SUMMARY CARDS ===== */}
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Users</h4>
          <h2>{users.length}</h2>
        </div>

        <div className="stat-card">
          <h4>Total Products</h4>
          <h2>{products.length}</h2>
        </div>

        <div className="stat-card">
          <h4>Total Orders</h4>
          <h2>{orders.length}</h2>
        </div>

        <div className="stat-card revenue-card">
          <h4>Total Revenue</h4>
          <h2>₹ {totalRevenue.toFixed(2)}</h2>
        </div>

        <div className="stat-card">
          <h4>Total Categories</h4>
          <h2>{categories.length}</h2>
        </div>
      </div>

      {/* ===== CHARTS SECTION ===== */}
      <div className="charts-grid">
        {/* Revenue Trend */}
        <div className="chart-card">
          <h5>Revenue Trend</h5>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none" }} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#6366f1"
                fill="url(#revGradient)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="chart-card">
          <h5>Top Products</h5>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="qty" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Orders vs Revenue */}
        <div className="chart-card">
          <h5>Orders vs Revenue</h5>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none" }} />
              <Legend />
              <Bar yAxisId="left" dataKey="orders" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ✅ Donut Chart (Order Status) */}
        <div className="chart-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h5 style={{ margin: 0 }}>Order Status</h5>
            <span style={{ fontSize: 12, color: "#6b7280" }}>
              Total: {totalStatusOrders}
            </span>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={105}
                paddingAngle={3}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {statusData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={STATUS_COLOR_MAP[entry.name] || "#6c757d"}
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{ borderRadius: 12, border: "none" }}
                formatter={(value, name) => [`${value} orders`, name]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ===== RECENT ORDERS TABLE ===== */}
      <div className="recent-orders">
        <h4>Recent Orders</h4>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Customer</th>
              <th>Mobile</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {formattedOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.productName}</td>
                <td>{order.customerName}</td>
                <td>{order.mobile}</td>
                <td>₹{order.price}</td>
                <td>{order.quantity}</td>
                <td>₹{order.price * order.quantity}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Your styles remain same */}
            <style>
        {
          `
                    .dashboard-container {
  padding: 30px;
  background: #f4f6f9;
  min-height: 100vh;
}

.dashboard-title {
  font-weight: 700;
  margin-bottom: 25px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  transition: 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.revenue-card {
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: white;
}

.charts-grid {
  margin-top: 40px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.chart-card {
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(12px);
  padding: 22px;
  border-radius: 18px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  border: 1px solid rgba(0,0,0,0.05);
}

.recent-orders {
  margin-top: 40px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

.recent-orders table {
  width: 100%;
  border-collapse: collapse;
}

.recent-orders th,
.recent-orders td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.status {
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  text-transform: capitalize;
}

.status.pending {
  background: #fef3c7;
  color: #b45309;
}

.status.delivered {
  background: #d1fae5;
  color: #065f46;
}

.status.shipped {
  background: #dbeafe;
  color: #1e40af;
}
  .dashboard-container {
  padding: 30px;
  background: #f4f6f9;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
}

.dashboard-title {
  font-weight: 700;
  margin-bottom: 25px;
  font-size: 28px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  transition: 0.3s;
  min-width: 0;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.revenue-card {
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: white;
}

.charts-grid {
  margin-top: 40px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.chart-card {
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(12px);
  padding: 22px;
  border-radius: 18px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  border: 1px solid rgba(0,0,0,0.05);
  min-width: 0;
  overflow: hidden;
}

.recent-orders {
  margin-top: 40px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  overflow-x: auto;
}

.recent-orders table {
  width: 100%;
  min-width: 700px;
  border-collapse: collapse;
}

.recent-orders th,
.recent-orders td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
  white-space: nowrap;
}

.status {
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  text-transform: capitalize;
}

.status.pending {
  background: #fef3c7;
  color: #b45309;
}

.status.delivered {
  background: #d1fae5;
  color: #065f46;
}

.status.shipped {
  background: #dbeafe;
  color: #1e40af;
}

/* ---------- Tablet ---------- */
@media (max-width: 992px) {
  .dashboard-container {
    padding: 20px;
  }

  .dashboard-title {
    font-size: 24px;
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }

  .chart-card {
    padding: 18px;
  }
}

/* ---------- Mobile ---------- */
@media (max-width: 768px) {
  .dashboard-container {
    padding: 15px;
  }

  .dashboard-title {
    font-size: 22px;
    margin-bottom: 18px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .charts-grid {
    grid-template-columns: 1fr;
    gap: 15px;
    margin-top: 25px;
  }

  .chart-card {
    padding: 15px;
    border-radius: 14px;
  }

  .stat-card {
    padding: 16px;
  }

  .stat-card h4 {
    font-size: 16px;
  }

  .stat-card h2 {
    font-size: 22px;
  }

  .recent-orders {
    padding: 15px;
    margin-top: 25px;
  }

  .recent-orders h4 {
    font-size: 18px;
    margin-bottom: 12px;
  }
}

/* ---------- Small Mobile ---------- */
@media (max-width: 480px) {
  .dashboard-container {
    padding: 12px;
  }

  .dashboard-title {
    font-size: 20px;
  }

  .chart-card {
    padding: 12px;
  }

  .stat-card {
    padding: 14px;
  }

  .stat-card h4 {
    font-size: 14px;
  }

  .stat-card h2 {
    font-size: 20px;
  }

  .recent-orders th,
  .recent-orders td {
    padding: 10px;
    font-size: 13px;
  }
}
  `
        }
      </style>
    </div>
  );
};

export default AdminLayout;