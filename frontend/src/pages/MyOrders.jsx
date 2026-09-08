import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import Navbar from "../components/Navbar";
import "../styles/myorders.css";

const statusColors = {
  "Order Placed": "#8b93a8",
  Confirmed: "#6c63ff",
  Processing: "#e8b04d",
  Shipped: "#e8b04d",
  "Out for Delivery": "#e8b04d",
  Delivered: "#34d399",
  Cancelled: "#f87171",
};

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get("/orders/my-orders");
        setOrders(res.data);
      } catch (err) {
        // ignore, show empty state
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="page-shell">
      <Navbar />

      <div className="orders-container">
        <h1>My Orders</h1>

        {loading && <p className="orders-status">Loading orders...</p>}

        {!loading && orders.length === 0 && (
          <div className="orders-empty">
            <p>You haven't placed any orders yet.</p>
            <button onClick={() => navigate("/products")}>Browse products</button>
          </div>
        )}

        <div className="orders-list">
          {orders.map((order) => (
            <div
              className="order-card"
              key={order._id}
              onClick={() => navigate(`/orders/${order._id}`)}
            >
              <div className="order-card-top">
                <div>
                  <span className="order-id">Order #{order._id.slice(-8)}</span>
                  <span className="order-date">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <span
                  className="order-status-badge"
                  style={{
                    color: statusColors[order.orderStatus] || "#8b93a8",
                    borderColor: statusColors[order.orderStatus] || "#8b93a8",
                  }}
                >
                  {order.orderStatus}
                </span>
              </div>

              <div className="order-card-items">
                {order.items.map((item, i) => (
                  <span key={i}>
                    {item.name} × {item.quantity}
                    {i < order.items.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>

              <div className="order-card-bottom">
                <span className={`payment-badge payment-${order.paymentStatus.toLowerCase()}`}>
                  {order.paymentStatus}
                </span>
                <strong>₹{order.totalAmount}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyOrders;