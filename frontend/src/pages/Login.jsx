import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/auth/login", form);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      navigate("/products");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="orb orb-one"></div>
        <div className="orb orb-two"></div>
        <div className="orb orb-three"></div>
      </div>

      <div className="login-container">

        {/* LEFT SIDE */}
        <section className="login-showcase">

          <div className="brand">
            <div className="brand-icon">P</div>

            <div>
              <span className="brand-name">PayFlow</span>
              <span className="brand-subtitle">
                PAYMENT MANAGEMENT
              </span>
            </div>
          </div>

          <div className="showcase-content">
            <div className="eyebrow">
              <span></span>
              SMART PAYMENT OPERATIONS
            </div>

            <h1>
              Payments,
              <br />
              <span>simplified.</span>
            </h1>

            <p>
              Manage orders, payments and customers from one
              powerful dashboard built for modern businesses.
            </p>

            <div className="feature-grid">

              <div className="feature-card">
                <div className="feature-icon">₹</div>

                <div>
                  <strong>Secure Payments</strong>
                  <small>
                    Razorpay powered checkout
                  </small>
                </div>
              </div>

              <div className="feature-card">
                <div className="feature-icon">+</div>

                <div>
                  <strong>Order Management</strong>
                  <small>
                    Track every order easily
                  </small>
                </div>
              </div>

              <div className="feature-card">
                <div className="feature-icon">↗</div>

                <div>
                  <strong>Real-time Tracking</strong>
                  <small>
                    Stay updated instantly
                  </small>
                </div>
              </div>

              <div className="feature-card">
                <div className="feature-icon">✓</div>

                <div>
                  <strong>Trusted & Reliable</strong>
                  <small>
                    Enterprise-ready security
                  </small>
                </div>
              </div>

            </div>
          </div>

          <div className="showcase-footer">
            <span>●</span>
            Your payments. Your orders. One platform.
          </div>

        </section>

        {/* RIGHT SIDE */}
        <section className="login-panel">

          <div className="login-card">

            <div className="mobile-brand">
              <div className="brand-icon">P</div>
              <span>PayFlow</span>
            </div>

            <div className="login-heading">
              <span className="login-label">
                WELCOME BACK
              </span>

              <h2>Sign in to PayFlow</h2>

              <p>
                Enter your credentials to access your dashboard.
              </p>
            </div>

            {error && (
              <div className="error-box">
                <span>!</span>
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="input-group">

                <label htmlFor="email">
                  Email address
                </label>

                <div className="input-wrapper">

                  <div className="input-icon">
                    @
                  </div>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />

                </div>
              </div>

              <div className="input-group">

                <div className="password-label">
                  <label htmlFor="password">
                    Password
                  </label>

                  <button
                    type="button"
                    className="forgot-button"
                    onClick={() =>
                      setError(
                        "Please contact the administrator to reset your password."
                      )
                    }
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="input-wrapper">

                  <div className="input-icon">
                    *
                  </div>

                  <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                  />

                </div>

              </div>

              <button
                className="login-button"
                type="submit"
                disabled={loading}
              >
                <span>
                  {loading ? "Signing in..." : "Sign in"}
                </span>

                {!loading && (
                  <span className="button-arrow">
                    →
                  </span>
                )}
              </button>

            </form>

            <div className="secure-note">
              <span className="secure-icon">✓</span>

              <div>
                <strong>Secure access</strong>
                <span>
                  Your information is encrypted and protected.
                </span>
              </div>
            </div>

            <div className="login-bottom">
              <span>
                New here? <Link to="/register" style={{ color: "#6c63ff", fontWeight: 600 }}>Create account</Link>
              </span>
            </div>

          </div>

        </section>

      </div>
    </div>
  );
}

export default Login;
