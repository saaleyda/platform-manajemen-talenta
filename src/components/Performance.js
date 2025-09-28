import { useEffect, useState } from "react";
import * as api from "../services/api";

export default function Performance() {
  const [employees, setEmployees] = useState([]);
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    employee_id: "",
    periode: "2025-Q3",
    nilai_kinerja: 0,
    catatan: "",
  });

  useEffect(() => {
    setEmployees(api.employees.findAll());
    setList(api.performance.findAll());
  }, []);

  const submit = (e) => {
    e.preventDefault();
    api.performance.create(form);
    setList(api.performance.findAll());
    setForm({
      employee_id: "",
      periode: "2025-Q3",
      nilai_kinerja: 0,
      catatan: "",
    });
  };

  return (
    <div>
      <h1>Manajemen Talenta</h1>

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
          <label>Periode</label>
          <input
            value={form.periode}
            onChange={(e) => setForm({ ...form, periode: e.target.value })}
          />
        </div>
        <div>
          <label>Nilai Kinerja</label>
          <input
            type="number"
            value={form.nilai_kinerja}
            onChange={(e) =>
              setForm({ ...form, nilai_kinerja: e.target.value })
            }
          />
        </div>
        <div className="grid" style={{ gridTemplateColumns: "1fr" }}>
          <label>Catatan</label>
          <textarea
            rows={2}
            value={form.catatan}
            onChange={(e) => setForm({ ...form, catatan: e.target.value })}
          />
        </div>
        <button className="btn">Simpan</button>
      </form>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Periode</th>
              <th>Nama</th>
              <th>Nilai</th>
              <th>Catatan</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => {
              const emp = api.employees.findById(p.employee_id);
              return (
                <tr key={p.performance_id}>
                  <td>{p.periode}</td>
                  <td>{emp?.nama_lengkap}</td>
                  <td>{p.nilai_kinerja}</td>
                  <td>{p.catatan}</td>
                </tr>
              );
            })}
            {list.length === 0 && (
              <tr>
                <td colSpan="4">
                  <i>Belum ada data kinerja.</i>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
