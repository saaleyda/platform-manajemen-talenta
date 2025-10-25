import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import * as api from "../services/api";

export default function Cuti() {
  const [employees, setEmployees] = useState([]);
  const [list, setList] = useState([]);
  const { user } = useAuth(); // Mendapatkan informasi user yang sedang login

  // Ambil ID Karyawan yang sedang login
  const loggedInEmployeeId = user.employee_id;

  // Logika Role: Admin TIDAK bisa mengajukan. Admin/HR BISA Approve/Reject.
  const isAdmin = user.role === "Admin";
  const isApprover = isAdmin || user.role === "HR";

  // Hanya Admin yang bisa melihat/menginput data untuk semua karyawan
  const canSelectOtherEmployee = isAdmin;

  // Form state untuk pengajuan
  const [form, setForm] = useState({
    employee_id: canSelectOtherEmployee ? "" : user.username, // Set employee_id ke username
    tanggal_pengajuan: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
    jenis_pengajuan: "Cuti",
    alasan: "",
    status: "pending",
  });

  // Fungsi refresh untuk mengambil data pengajuan
  const refresh = () => setList(api.leave.findAll());

  useEffect(() => {
    setEmployees(api.employees.findAll()); // Mengambil data karyawan
    refresh(); // Memuat daftar pengajuan
  }, []);

  const submit = (e) => {
    e.preventDefault();

    // Blokir submit jika user adalah Admin (sesuai logika awal)
    if (isAdmin) {
      alert(
        "Admin tidak dapat mengajukan cuti/izin/sakit. Anda hanya dapat menyetujui atau menolak pengajuan."
      );
      return;
    }

    // Pastikan employee_id terisi (otomatis jika bukan admin, atau dipilih jika admin)
    if (!form.employee_id) {
      alert(
        "Pilih karyawan atau pastikan Anda memiliki ID karyawan untuk mengajukan cuti."
      );
      return;
    }

    // Validasi form
    if (
      !form.tanggal_pengajuan ||
      !form.tanggal_mulai ||
      !form.tanggal_selesai ||
      !form.alasan
    ) {
      alert("Semua field wajib diisi.");
      return;
    }

    // Ambil role dari user yang sedang login
    const employeeData = api.employees.findById(form.employee_id);

    // Kirim data pengajuan dengan role otomatis
    api.leave.create({
      ...form,
      role: employeeData?.role || user.role, // Tambahkan role otomatis
    });

    // Reset form setelah submit
    setForm({
      employee_id: canSelectOtherEmployee ? "" : user.username, // Set ulang employee_id ke username
      tanggal_pengajuan: "",
      tanggal_mulai: "",
      tanggal_selesai: "",
      jenis_pengajuan: "Cuti",
      alasan: "",
      status: "pending",
    });
    refresh();
  };

  const approve = (id, s) => {
    api.leave.update(id, { status: s });
    refresh();
  };

  // Helper untuk memperbarui state form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h1>Cuti, Izin & Sakit</h1>

      {/* Form hanya ditampilkan untuk HR dan Karyawan (!isAdmin) */}
      {!isAdmin && (
        <form className="card grid cols-3" onSubmit={submit}>
          {/* Dropdown Jenis Pengajuan (tetap ada) */}
          <div>
            <label>Jenis Pengajuan</label>
            <select
              name="jenis_pengajuan"
              value={form.jenis_pengajuan}
              onChange={handleChange}
            >
              <option value="Cuti">Cuti</option>
              <option value="Izin">Izin</option>
              <option value="Sakit">Sakit</option>
            </select>
          </div>

          {/* Logika tampilan Field Karyawan */}
          {canSelectOtherEmployee ? (
            // Tampilkan dropdown untuk Admin
            <div>
              <label>Karyawan</label>
              <select
                name="employee_id"
                value={form.employee_id}
                onChange={handleChange}
              >
                <option value="">- pilih -</option>
                {employees.map((e) => (
                  <option key={e.employee_id} value={e.employee_id}>
                    {e.nama_lengkap}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            // Tampilkan nama karyawan/HR yang sedang login (untuk Karyawan & HR)
            <div className="no-dropdown">
              <label>Karyawan</label>
              <p style={{ fontWeight: "bold" }}>
                {user.nama_lengkap || user.username}
              </p>
            </div>
          )}

          {/* Field Tanggal Pengajuan */}
          <div>
            <label>Tanggal Pengajuan</label>
            <input
              type="date"
              name="tanggal_pengajuan"
              value={form.tanggal_pengajuan}
              onChange={handleChange}
            />
          </div>

          {/* Field Tanggal Mulai */}
          <div>
            <label>Mulai</label>
            <input
              type="date"
              name="tanggal_mulai"
              value={form.tanggal_mulai}
              onChange={handleChange}
            />
          </div>

          {/* Field Tanggal Selesai */}
          <div>
            <label>Selesai</label>
            <input
              type="date"
              name="tanggal_selesai"
              value={form.tanggal_selesai}
              onChange={handleChange}
            />
          </div>

          {/* Field Alasan */}
          <div className="grid" style={{ gridTemplateColumns: "1fr" }}>
            <label>Alasan / Keterangan</label>
            <textarea
              rows={2}
              name="alasan"
              value={form.alasan}
              onChange={handleChange}
            />
          </div>

          {/* Tombol Ajukan */}
          <div className="flex">
            <button className="btn">Ajukan</button>
          </div>
        </form>
      )}

      {/* Informasi untuk Admin (Hanya Approve/Reject) */}
      {isAdmin && (
        <div
          className="card"
          style={{
            background: "#fff3e0",
            border: "1px solid #ff9800",
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          <p style={{ margin: 0, color: "#e65100" }}>
            ⚠️ Anda login sebagai **{user.role}**. Anda hanya dapat menyetujui
            atau menolak pengajuan, **tidak dapat mengajukan cuti/izin/sakit.**
          </p>
        </div>
      )}

      {/* Informasi untuk HR (Bisa Mengajukan dan Approve/Reject) */}
      {user.role === "HR" && (
        <div
          className="card"
          style={{
            background: "#e0f7fa",
            border: "1px solid #00bcd4",
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          <p style={{ margin: 0, color: "#006064" }}>
            ℹ️ Anda login sebagai **HR**. Anda dapat mengajukan permohonan di
            atas dan juga dapat menyetujui atau menolak pengajuan dari karyawan.
          </p>
        </div>
      )}

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Tgl Ajukan</th>
              <th>Nama</th>
              <th>Jenis</th>
              <th>Periode</th>
              <th>Alasan</th>
              <th>Status</th>
              <th>Role</th> {/* Menambahkan kolom Role */}
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {/* Tabel tetap menampilkan SEMUA data karena HR/Admin perlu melihat semua untuk approval */}
            {list.map((l) => {
              const emp = api.employees.findById(l.employee_id);
              return (
                <tr key={l.leave_id}>
                  <td>{l.tanggal_pengajuan}</td>
                  <td>{emp?.nama_lengkap || l.employee_id}</td>
                  <td>{l.jenis_pengajuan || "Cuti"}</td>
                  <td>
                    {l.tanggal_mulai} → {l.tanggal_selesai}
                  </td>
                  <td>{l.alasan}</td>
                  <td>{l.status}</td>
                  <td>{l.role || emp?.role || "Tidak Diketahui"}</td>
                  {/* Prioritas: role dari data leave, lalu dari employee */}
                  <td className="flex">
                    {/* Aksi Approve/Reject hanya untuk Admin ATAU HR */}
                    {isApprover && l.status === "pending" && (
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
                <td colSpan="8">
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
