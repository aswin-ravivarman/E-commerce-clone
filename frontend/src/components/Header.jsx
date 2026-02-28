import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="simple-header" style={{
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      padding: "20px 0",
      textAlign: "center",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
    }}>
      <Link to="/" style={{ textDecoration: "none", color: "white" }}>
        <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "bold" }}>
          E-Commerce Store
        </h1>
        <p style={{ margin: "5px 0 0 0", fontSize: "14px", opacity: 0.9 }}>
          Shop the latest trends
        </p>
      </Link>
    </header>
  );
}
