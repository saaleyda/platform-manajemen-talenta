import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../services/api";

export default function AddEmployee() {
  const [form, setForm] = useState({
    nama_lengkap: "",
    alamat: "",
    no_hp: "",
    jabatan: "",
    tanggal_masuk: "",
    status_karyawan: "tetap",
  });
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    api.employees.create(form);
    alert("Karyawan ditambahkan");
    navigate("/employees");
  };

  return (
    <div>
      <h1>Tambah Karyawan</h1>
      <form className="card grid cols-2" onSubmit={submit}>
        <div>
          <label>Nama Lengkap</label>
          <input
            value={form.nama_lengkap}
            onChange={(e) => setForm({ ...form, nama_lengkap: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Jabatan</label>
          <input
            value={form.jabatan}
            onChange={(e) => setForm({ ...form, jabatan: e.target.value })}
          />
        </div>
        <div>
          <label>Alamat</label>
          <input
            value={form.alamat}
            onChange={(e) => setForm({ ...form, alamat: e.target.value })}
          />
        </div>
        <div>
          <label>No HP</label>
          <input
            value={form.no_hp}
            onChange={(e) => setForm({ ...form, no_hp: e.target.value })}
          />
        </div>
        <div>
          <label>Tanggal Masuk</label>
          <input
            type="date"
            value={form.tanggal_masuk}
            onChange={(e) =>
              setForm({ ...form, tanggal_masuk: e.target.value })
            }
          />
        </div>
        <div>
          <label>Status Karyawan</label>
          <select
            value={form.status_karyawan}
            onChange={(e) =>
              setForm({ ...form, status_karyawan: e.target.value })
            }
          >
            <option>tetap</option>
            <option>kontrak</option>
            <option>magang</option>
          </select>
        </div>
        <button className="btn">Simpan</button>
      </form>
    </div>
  );
}
