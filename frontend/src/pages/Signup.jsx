import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../features/authSlice";
import "./Auth.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const [adminKey, setAdminKey] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  const handleSignup = (e) => {
    e.preventDefault();
    dispatch(
      signupUser({
        username: name,
        email,
        password,
        confirmPassword,
        address: address || null,
        postalCode: postalCode || null,
        role,
        adminKey: role === "ADMIN" ? adminKey : undefined,
      })
    );
  };

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSignup}>
        <h2>Create Account</h2>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
        />

        <input
          placeholder="Address (optional)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <input
          placeholder="Postal Code (optional)"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
        />

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", color: "#555" }}>
          
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "14px",
            }}
          >
            <option value="USER">User</option>
           
          </select>
        </div>

        {/* {role === "ADMIN" && (
          <input
            type="password"
            placeholder="Admin key (required for store owner)"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            required={role === "ADMIN"}
          />
        )} */}

        {error ? (
          <div style={{ color: "#b00020", marginBottom: "12px" }}>{error}</div>
        ) : null}

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Signup"}
        </button>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
}
