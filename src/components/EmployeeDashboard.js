import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import * as api from "../services/api";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalHadir: 0,
    totalCuti: 0,
    sisaCuti: 12, // Asumsi jatah cuti per tahun
    cutiDigunakan: 0,
    pendingApproval: 0,
    recentAttendance: [],
    recentLeave: [],
    upcomingLeave: [],
    totalKaryawan: 0,
    pendingLeaveApproval: 0,
    pendingAttendanceApproval: 0,
  });

  const loggedInEmployeeId = user.employee_id || user.username;
  const isAdmin = user.role === "Admin";
  const isHR = user.role === "HR";
  const isEmployee = user.role === "Karyawan";

  useEffect(() => {
    calculateStats();
  }, []);

  const calculateStats = () => {
    // Ambil data absensi dan cuti
    const allAttendance = api.attendance.findAll();
    const allLeave = api.leave.findAll();

    // Filter data untuk user yang login (kecuali Admin/HR yang bisa lihat semua)
    const myAttendance = allAttendance.filter(
      (a) => a.employee_id === loggedInEmployeeId
    );
    const myLeave = allLeave.filter(
      (l) => l.employee_id === loggedInEmployeeId
    );

    // Hitung statistik absensi
    const totalHadir = myAttendance.filter((a) => a.status === "hadir").length;

    // Hitung statistik cuti
    const approvedLeave = myLeave.filter(
      (l) => l.status === "approved" && l.jenis_pengajuan === "Cuti"
    );
    const cutiDigunakan = approvedLeave.length;
    const sisaCuti = 12 - cutiDigunakan;

    // Pending approval (absensi WFH/Hybrid + cuti pending)
    const pendingAttendance = myAttendance.filter(
      (a) =>
        a.status_approval === "pending" &&
        (a.tipe_kerja === "WFH" || a.tipe_kerja === "Hybrid")
    ).length;
    const pendingLeave = myLeave.filter((l) => l.status === "pending").length;
    const pendingApproval = pendingAttendance + pendingLeave;

    // Recent attendance (5 terakhir)
    const recentAttendance = myAttendance
      .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
      .slice(0, 5);

    // Recent leave (5 terakhir)
    const recentLeave = myLeave
      .sort(
        (a, b) => new Date(b.tanggal_pengajuan) - new Date(a.tanggal_pengajuan)
      )
      .slice(0, 5);

    // Upcoming leave (cuti yang akan datang, status approved)
    const today = new Date();
    const upcomingLeave = myLeave
      .filter(
        (l) => l.status === "approved" && new Date(l.tanggal_mulai) >= today
      )
      .sort((a, b) => new Date(a.tanggal_mulai) - new Date(b.tanggal_mulai))
      .slice(0, 3);

    // Update state
    setStats({
      totalHadir,
      totalCuti: myLeave.length,
      sisaCuti,
      cutiDigunakan,
      pendingApproval,
      recentAttendance,
      recentLeave,
      upcomingLeave,
    });
  };

  // Fungsi untuk mendapatkan greeting berdasarkan waktu
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  // Fungsi untuk format tanggal
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  return (
    <div>
      {/* Header Welcome */}
      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          marginBottom: "2rem",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "28px" }}>
          {getGreeting()}, {user.nama_lengkap || user.username}! 👋
        </h2>
        <p style={{ margin: "0.5rem 0 0 0", opacity: 0.9 }}>
          {isAdmin
            ? "Anda login sebagai Admin - Kelola sistem HR dengan bijak"
            : isHR
            ? "Anda login sebagai HR - Kelola karyawan dan approval"
            : "Selamat datang di dashboard Anda"}
        </p>
      </div>

      {/* Statistik Cards - Hanya untuk Karyawan dan HR */}
      {!isAdmin && (
        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          {/* Card Total Kehadiran */}
          <div
            className="card"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "48px", fontWeight: "bold" }}>
              {stats.totalHadir}
            </div>
            <div style={{ opacity: 0.9 }}>Total Kehadiran</div>
          </div>

          {/* Card Sisa Cuti */}
          <div
            className="card"
            style={{
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "48px", fontWeight: "bold" }}>
              {stats.sisaCuti}
            </div>
            <div style={{ opacity: 0.9 }}>
              Sisa Cuti ({stats.cutiDigunakan} digunakan)
            </div>
          </div>

          {/* Card Pending Approval */}
          <div
            className="card"
            style={{
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "48px", fontWeight: "bold" }}>
              {stats.pendingApproval}
            </div>
            <div style={{ opacity: 0.9 }}>Menunggu Approval</div>
          </div>

          {/* Card Total Pengajuan */}
          <div
            className="card"
            style={{
              background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
              color: "white",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "48px", fontWeight: "bold" }}>
              {stats.totalCuti}
            </div>
            <div style={{ opacity: 0.9 }}>Total Pengajuan Cuti</div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card" style={{ marginBottom: "2rem" }}>
        <h3 style={{ marginTop: 0 }}>⚡ Quick Actions</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          {!isAdmin && (
            <>
              <button
                className="btn"
                onClick={() => (window.location.href = "/attendance")}
                style={{
                  padding: "1rem",
                  background: "#667eea",
                  color: "white",
                  border: "none",
                  fontSize: "16px",
                }}
              >
                📝 Catat Absensi
              </button>
              <button
                className="btn"
                onClick={() => (window.location.href = "/leave")}
                style={{
                  padding: "1rem",
                  background: "#f5576c",
                  color: "white",
                  border: "none",
                  fontSize: "16px",
                }}
              >
                ✈️ Ajukan Cuti/Izin
              </button>
            </>
          )}
          {(isAdmin || isHR) && (
            <>
              <button
                className="btn"
                onClick={() => (window.location.href = "/attendance")}
                style={{
                  padding: "1rem",
                  background: "#43e97b",
                  color: "white",
                  border: "none",
                  fontSize: "16px",
                }}
              >
                👥 Kelola Absensi
              </button>
              <button
                className="btn"
                onClick={() => (window.location.href = "/leave")}
                style={{
                  padding: "1rem",
                  background: "#4facfe",
                  color: "white",
                  border: "none",
                  fontSize: "16px",
                }}
              >
                📋 Kelola Cuti
              </button>
            </>
          )}
        </div>
      </div>

      {/* Upcoming Leave - Hanya untuk Karyawan dan HR */}
      {!isAdmin && stats.upcomingLeave.length > 0 && (
        <div className="card" style={{ marginBottom: "2rem" }}>
          <h3 style={{ marginTop: 0 }}>📅 Cuti Yang Akan Datang</h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {stats.upcomingLeave.map((leave) => (
              <div
                key={leave.leave_id}
                style={{
                  padding: "1rem",
                  background: "#e8f5e9",
                  borderRadius: "8px",
                  borderLeft: "4px solid #4caf50",
                }}
              >
                <div style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
                  {leave.jenis_pengajuan || "Cuti"}
                </div>
                <div style={{ color: "#666", fontSize: "14px" }}>
                  📆 {formatDate(leave.tanggal_mulai)} s/d{" "}
                  {formatDate(leave.tanggal_selesai)}
                </div>
                <div
                  style={{
                    color: "#666",
                    fontSize: "14px",
                    marginTop: "0.25rem",
                  }}
                >
                  💬 {leave.alasan}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: isAdmin
            ? "1fr"
            : "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "1rem",
        }}
      >
        {/* Recent Attendance - Hanya untuk Karyawan dan HR */}
        {!isAdmin && (
          <div className="card">
            <h3 style={{ marginTop: 0 }}>🕐 Absensi Terbaru</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Masuk</th>
                  <th>Pulang</th>
                  <th>Tipe</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentAttendance.length > 0 ? (
                  stats.recentAttendance.map((a) => (
                    <tr key={a.attendance_id}>
                      <td>{formatDate(a.tanggal)}</td>
                      <td>{a.jam_masuk || "-"}</td>
                      <td>{a.jam_pulang || "-"}</td>
                      <td>
                        <span
                          style={{
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            background:
                              a.tipe_kerja === "WFO"
                                ? "#e3f2fd"
                                : a.tipe_kerja === "WFH"
                                ? "#fff3e0"
                                : "#f3e5f5",
                            color:
                              a.tipe_kerja === "WFO"
                                ? "#1976d2"
                                : a.tipe_kerja === "WFH"
                                ? "#f57c00"
                                : "#7b1fa2",
                          }}
                        >
                          {a.tipe_kerja || "WFO"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">
                      <i>Belum ada data absensi</i>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Recent Leave - Hanya untuk Karyawan dan HR */}
        {!isAdmin && (
          <div className="card">
            <h3 style={{ marginTop: 0 }}>📋 Pengajuan Terbaru</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Jenis</th>
                  <th>Periode</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentLeave.length > 0 ? (
                  stats.recentLeave.map((l) => (
                    <tr key={l.leave_id}>
                      <td>{formatDate(l.tanggal_pengajuan)}</td>
                      <td>{l.jenis_pengajuan || "Cuti"}</td>
                      <td style={{ fontSize: "12px" }}>
                        {formatDate(l.tanggal_mulai)} →{" "}
                        {formatDate(l.tanggal_selesai)}
                      </td>
                      <td>
                        <span
                          style={{
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "500",
                            background:
                              l.status === "approved"
                                ? "#4caf50"
                                : l.status === "rejected"
                                ? "#f44336"
                                : "#ff9800",
                            color: "white",
                          }}
                        >
                          {l.status === "approved"
                            ? "✓ Approved"
                            : l.status === "rejected"
                            ? "✗ Rejected"
                            : "⏳ Pending"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">
                      <i>Belum ada pengajuan</i>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Info untuk Admin */}
        {isAdmin && (
          <div className="card">
            <h3 style={{ marginTop: 0 }}>ℹ️ Informasi Admin</h3>
            <div style={{ lineHeight: "1.8" }}>
              <p>
                Selamat datang di dashboard Admin. Sebagai Admin, Anda memiliki
                akses penuh untuk:
              </p>
              <ul style={{ paddingLeft: "1.5rem" }}>
                <li>✓ Melihat dan mengelola semua data absensi karyawan</li>
                <li>✓ Melihat dan menyetujui/menolak pengajuan cuti/izin</li>
                <li>✓ Mengelola data karyawan</li>
                <li>⚠️ Tidak dapat mengajukan cuti/izin atas nama sendiri</li>
              </ul>
              <div
                style={{
                  marginTop: "1rem",
                  padding: "1rem",
                  background: "#fff3e0",
                  borderRadius: "8px",
                  borderLeft: "4px solid #ff9800",
                }}
              >
                <strong>💡 Tips:</strong> Gunakan menu Absensi dan Cuti untuk
                mengelola pengajuan karyawan yang memerlukan approval.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div
        className="card"
        style={{
          marginTop: "2rem",
          background: "#f5f5f5",
          textAlign: "center",
        }}
      >
        <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
          💼 HR Platform - Sistem Manajemen Karyawan | Role:{" "}
          <strong>{user.role}</strong>
        </p>
      </div>
    </div>
  );
}
