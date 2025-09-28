import { useEffect, useState } from "react";
import * as api from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    emp: 0,
    hadir: 0,
    izin: 0,
    cutiPending: 0,
    gajiBulanIni: 0,
  });

  useEffect(() => {
    const all = api.stats();
    setStats(all);
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="grid cols-3">
        <div className="card">
          <h3>Total Karyawan</h3>
          <h1>{stats.emp}</h1>
          <small className="muted">employees</small>
        </div>
        <div className="card">
          <h3>Absensi Hari Ini</h3>
          <div className="flex">
            <div className="card" style={{ flex: 1 }}>
              <h2>{stats.hadir}</h2>
              <small className="muted">Hadir</small>
            </div>
            <div className="card" style={{ flex: 1 }}>
              <h2>{stats.izin}</h2>
              <small className="muted">Izin/Sakit/Alpa</small>
            </div>
          </div>
        </div>
        <div className="card">
          <h3>Cuti Pending</h3>
          <h1>{stats.cutiPending}</h1>
          <small className="muted">menunggu approval</small>
        </div>
      </div>

      <div className="grid cols-2">
        <div className="card">
          <h3>Payroll Bulan Ini</h3>
          <h1>Rp {stats.gajiBulanIni.toLocaleString("id-ID")}</h1>
          <small className="muted">total gaji terhitung</small>
        </div>
        <div className="card">
          <h3>Tips</h3>
          <p>
            Semua data ini berasal dari mock API <code>localStorage</code>.
            Nanti sambungkan ke backend cukup di{" "}
            <strong>services/api.js</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
