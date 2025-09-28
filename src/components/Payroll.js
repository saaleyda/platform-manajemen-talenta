import { useEffect, useState } from "react";
import * as api from "../services/api";

export default function Payroll() {
  const [employees, setEmployees] = useState([]);
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    employee_id: "",
    periode: "2025-09",
    gaji_pokok: 0,
    tunjangan: 0,
    potongan: 0,
  });

  useEffect(() => {
    setEmployees(api.employees.findAll());
    setList(api.payroll.findAll());
  }, []);

  const calcTotal = () =>
    (Number(form.gaji_pokok) || 0) +
    (Number(form.tunjangan) || 0) -
    (Number(form.potongan) || 0);

  const submit = (e) => {
    e.preventDefault();
    api.payroll.create({ ...form, total_gaji: calcTotal() });
    setList(api.payroll.findAll());
  };

  const exportCSV = () => {
    const rows = list.map((p) => ({
      employee_id: p.employee_id,
      periode: p.periode,
      gaji_pokok: p.gaji_pokok,
      tunjangan: p.tunjangan,
      potongan: p.potongan,
      total_gaji: p.total_gaji,
    }));
    const header = Object.keys(rows[0] || {}).join(",");
    const body = rows.map((r) => Object.values(r).join(",")).join("\n");
    const blob = new Blob([header + "\n" + body], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "payroll.csv";
    a.click();
  };

  return (
    <div>
      <div className="flex">
        <h1>Payroll</h1>
        <div className="right">
          <button className="btn secondary" onClick={exportCSV}>
            Export CSV
          </button>
        </div>
      </div>

      <form className="card grid cols-3" onSubmit={submit}>
        <div>
          <label>Karyawan</label>
          <select
            value={form.employee_id}
            onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
            required
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
            type="month"
            value={form.periode}
            onChange={(e) => setForm({ ...form, periode: e.target.value })}
          />
        </div>
        <div>
          <label>Gaji Pokok</label>
          <input
            type="number"
            value={form.gaji_pokok}
            onChange={(e) => setForm({ ...form, gaji_pokok: e.target.value })}
          />
        </div>
        <div>
          <label>Tunjangan</label>
          <input
            type="number"
            value={form.tunjangan}
            onChange={(e) => setForm({ ...form, tunjangan: e.target.value })}
          />
        </div>
        <div>
          <label>Potongan</label>
          <input
            type="number"
            value={form.potongan}
            onChange={(e) => setForm({ ...form, potongan: e.target.value })}
          />
        </div>
        <div>
          <label>Total</label>
          <input readOnly value={calcTotal()} />
        </div>
        <button className="btn">Simpan</button>
      </form>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Periode</th>
              <th>Nama</th>
              <th>Pokok</th>
              <th>Tunjangan</th>
              <th>Potongan</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => {
              const emp = api.employees.findById(p.employee_id);
              return (
                <tr key={p.payroll_id}>
                  <td>{p.periode}</td>
                  <td>{emp?.nama_lengkap}</td>
                  <td>Rp {Number(p.gaji_pokok).toLocaleString("id-ID")}</td>
                  <td>Rp {Number(p.tunjangan).toLocaleString("id-ID")}</td>
                  <td>Rp {Number(p.potongan).toLocaleString("id-ID")}</td>
                  <td>
                    <b>Rp {Number(p.total_gaji).toLocaleString("id-ID")}</b>
                  </td>
                </tr>
              );
            })}
            {list.length === 0 && (
              <tr>
                <td colSpan="6">
                  <i>Belum ada payroll.</i>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
