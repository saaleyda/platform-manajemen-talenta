import { Navigate, Route, Routes } from "react-router-dom";
import AddEmployee from "./components/AddEmployee";
import Attendance from "./components/Attendance";
import Dashboard from "./components/Dashboard";
import EmployeeDetail from "./components/EmployeeDetail";
import EmployeeList from "./components/EmployeeList";
import Leave from "./components/Leave";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Payroll from "./components/Payroll";
import Performance from "./components/Performance";
import ProtectedRoute from "./components/ProtectedRoute";
import RequireRole from "./components/RequireRole";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { user } = useAuth();

  return (
    <div className="app">
      {user && <Navbar />}
      <div className="container">
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/dashboard" /> : <Login />}
          />

          {/* semua halaman di bawah ini butuh login */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Data Karyawan: Admin & HR */}
            <Route element={<RequireRole allow={["Admin", "HR"]} />}>
              <Route path="/employees" element={<EmployeeList />} />
              <Route path="/employee/:id" element={<EmployeeDetail />} />
              <Route path="/add-employee" element={<AddEmployee />} />
            </Route>

            {/* Absensi: Admin, HR, Karyawan (semua boleh akses) */}
            <Route path="/attendance" element={<Attendance />} />

            {/* Payroll: Admin & HR */}
            <Route element={<RequireRole allow={["Admin", "HR"]} />}>
              <Route path="/payroll" element={<Payroll />} />
            </Route>

            {/* Cuti: semua boleh akses (approve hanya Admin/HR di halaman) */}
            <Route path="/leave" element={<Leave />} />

            {/* Performance/Talenta: Admin & HR */}
            <Route element={<RequireRole allow={["Admin", "HR"]} />}>
              <Route path="/performance" element={<Performance />} />
            </Route>
          </Route>

          <Route
            path="*"
            element={<Navigate to={user ? "/dashboard" : "/"} />}
          />
        </Routes>
      </div>
    </div>
  );
}
