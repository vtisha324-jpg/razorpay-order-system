import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import "../styles/Cart.css";

function Cart() {
  const { cart, updateQuantity, removeFromCart, totalAmount } = useCart();
  const navigate = useNavigate();

  return (
    <div className="page-shell">
      <Navbar />

      <div className="cart-container">
        <h1>Your Cart</h1>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <p>Your cart is empty.</p>
            <button className="cart-browse-btn" onClick={() => navigate("/products")}>
              Browse products
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div className="cart-item" key={item.productId}>
                  <div className="cart-item-image">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <div className="cart-item-placeholder">
                        {item.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <span className="cart-item-price">₹{item.price}</span>
                  </div>

                  <div className="cart-item-qty">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  <div className="cart-item-subtotal">
                    ₹{item.price * item.quantity}
                  </div>

                  <button
                    className="cart-item-remove"
                    onClick={() => removeFromCart(item.productId)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="cart-total">
                <span>Total</span>
                <strong>₹{totalAmount}</strong>
              </div>

              <button
                className="cart-checkout-btn"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;