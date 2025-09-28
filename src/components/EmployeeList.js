import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as api from "../services/api";

export default function EmployeeList() {
  const [list, setList] = useState([]);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const refresh = () => setList(api.employees.findAll(q));

  useEffect(() => {
    refresh();
  }, [q]);

  const del = (id) => {
    if (!window.confirm("Hapus karyawan ini?")) return;
    api.employees.remove(id);
    refresh();
  };

  const exportCSV = () => {
    const rows = api.employees.findAll().map((e) => ({
      employee_id: e.employee_id,
      nama_lengkap: e.nama_lengkap,
      jabatan: e.jabatan,
      tanggal_masuk: e.tanggal_masuk,
      status_karyawan: e.status_karyawan,
      no_hp: e.no_hp,
    }));
    const header = Object.keys(rows[0] || {}).join(",");
    const body = rows
      .map((r) =>
        Object.values(r)
          .map((v) => `"${(v ?? "").toString().replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");
    const blob = new Blob([header + "\n" + body], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "employees.csv";
    a.click();
  };

  return (
    <div>
      <div className="flex">
        <h1>Data Karyawan</h1>
        <div className="right flex">
          <input
            placeholder="Cari nama/jabatan..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="btn secondary" onClick={exportCSV}>
            Export CSV
          </button>
          <button className="btn" onClick={() => navigate("/add-employee")}>
            + Tambah
          </button>
        </div>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama</th>
              <th>Jabatan</th>
              <th>Status</th>
              <th>Masuk</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {list.map((e) => (
              <tr key={e.employee_id}>
                <td>{e.employee_id}</td>
                <td>
                  <Link to={`/employee/${e.employee_id}`}>
                    {e.nama_lengkap}
                  </Link>
                </td>
                <td>{e.jabatan}</td>
                <td>{e.status_karyawan}</td>
                <td>{e.tanggal_masuk}</td>
                <td className="flex">
                  <button
                    className="btn secondary"
                    onClick={() => navigate(`/employee/${e.employee_id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn danger"
                    onClick={() => del(e.employee_id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan="6">
                  <i>Tidak ada data.</i>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
