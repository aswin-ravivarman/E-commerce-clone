import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterBrand, setFilterBrand] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        const productsData = res.data;
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products]; // Create a copy to avoid mutation

    if (filterCategory) {
      filtered = filtered.filter(p => p.category === filterCategory);
    }

    if (filterBrand) {
      filtered = filtered.filter(p => p.brand === filterBrand);
    }

    setFilteredProducts(filtered);
  }, [filterCategory, filterBrand, products]);

  // Get unique categories and brands for filter dropdowns
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];

  if (loading) return <p style={{ padding: "2rem" }}>Loading products...</p>;

  return (
    <div>
      {/* Filter Section */}
      <div className="filter-section" style={{ 
        maxWidth: "1200px", 
        margin: "20px auto", 
        padding: "20px",
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <h3 style={{ marginBottom: "15px", fontSize: "20px" }}>Filter Products</h3>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
              Category:
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{ 
                width: "100%", 
                padding: "10px", 
                borderRadius: "6px", 
                border: "1px solid #dee2e6",
                fontSize: "14px"
              }}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
              Brand:
            </label>
            <select
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
              style={{ 
                width: "100%", 
                padding: "10px", 
                borderRadius: "6px", 
                border: "1px solid #dee2e6",
                fontSize: "14px"
              }}
            >
              <option value="">All Brands</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <button
              onClick={() => {
                setFilterCategory("");
                setFilterBrand("");
              }}
              className="btn-outline"
              style={{ padding: "10px 20px" }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <p style={{ padding: "2rem", textAlign: "center", gridColumn: "1 / -1" }}>
            No products found matching your filters.
          </p>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
}
