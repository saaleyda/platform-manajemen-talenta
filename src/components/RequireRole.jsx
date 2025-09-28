import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireRole({ allow = [] }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (allow.length > 0 && !allow.includes(user.role)) {
    // kalau role tidak diizinkan -> lempar ke dashboard
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}
