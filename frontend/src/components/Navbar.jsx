import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../features/authSlice";

export default function Navbar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/">🏠 Home</Link>
        <Link to="/cart">🛒 Cart ({cartItems.length})</Link>
        {isAuthenticated ? (
          <>
            {user?.role === "ADMIN" && <Link to="/admin">🔧 Admin</Link>}
            <Link to="/profile">👤 Profile</Link>
            <Link to="/my-orders">📦 My Orders</Link>
          </>
        ) : null}
      </div>

      <div className="nav-right">
        {isAuthenticated ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}
