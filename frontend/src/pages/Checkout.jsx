import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import "../styles/checkout.css";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function Checkout() {
  const { cart, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [status, setStatus] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (cart.length === 0) {
      navigate("/cart");
    }
  }, [cart, navigate]);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const isAddressValid = () =>
    address.fullName && address.phone && address.street && address.city &&
    address.state && address.pincode;

  const handlePay = async () => {
    setErrorMsg("");

    if (!isAddressValid()) {
      setErrorMsg("Please fill all delivery details.");
      return;
    }

    setStatus("processing");

    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      setErrorMsg("Could not load Razorpay. Check your internet connection.");
      setStatus("error");
      return;
    }

    try {
      const items = cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      const { data } = await API.post("/payment/create-order", {
        items,
        deliveryAddress: address,
      });

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "PayFlow",
        description: "Order Payment",
        order_id: data.razorpayOrderId,

        handler: async function (response) {
          try {
            await API.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            clearCart();
            navigate(`/orders/${data.orderId}`);
          } catch (verifyErr) {
            setErrorMsg(
              "Payment was received but could not be verified. Please contact support."
            );
            setStatus("error");
          }
        },

        modal: {
          ondismiss: async function () {
            try {
              await API.post("/payment/cancel", {
                razorpayOrderId: data.razorpayOrderId,
              });
            } catch (e) {
              // ignore
            }
            setStatus("");
            setErrorMsg("Payment was cancelled.");
          },
        },

        prefill: {
          name: address.fullName,
          contact: address.phone,
        },

        theme: {
          color: "#6c63ff",
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function () {
        setErrorMsg("Payment failed. Please try again.");
        setStatus("error");
      });

      rzp.open();
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || "Could not start payment. Try again."
      );
      setStatus("error");
    }
  };

  return (
    <div className="page-shell">
      <Navbar />

      <div className="checkout-container">
        <h1>Checkout</h1>

        <div className="checkout-grid">
          <div className="checkout-form">
            <h2>Delivery Address</h2>

            {errorMsg && <div className="checkout-error">{errorMsg}</div>}

            <div className="checkout-field-row">
              <div className="checkout-field">
                <label>Full name</label>
                <input
                  name="fullName"
                  value={address.fullName}
                  onChange={handleChange}
                  placeholder="Your name"
                />
              </div>

              <div className="checkout-field">
                <label>Phone</label>
                <input
                  name="phone"
                  value={address.phone}
                  onChange={handleChange}
                  placeholder="10-digit number"
                />
              </div>
            </div>

            <div className="checkout-field">
              <label>Street address</label>
              <input
                name="street"
                value={address.street}
                onChange={handleChange}
                placeholder="House no, street, area"
              />
            </div>

            <div className="checkout-field-row">
              <div className="checkout-field">
                <label>City</label>
                <input
                  name="city"
                  value={address.city}
                  onChange={handleChange}
                  placeholder="City"
                />
              </div>

              <div className="checkout-field">
                <label>State</label>
                <input
                  name="state"
                  value={address.state}
                  onChange={handleChange}
                  placeholder="State"
                />
              </div>

              <div className="checkout-field">
                <label>Pincode</label>
                <input
                  name="pincode"
                  value={address.pincode}
                  onChange={handleChange}
                  placeholder="Pincode"
                />
              </div>
            </div>
          </div>

          <div className="checkout-summary">
            <h2>Order Summary</h2>

            {cart.map((item) => (
              <div className="checkout-summary-item" key={item.productId}>
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}

            <div className="checkout-summary-total">
              <span>Total</span>
              <strong>₹{totalAmount}</strong>
            </div>

            <button
              className="checkout-pay-btn"
              onClick={handlePay}
              disabled={status === "processing"}
            >
              {status === "processing"
                ? "Opening Razorpay..."
                : `Pay ₹${totalAmount} with Razorpay`}
            </button>

            <p className="checkout-secure-text">
              🔒 Payments are securely processed by Razorpay.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;