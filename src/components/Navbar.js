import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="brand">
        <span className="dot"></span> HR Platform
      </div>
      <div className="flex">
        <NavLink to="/dashboard">Dashboard</NavLink>

        {hasRole("Admin", "HR") && <NavLink to="/employees">Karyawan</NavLink>}
        <NavLink to="/attendance">Absensi</NavLink>
        {hasRole("Admin", "HR") && <NavLink to="/payroll">Payroll</NavLink>}
        <NavLink to="/leave">Cuti</NavLink>
        {hasRole("Admin", "HR") && <NavLink to="/performance">Talenta</NavLink>}
      </div>
      <div className="flex">
        <small className="muted">
          Hi, {user?.username} ({user?.role})
        </small>
        <button className="btn secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
