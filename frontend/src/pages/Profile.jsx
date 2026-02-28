import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../api/axiosConfig";

const fieldStyle = {
  padding: "15px",
  background: "#f8f9fa",
  borderRadius: "8px",
  borderLeft: "4px solid #0d6efd",
};
const labelStyle = {
  display: "block",
  fontSize: "12px",
  color: "#666",
  marginBottom: "5px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};
const valueStyle = { margin: 0, fontSize: "18px", fontWeight: "500", color: "#333" };

export default function Profile() {
  const { user: reduxUser } = useSelector((state) => state.auth);
  const [user, setUser] = useState(reduxUser);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setUser(reduxUser);
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(reduxUser))
      .finally(() => setLoading(false));
  }, [reduxUser]);

  if (!reduxUser && !user) {
    return <p style={{ padding: "2rem" }}>Please login to view your profile.</p>;
  }

  if (loading && !user) {
    return <p style={{ padding: "2rem" }}>Loading profile...</p>;
  }

  const profileUser = user || reduxUser;

  return (
    <div
      className="profile-container"
      style={{
        maxWidth: "700px",
        margin: "40px auto",
        padding: "30px",
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
      }}
    >
      <h2
        style={{
          marginBottom: "30px",
          fontSize: "28px",
          color: "#333",
          borderBottom: "2px solid #0d6efd",
          paddingBottom: "10px",
        }}
      >
        My Profile
      </h2>

      {error && (
        <div style={{ color: "#b00020", marginBottom: "12px" }}>{error}</div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div className="profile-field" style={fieldStyle}>
          <label style={labelStyle}>Username</label>
          <p style={valueStyle}>{profileUser.username || "N/A"}</p>
        </div>

        <div className="profile-field" style={fieldStyle}>
          <label style={labelStyle}>Email</label>
          <p style={valueStyle}>{profileUser.email || "N/A"}</p>
        </div>

        <div className="profile-field" style={fieldStyle}>
          <label style={labelStyle}>Role</label>
          <p style={valueStyle}>
            {profileUser.role === "ADMIN" ? "Store Owner (Admin)" : "Customer"}
          </p>
        </div>

        <div className="profile-field" style={fieldStyle}>
          <label style={labelStyle}>Address</label>
          <p style={valueStyle}>{profileUser.address || "Not provided"}</p>
        </div>

        <div className="profile-field" style={fieldStyle}>
          <label style={labelStyle}>Postal Code</label>
          <p style={valueStyle}>{profileUser.postalCode || "Not provided"}</p>
        </div>
      </div>
    </div>
  );
}
