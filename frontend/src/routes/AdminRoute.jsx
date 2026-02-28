import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

/**
 * Protects /admin: only users with role ADMIN can access.
 */
export default function AdminRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }
  return children;
}
