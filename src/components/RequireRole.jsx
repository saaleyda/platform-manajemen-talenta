import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireRole({ allow = [] }) {
  const { user } = useAuth();

  // Jika user belum login, arahkan ke halaman login
  if (!user) return <Navigate to="/" replace />;

  // Jika user role tidak termasuk dalam daftar role yang diizinkan (allow), arahkan ke dashboard
  if (allow.length > 0 && !allow.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Jika role valid, lanjutkan ke halaman yang diinginkan
  return <Outlet />;
}
