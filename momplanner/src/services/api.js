// src/services/api.js
import { APPS_SCRIPT_URL } from "../utils/constants";

// Kirim sebagai form-encoded agar aman di Vercel (tanpa preflight)
async function postForm(payload) {
  const body = new URLSearchParams(payload); // no custom headers
  const res = await fetch(APPS_SCRIPT_URL, { method: "POST", body });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || "Request gagal");
  return data;
}

export async function apiLogin(username, password) {
  const { user } = await postForm({ mode: "login", username, password });
  // Sertakan password agar bisa dipakai untuk delete (diambil dari localStorage)
  return { ...user, password }; // { username, name, password }
}


export async function apiWrite({
  type,
  date,
  description,
  amount,
  user,
  password,
}) {
  await postForm({
    mode: "write",
    type,
    date,
    description,
    amount,
    username: user.username,
    name: user.name,
    password,
  });
}

// Hapus 1 baris transaksi (perlu Apps Script: mode=delete)
export async function apiDelete({
  type,
  rowIndex,
  year,
  month,
  tanggal,
  uang,
  keterangan,
}) {
  const auth = JSON.parse(localStorage.getItem("MP_USER") || "{}");
  return postForm({
    mode: "delete",
    type,
    rowIndex,
    year,
    month,
    tanggal,
    uang,
    keterangan,
    username: auth.username, // ✅ kirim kredensial
    password: auth.password, // ✅ kirim kredensial
  });
}




// 🔽 Tambahan baru: ambil ringkasan debet/kredit per bulan
export async function apiSummary(year, month) {
  const { data } = await postForm({
    mode: "summary",
    year, // contoh: 2025
    month, // 1..12 (Jan = 1, dst)
  });
  return data; // { year, month, totalDebet, totalKredit, selisih }
}
