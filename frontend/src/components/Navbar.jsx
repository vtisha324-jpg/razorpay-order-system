import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/products" className="navbar-brand">
        <div className="navbar-brand-icon">P</div>
        <span>PayFlow</span>
      </Link>

      <div className="navbar-links">
        <Link to="/products" className="navbar-link">
          Products
        </Link>

        <Link to="/orders" className="navbar-link">
          My Orders
        </Link>

        <Link to="/cart" className="navbar-cart">
          Cart
          {totalItems > 0 && (
            <span className="navbar-cart-badge">{totalItems}</span>
          )}
        </Link>

        {user && (
          <div className="navbar-user">
            <span className="navbar-user-name">{user.name}</span>
            <button className="navbar-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;