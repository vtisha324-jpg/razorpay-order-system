import { useEffect, useState } from "react";
import API from "../api";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import "../styles/products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addedId, setAddedId] = useState(null);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");
        setProducts(res.data);
      } catch (err) {
        setError("Could not load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAdd = (product) => {
    addToCart(product);
    setAddedId(product._id);
    setTimeout(() => setAddedId(null), 1200);
  };

  return (
    <div className="page-shell">
      <Navbar />

      <div className="products-container">
        <div className="products-header">
          <h1>Browse Products</h1>
          <p>Pick what you need, add to cart, and checkout securely.</p>
        </div>

        {loading && <p className="products-status">Loading products...</p>}
        {error && <p className="products-status products-error">{error}</p>}

        {!loading && !error && products.length === 0 && (
          <p className="products-status">
            No products yet. Add some via POST /api/products.
          </p>
        )}

        <div className="products-grid">
          {products.map((product) => (
            <div className="product-card" key={product._id}>
              <div className="product-image">
                {product.image ? (
                  <img src={product.image} alt={product.name} />
                ) : (
                  <div className="product-image-placeholder">
                    {product.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>

                <div className="product-footer">
                  <span className="product-price">₹{product.price}</span>

                  <button
                    className="product-add-btn"
                    onClick={() => handleAdd(product)}
                    disabled={product.stock < 1}
                  >
                    {product.stock < 1
                      ? "Out of stock"
                      : addedId === product._id
                      ? "Added ✓"
                      : "Add to cart"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Products;