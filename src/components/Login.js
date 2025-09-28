import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [tab, setTab] = useState("login"); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const { login, register } = useAuth();

  // state login
  const [username, setU] = useState("");
  const [password, setP] = useState("");

  // state register
  const [rUsername, setRU] = useState("");
  const [rEmail, setRE] = useState("");
  const [rPass, setRP] = useState("");
  const [rPass2, setRP2] = useState("");
  const [rRole, setRRole] = useState("Karyawan"); // pilihan role jika mau

  const onLogin = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login(username.trim(), password);
      navigate("/dashboard");
    } catch (e) {
      setErr(e.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (e) => {
    e.preventDefault();
    setErr("");
    if (rPass !== rPass2) return setErr("Konfirmasi password tidak cocok");
    setLoading(true);
    try {
      await register({
        username: rUsername.trim(),
        password: rPass,
        email: rEmail.trim(),
        role: rRole,
      });
      navigate("/dashboard"); // auto redirect setelah auto-login
    } catch (e) {
      setErr(e.message || "Registrasi gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 520, marginTop: 120 }}>
      <div className="card">
        <h2>Masuk</h2>
        <p className="muted" style={{ marginTop: -6 }}>
          Woi
        </p>

        <div className="flex" style={{ margin: "10px 0" }}>
          <button
            className={`btn ${tab === "login" ? "" : "secondary"}`}
            onClick={() => setTab("login")}
          >
            Login
          </button>
          <button
            className={`btn ${tab === "register" ? "" : "secondary"}`}
            onClick={() => setTab("register")}
          >
            Daftar
          </button>
        </div>

        {err && (
          <div
            className="card"
            style={{
              borderColor: "#7f1d1d",
              background: "#1f2937",
              color: "#fecaca",
            }}
          >
            {err}
          </div>
        )}

        {tab === "login" ? (
          <form onSubmit={onLogin} className="grid">
            <div>
              <label>Username</label>
              <input
                value={username}
                onChange={(e) => setU(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setP(e.target.value)}
                required
              />
            </div>
            <button className="btn" disabled={loading}>
              {loading ? "Memproses..." : "Login"}
            </button>
          </form>
        ) : (
          <form onSubmit={onRegister} className="grid">
            <div className="grid cols-2">
              <div>
                <label>Username</label>
                <input
                  value={rUsername}
                  onChange={(e) => setRU(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Email (opsional)</label>
                <input
                  type="email"
                  value={rEmail}
                  onChange={(e) => setRE(e.target.value)}
                />
              </div>
            </div>

            <div className="grid cols-2">
              <div>
                <label>Password</label>
                <input
                  type="password"
                  value={rPass}
                  onChange={(e) => setRP(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Ulangi Password</label>
                <input
                  type="password"
                  value={rPass2}
                  onChange={(e) => setRP2(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Kalau mau batasi registrasi hanya Karyawan, sembunyikan select ini */}
            <div>
              <label>Role</label>
              <select value={rRole} onChange={(e) => setRRole(e.target.value)}>
                <option value="Karyawan">Karyawan</option>
                <option value="HR">HR</option>
                <option value="Admin">Admin</option>
              </select>
              <small className="muted">
                Di produksi, role ini sebaiknya diberikan via approval Admin.
              </small>
            </div>

            <button className="btn" disabled={loading}>
              {loading ? "Memproses..." : "Daftar & Masuk"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
