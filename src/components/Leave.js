import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import * as api from "../services/api";

export default function Leave() {
  const [employees, setEmployees] = useState([]);
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    employee_id: "",
    tanggal_pengajuan: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
    alasan: "",
    status: "pending",
  });
  const { user } = useAuth();

  const refresh = () => setList(api.leave.findAll());
  useEffect(() => {
    setEmployees(api.employees.findAll());
    refresh();
  }, []);

  const submit = (e) => {
    e.preventDefault();
    api.leave.create(form);
    setForm({
      employee_id: "",
      tanggal_pengajuan: "",
      tanggal_mulai: "",
      tanggal_selesai: "",
      alasan: "",
      status: "pending",
    });
    refresh();
  };

  const approve = (id, s) => {
    api.leave.update(id, { status: s });
    refresh();
  };

  return (
    <div>
      <h1>Cuti & Izin</h1>

      <form className="card grid cols-3" onSubmit={submit}>
        <div>
          <label>Karyawan</label>
          <select
            value={form.employee_id}
            onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
          >
            <option value="">- pilih -</option>
            {employees.map((e) => (
              <option key={e.employee_id} value={e.employee_id}>
                {e.nama_lengkap}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Tanggal Pengajuan</label>
          <input
            type="date"
            value={form.tanggal_pengajuan}
            onChange={(e) =>
              setForm({ ...form, tanggal_pengajuan: e.target.value })
            }
          />
        </div>
        <div>
          <label>Mulai</label>
          <input
            type="date"
            value={form.tanggal_mulai}
            onChange={(e) =>
              setForm({ ...form, tanggal_mulai: e.target.value })
            }
          />
        </div>
        <div>
          <label>Selesai</label>
          <input
            type="date"
            value={form.tanggal_selesai}
            onChange={(e) =>
              setForm({ ...form, tanggal_selesai: e.target.value })
            }
          />
        </div>
        <div className="grid" style={{ gridTemplateColumns: "1fr" }}>
          <label>Alasan</label>
          <textarea
            rows={2}
            value={form.alasan}
            onChange={(e) => setForm({ ...form, alasan: e.target.value })}
          />
        </div>
        <div className="flex">
          <button className="btn">Ajukan</button>
        </div>
      </form>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Tgl Ajukan</th>
              <th>Nama</th>
              <th>Periode</th>
              <th>Alasan</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {list.map((l) => {
              const emp = api.employees.findById(l.employee_id);
              return (
                <tr key={l.leave_id}>
                  <td>{l.tanggal_pengajuan}</td>
                  <td>{emp?.nama_lengkap}</td>
                  <td>
                    {l.tanggal_mulai} → {l.tanggal_selesai}
                  </td>
                  <td>{l.alasan}</td>
                  <td>{l.status}</td>
                  <td className="flex">
                    {(user.role === "Admin" || user.role === "HR") &&
                      l.status === "pending" && (
                        <>
                          <button
                            className="btn"
                            onClick={() => approve(l.leave_id, "approved")}
                          >
                            Approve
                          </button>
                          <button
                            className="btn danger"
                            onClick={() => approve(l.leave_id, "rejected")}
                          >
                            Reject
                          </button>
                        </>
                      )}
                  </td>
                </tr>
              );
            })}
            {list.length === 0 && (
              <tr>
                <td colSpan="6">
                  <i>Belum ada pengajuan.</i>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
