import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosConfig";
import "./AdminDashboard.css";

const defaultProduct = {
  title: "",
  price: 0,
  oldPrice: null,
  discountedPrice: null,
  description: "",
  imageUrl: "",
  category: "",
  type: "",
  stock: 0,
  rating: null,
  brand: "",
  isNew: false,
  size: [],
};

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("products");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...defaultProduct });

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/admin/products");
      setProducts(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "products") {
      fetchProducts();
    } else if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab]);

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...defaultProduct });
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({
      title: p.title || "",
      price: p.price ?? 0,
      oldPrice: p.oldPrice ?? null,
      discountedPrice: p.discountedPrice ?? null,
      description: p.description || "",
      imageUrl: p.imageUrl || "",
      category: p.category || "",
      type: p.type || "",
      stock: p.stock ?? 0,
      rating: p.rating ?? null,
      brand: p.brand || "",
      isNew: p.isNew ?? false,
      size: Array.isArray(p.size) ? p.size : [],
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setForm({ ...defaultProduct });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      ...form,
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      discountedPrice: form.discountedPrice ? Number(form.discountedPrice) : null,
      price: Number(form.price) || 0,
      stock: Number(form.stock) || 0,
      rating: form.rating ? Number(form.rating) : null,
    };
    try {
      if (editingId) {
        await api.put(`/admin/products/${editingId}`, payload);
      } else {
        await api.post("/admin/products", payload);
      }
      closeModal();
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Save failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    setError("");
    try {
      await api.delete(`/admin/products/${id}`);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Delete failed");
    }
  };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <Link to="/" className="admin-logo">E-Store Admin</Link>
        </div>
        <nav className="admin-nav">
          <button
            className={`admin-nav-item ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            📦 Products
          </button>
          <button
            className={`admin-nav-item ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            👥 Users
          </button>
        </nav>
        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-back-link">← Back to Store</Link>
        </div>
      </aside>

      <main className="admin-main">
        {activeTab === "products" ? (
          <>
            <header className="admin-main-header">
              <h1>Products</h1>
              <button type="button" className="admin-btn primary" onClick={openAdd}>
                + Add Product
              </button>
            </header>

            {error && <div className="admin-error" role="alert">{error}</div>}

            {loading ? (
              <p className="admin-loading">Loading products...</p>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Category</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length === 0 ? (
                      <tr><td colSpan={6}>No products yet. Add one.</td></tr>
                    ) : (
                      products.map((p) => (
                        <tr key={p.id}>
                          <td>{p.imageUrl ? <img src={p.imageUrl} alt="" className="admin-thumb" /> : "—"}</td>
                          <td>{p.title}</td>
                          <td>₹{p.price}</td>
                          <td>{p.stock}</td>
                          <td>{p.category || "—"}</td>
                          <td>
                            <button className="admin-btn small" onClick={() => openEdit(p)}>Edit</button>
                            <button className="admin-btn small danger" onClick={() => handleDelete(p.id)}>Delete</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          <>
            <header className="admin-main-header">
              <h1>Users</h1>
              {/* Add User functionality can be added here if needed */}
            </header>

            {error && <div className="admin-error" role="alert">{error}</div>}

            {loading ? (
              <p className="admin-loading">Loading users...</p>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr><td colSpan={5}>No users found.</td></tr>
                    ) : (
                      users.map((u) => (
                        <tr key={u.id}>
                          <td>{u.id}</td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#e9ecef", display: "flex", alignItems: "center", justifyContent: "center" }}>👤</div>
                              {u.username}
                            </div>
                          </td>
                          <td>{u.email}</td>
                          <td>
                            <span style={{
                              padding: "4px 8px",
                              borderRadius: "12px",
                              background: u.role === "ADMIN" ? "#cfe2ff" : "#e2e3e5",
                              color: u.role === "ADMIN" ? "#0a58ca" : "#495057",
                              fontSize: "12px",
                              fontWeight: "bold"
                            }}>
                              {u.role}
                            </span>
                          </td>
                          <td>{u.address || "—"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>

      {modalOpen && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingId ? "Edit Product" : "Add Product"}</h2>
              <button type="button" className="admin-modal-close" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form-row">
                <label>Title</label>
                <input name="title" value={form.title} onChange={handleChange} required />
              </div>
              <div className="admin-form-row two">
                <div>
                  <label>Price</label>
                  <input type="number" step="0.01" name="price" value={form.price} onChange={handleChange} required />
                </div>
                <div>
                  <label>Old Price</label>
                  <input type="number" step="0.01" name="oldPrice" value={form.oldPrice ?? ""} onChange={handleChange} />
                </div>
              </div>
              <div className="admin-form-row two">
                <div>
                  <label>Discounted Price</label>
                  <input type="number" step="0.01" name="discountedPrice" value={form.discountedPrice ?? ""} onChange={handleChange} />
                </div>
                <div>
                  <label>Stock</label>
                  <input type="number" name="stock" value={form.stock} onChange={handleChange} />
                </div>
              </div>
              <div className="admin-form-row">
                <label>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
              </div>
              <div className="admin-form-row">
                <label>Image URL</label>
                <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://..." />
              </div>
              <div className="admin-form-row two">
                <div>
                  <label>Category</label>
                  <input name="category" value={form.category} onChange={handleChange} />
                </div>
                <div>
                  <label>Brand</label>
                  <input name="brand" value={form.brand} onChange={handleChange} />
                </div>
              </div>
              <div className="admin-form-row two">
                <div>
                  <label>Type</label>
                  <input name="type" value={form.type} onChange={handleChange} />
                </div>
                <div>
                  <label>Rating (1-5)</label>
                  <input type="number" min="1" max="5" name="rating" value={form.rating ?? ""} onChange={handleChange} />
                </div>
              </div>
              <div className="admin-form-row checkbox-row">
                <label>
                  <input type="checkbox" name="isNew" checked={form.isNew} onChange={handleChange} />
                  New arrival
                </label>
              </div>
              <div className="admin-form-actions">
                <button type="button" className="admin-btn" onClick={closeModal}>Cancel</button>
                <button type="submit" className="admin-btn primary">{editingId ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
