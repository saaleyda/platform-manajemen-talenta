import { useEffect, useState } from "react";
import * as api from "../services/api";

export default function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    employee_id: "",
    tanggal: "",
    jam_masuk: "",
    jam_pulang: "",
    status: "hadir",
  });

  const refresh = () => setList(api.attendance.findAll());
  useEffect(() => {
    setEmployees(api.employees.findAll());
    refresh();
  }, []);

  const submit = (e) => {
    e.preventDefault();
    api.attendance.create(form);
    setForm({
      employee_id: "",
      tanggal: "",
      jam_masuk: "",
      jam_pulang: "",
      status: "hadir",
    });
    refresh();
  };

  return (
    <div>
      <h1>Absensi</h1>
      <div className="card grid cols-3">
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
          <label>Tanggal</label>
          <input
            type="date"
            value={form.tanggal}
            onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
          />
        </div>
        <div>
          <label>Jam Masuk</label>
          <input
            type="time"
            value={form.jam_masuk}
            onChange={(e) => setForm({ ...form, jam_masuk: e.target.value })}
          />
        </div>
        <div>
          <label>Jam Pulang</label>
          <input
            type="time"
            value={form.jam_pulang}
            onChange={(e) => setForm({ ...form, jam_pulang: e.target.value })}
          />
        </div>
        <div>
          <label>Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option>hadir</option>
            <option>izin</option>
            <option>sakit</option>
            <option>alpa</option>
          </select>
        </div>
        <div className="flex">
          <button className="btn" onClick={submit}>
            Catat
          </button>
        </div>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Nama</th>
              <th>Masuk</th>
              <th>Pulang</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map((a) => {
              const emp = api.employees.findById(a.employee_id);
              return (
                <tr key={a.attendance_id}>
                  <td>{a.tanggal}</td>
                  <td>{emp?.nama_lengkap || "-"}</td>
                  <td>{a.jam_masuk}</td>
                  <td>{a.jam_pulang}</td>
                  <td>{a.status}</td>
                </tr>
              );
            })}
            {list.length === 0 && (
              <tr>
                <td colSpan="5">
                  <i>Belum ada catatan.</i>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
