"use client";

import React, { useEffect, useState } from "react";
import {
  apiKategoriAdd,
  apiKategoriDelete,
  apiKategoriList,
} from "../services/api";

export default function KategoriDetailPage({ user, category, onBack }) {
  const [items, setItems] = useState([]);
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");

  // loading fetch dari Google Sheets
  const [loading, setLoading] = useState(true);

  // loading delete
  const [deletingIndex, setDeletingIndex] = useState(null);

  const [hoverBackBtn, setHoverBackBtn] = useState(false);
  const [hoverSubmitBtn, setHoverSubmitBtn] = useState(false);

  // ---- Load data kategori ----
  useEffect(() => {
    let ignore = false;

    const load = async () => {
      setLoading(true);

      // Load cepat dari localStorage
      const raw = localStorage.getItem("MP_CATEGORY_DATA");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed && parsed[category]) {
            setItems(parsed[category]);
          }
        } catch {}
      }

      // Load dari Google Sheets
      try {
        const serverItems = await apiKategoriList(category);
        if (!ignore) {
          setItems(serverItems);
          saveAll(serverItems);
        }
      } catch (err) {
        console.error("Gagal load kategori dari server:", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();
    return () => (ignore = true);
  }, [category]);

  // ---- Simpan semua item ke localStorage ----
  const saveAll = (newItems) => {
    const raw = localStorage.getItem("MP_CATEGORY_DATA");
    let all = {};
    if (raw) {
      try {
        all = JSON.parse(raw) || {};
      } catch {
        all = {};
      }
    }
    all[category] = newItems;
    localStorage.setItem("MP_CATEGORY_DATA", JSON.stringify(all));
  };

  // ---- Tambah data baru ----
  const handleAdd = async (e) => {
    e.preventDefault();
    const trimmedDesc = desc.trim();
    const num = Number(String(amount).replace(/[^\d.-]/g, ""));

    if (!trimmedDesc || isNaN(num)) {
      alert("Isi keterangan dan jumlah yang valid.");
      return;
    }

    try {
      await apiKategoriAdd({
        category,
        desc: trimmedDesc,
        amount: num,
      });
    } catch (err) {
      console.error("Gagal kirim ke Apps Script:", err);
    }

    const newItem = { desc: trimmedDesc, amount: num };
    const updated = [...items, newItem];
    setItems(updated);
    saveAll(updated);

    setDesc("");
    setAmount("");
  };

  // ---- Hapus data ----
  const handleDeleteItem = async (index) => {
    if (!window.confirm("Hapus data ini?")) return;

    const target = items[index];
    setDeletingIndex(index);

    try {
      await apiKategoriDelete({
        category,
        desc: target.desc,
        amount: target.amount,
      });

      const updated = items.filter((_, i) => i !== index);
      setItems(updated);
      saveAll(updated);
    } catch (err) {
      console.error("Gagal hapus di Apps Script:", err);
    } finally {
      setDeletingIndex(null);
    }
  };

  const total = items.reduce(
    (sum, it) => sum + (isNaN(Number(it.amount)) ? 0 : Number(it.amount)),
    0
  );

  // --- STYLES (sama seperti sebelumnya) ---
  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#f5f5f5",
      padding: "20px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    header: {
      display: "flex",
      alignItems: "center",
      gap: "20px",
      marginBottom: "30px",
      backgroundColor: "#ffffff",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    },
    backButton: {
      backgroundColor: "#f0f0f0",
      border: "none",
      padding: "10px 16px",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      color: "#333333",
      transition: "all 0.2s ease",
    },
    title: {
      fontSize: "24px",
      fontWeight: "600",
      color: "#222222",
      margin: "0",
    },
    mainContent: {
      maxWidth: "1200px",
      margin: "0 auto",
    },
    card: {
      background: "white",
      borderRadius: "8px",
      padding: "24px",
      marginBottom: "24px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.06)",
    },
    sectionTitle: {
      fontSize: "16px",
      fontWeight: "bold",
      color: "#333",
      margin: "0 0 16px 0",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "16px",
    },
    th: {
      textAlign: "left",
      borderBottom: "1px solid #ddd",
      padding: "12px 8px",
      fontSize: "13px",
      fontWeight: "600",
      color: "#333",
      background: "#fafafa",
    },
    td: {
      borderBottom: "1px solid #f0f0f0",
      padding: "10px 8px",
      fontSize: "14px",
    },
    totalRow: {
      fontWeight: "bold",
      background: "#fafafa",
    },
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <button
          style={{
            ...styles.backButton,
            backgroundColor: hoverBackBtn ? "#e0e0e0" : "#f0f0f0",
          }}
          onClick={onBack}
          onMouseEnter={() => setHoverBackBtn(true)}
          onMouseLeave={() => setHoverBackBtn(false)}
        >
          ← Kembali
        </button>
        <h1 style={styles.title}>
          {user?.name ? `${user.name} - ${category}` : category}
        </h1>
      </div>

      {/* MAIN CONTENT */}
      <div style={styles.mainContent}>
        {/* FORM TAMBAH DATA */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Tambah Data</h2>
          <form onSubmit={handleAdd}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input
                type="text"
                placeholder="Keterangan..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  border: "1px solid #ccc",
                }}
              />

              <div style={{ display: "flex", gap: 12 }}>
                <input
                  type="number"
                  placeholder="Jumlah..."
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRadius: 8,
                    border: "1px solid #ccc",
                  }}
                />

                <button
                  type="submit"
                  style={{
                    background: hoverSubmitBtn ? "#222" : "#333",
                    padding: "12px 20px",
                    color: "white",
                    borderRadius: 8,
                    border: "none",
                  }}
                  onMouseEnter={() => setHoverSubmitBtn(true)}
                  onMouseLeave={() => setHoverSubmitBtn(false)}
                >
                  Simpan
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* DATA TERSIMPAN */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Data Tersimpan</h2>

          {loading ? (
            <p style={{ color: "#777" }}>Memuat data...</p>
          ) : items.length === 0 ? (
            <p style={{ color: "#999" }}>Belum ada data untuk kategori ini.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Keterangan</th>
                  <th style={styles.th}>Jumlah</th>
                  <th style={styles.th}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => (
                  <tr key={idx}>
                    <td style={styles.td}>{it.desc}</td>
                    <td style={styles.td}>
                      Rp {Number(it.amount).toLocaleString("id-ID")}
                    </td>
                    <td style={styles.td}>
                      <button
                        style={{
                          padding: "6px 12px",
                          borderRadius: 20,
                          border: "1px solid #faa",
                          background: "#fee",
                          cursor: deletingIndex === idx ? "default" : "pointer",
                          opacity: deletingIndex === idx ? 0.6 : 1,
                        }}
                        disabled={deletingIndex === idx}
                        onClick={() => handleDeleteItem(idx)}
                      >
                        {deletingIndex === idx ? "Menghapus..." : "Hapus"}
                      </button>
                    </td>
                  </tr>
                ))}

                {/* TOTAL */}
                <tr style={styles.totalRow}>
                  <td style={styles.td}>Total</td>
                  <td style={styles.td}>Rp {total.toLocaleString("id-ID")}</td>
                  <td style={styles.td}></td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
