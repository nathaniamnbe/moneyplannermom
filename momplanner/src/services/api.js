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

// ====== AUTH & TRANSAKSI DEBET/KREDIT ======

export async function apiLogin(username, password) {
  const { user } = await postForm({ mode: "login", username, password });
  // simpan password untuk request delete
  return { ...user, password }; // { username, name, password }
}

export async function apiWrite({ type, date, description, amount }) {
  const auth = JSON.parse(localStorage.getItem("MP_USER") || "{}");
  if (!auth?.username || !auth?.password) {
    throw new Error(
      "Sesi login tidak lengkap. Silakan logout lalu login lagi."
    );
  }
  return postForm({
    mode: "write",
    type, // "debet" | "kredit"
    date,
    description,
    amount,
    username: auth.username, // ✅ WAJIB
    password: auth.password, // ✅ WAJIB
    name: auth.name || "", // opsional
  });
}

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
  if (!auth?.username || !auth?.password) {
    throw new Error(
      "Sesi login tidak lengkap. Silakan logout lalu login lagi."
    );
  }
  return postForm({
    mode: "delete",
    type,
    rowIndex,
    year,
    month,
    tanggal,
    uang,
    keterangan,
    username: auth.username, // ✅ wajib
    password: auth.password, // ✅ wajib
  });
}

// Ringkasan debet/kredit per bulan
export async function apiSummary(year, month) {
  const { data } = await postForm({
    mode: "summary",
    year, // contoh: 2025
    month, // 1..12 (Jan = 1, dst)
  });
  return data; // { year, month, totalDebet, totalKredit, selisih }
}

// ====== KATEGORI ======

export async function apiGetKategoriList() {
  const { data } = await postForm({ mode: "kategori_list" });
  return data || []; // array nama kategori
}

export async function apiAddKategori(name) {
  const { message } = await postForm({ mode: "kategori_add", name });
  return message;
}

export async function apiWriteKategori({ name, description, amount }) {
  // kalau di Apps Script kamu mau pakai auth juga, bisa baca username/password
  const auth = JSON.parse(localStorage.getItem("MP_USER") || "{}");
  return postForm({
    mode: "kategori_write",
    name,
    description,
    amount,
    username: auth.username || "",
    password: auth.password || "",
  });
}

export async function apiGetKategoriData(name) {
  const { data } = await postForm({ mode: "kategori_read", name });
  return data || [];
}
