import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import Navbar from "../components/Navbar";
import "../styles/orderdetail.css";

const STEPS = [
  "Order Placed",
  "Confirmed",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await API.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        setError("Order not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="page-shell">
        <Navbar />
        <p className="orders-status" style={{ padding: "40px" }}>
          Loading order...
        </p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="page-shell">
        <Navbar />
        <div className="order-detail-container">
          <p className="orders-status">{error}</p>
          <button onClick={() => navigate("/orders")}>Back to My Orders</button>
        </div>
      </div>
    );
  }

  const isCancelled = order.orderStatus === "Cancelled";
  const currentIndex = STEPS.indexOf(order.orderStatus);

  return (
    <div className="page-shell">
      <Navbar />

      <div className="order-detail-container">
        <button className="order-back-link" onClick={() => navigate("/orders")}>
          ← Back to My Orders
        </button>

        <div className="order-detail-header">
          <div>
            <h1>Order #{order._id.slice(-8)}</h1>
            <p>
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <span className={`payment-badge payment-${order.paymentStatus.toLowerCase()}`}>
            {order.paymentStatus}
          </span>
        </div>

        {isCancelled ? (
          <div className="order-cancelled-banner">This order was cancelled.</div>
        ) : (
          <div className="tracking-timeline">
            {STEPS.map((step, i) => (
              <div
                className={`tracking-step ${i <= currentIndex ? "reached" : ""} ${
                  i === currentIndex ? "current" : ""
                }`}
                key={step}
              >
                <div className="tracking-dot" />
                <span className="tracking-label">{step}</span>
                {i < STEPS.length - 1 && <div className="tracking-line" />}
              </div>
            ))}
          </div>
        )}

        <div className="order-detail-section">
          <h2>Items</h2>

          {order.items.map((item, i) => (
            <div className="order-detail-item" key={i}>
              <span>{item.name}</span>
              <span>× {item.quantity}</span>
              <strong>₹{item.price * item.quantity}</strong>
            </div>
          ))}

          <div className="order-detail-total">
            <span>Total</span>
            <strong>₹{order.totalAmount}</strong>
          </div>
        </div>

        {order.deliveryAddress && (
          <div className="order-detail-section">
            <h2>Delivery Address</h2>
            <p className="order-address">
              {order.deliveryAddress.fullName}, {order.deliveryAddress.street},{" "}
              {order.deliveryAddress.city}, {order.deliveryAddress.state} -{" "}
              {order.deliveryAddress.pincode}
              <br />
              Phone: {order.deliveryAddress.phone}
            </p>
          </div>
        )}

        {order.trackingHistory && order.trackingHistory.length > 0 && (
          <div className="order-detail-section">
            <h2>Tracking History</h2>

            {order.trackingHistory.map((entry, i) => (
              <div className="history-entry" key={i}>
                <span className="history-status">{entry.status}</span>
                <span className="history-message">{entry.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderDetail;