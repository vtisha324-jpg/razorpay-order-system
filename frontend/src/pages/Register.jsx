import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import "../styles/login.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      setError("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      await API.post("/auth/register", form);

      const loginRes = await API.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("token", loginRes.data.token);
      localStorage.setItem("user", JSON.stringify(loginRes.data.user));

      navigate("/products");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Try again."
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
        <section className="login-showcase">
          <div className="brand">
            <div className="brand-icon">P</div>
            <div>
              <span className="brand-name">PayFlow</span>
              <span className="brand-subtitle">PAYMENT MANAGEMENT</span>
            </div>
          </div>

          <div className="showcase-content">
            <div className="eyebrow">
              <span></span>
              JOIN PAYFLOW TODAY
            </div>

            <h1>
              Start shopping,
              <br />
              <span>pay securely.</span>
            </h1>

            <p>
              Create your account to browse products, checkout with
              Razorpay, and track every order in one place.
            </p>

            <div className="feature-grid">
              <div className="feature-card">
                <div className="feature-icon">₹</div>
                <div>
                  <strong>Secure Payments</strong>
                  <small>Razorpay powered checkout</small>
                </div>
              </div>

              <div className="feature-card">
                <div className="feature-icon">+</div>
                <div>
                  <strong>Order Management</strong>
                  <small>Track every order easily</small>
                </div>
              </div>

              <div className="feature-card">
                <div className="feature-icon">↗</div>
                <div>
                  <strong>Real-time Tracking</strong>
                  <small>Stay updated instantly</small>
                </div>
              </div>

              <div className="feature-card">
                <div className="feature-icon">✓</div>
                <div>
                  <strong>Trusted & Reliable</strong>
                  <small>Enterprise-ready security</small>
                </div>
              </div>
            </div>
          </div>

          <div className="showcase-footer">
            <span>●</span>
            Your payments. Your orders. One platform.
          </div>
        </section>

        <section className="login-panel">
          <div className="login-card">
            <div className="mobile-brand">
              <div className="brand-icon">P</div>
              <span>PayFlow</span>
            </div>

            <div className="login-heading">
              <span className="login-label">CREATE ACCOUNT</span>
              <h2>Sign up for PayFlow</h2>
              <p>Enter your details to get started.</p>
            </div>

            {error && (
              <div className="error-box">
                <span>!</span>
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="name">Full name</label>
                <div className="input-wrapper">
                  <div className="input-icon">•</div>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Your name"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="email">Email address</label>
                <div className="input-wrapper">
                  <div className="input-icon">@</div>
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
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <div className="input-icon">*</div>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Create a password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <button className="login-button" type="submit" disabled={loading}>
                <span>{loading ? "Creating account..." : "Create account"}</span>
                {!loading && <span className="button-arrow">→</span>}
              </button>
            </form>

            <div className="secure-note">
              <span className="secure-icon">✓</span>
              <div>
                <strong>Secure access</strong>
                <span>Your information is encrypted and protected.</span>
              </div>
            </div>

            <div className="login-bottom">
              <span>
                Already have an account? <Link to="/login" style={{ color: "#6c63ff" }}>Sign in</Link>
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Register;