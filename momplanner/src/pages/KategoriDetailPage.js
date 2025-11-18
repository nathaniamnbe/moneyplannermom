"use client";

import React, { useEffect, useState } from "react";
import { apiKategoriAdd } from "../services/api";

export default function KategoriDetailPage({ user, category, onBack }) {
  const [items, setItems] = useState([]);
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");

  // load data kategori dari localStorage
  useEffect(() => {
    const raw = localStorage.getItem("MP_CATEGORY_DATA");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && parsed[category]) {
          setItems(parsed[category]);
        }
      } catch (e) {
        console.error("Gagal parse MP_CATEGORY_DATA", e);
      }
    }
  }, [category]);

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

  const handleAdd = async (e) => {
    e.preventDefault();
    const trimmedDesc = desc.trim();
    const num = Number.parseFloat(String(amount).replace(/[^\d.-]/g, ""));

    if (!trimmedDesc || isNaN(num)) {
      alert("Isi keterangan dan jumlah yang valid.");
      return;
    }

    try {
      // ✅ Kirim ke Google Sheets tab "kategori"
      await apiKategoriAdd({
        category,
        desc: trimmedDesc,
        amount: num,
      });

      // ✅ Update tampilan lokal (localStorage + state)
      const newItem = { desc: trimmedDesc, amount: num };
      const newItems = [...items, newItem];
      setItems(newItems);
      saveAll(newItems);

      setDesc("");
      setAmount("");
    } catch (err) {
      console.error(err);
      alert(err.message || "Gagal menyimpan ke kategori.");
    }
  };

  const total = items.reduce((sum, it) => sum + (it.amount || 0), 0);

  const styles = {
    container: {
      minHeight: "100vh",
      padding: "20px",
      background: "#f5f5f5",
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    },
    headerWrapper: {
      borderBottom: "1px solid #e0e0e0",
      background: "white",
    },
    headerInner: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "24px 16px",
    },
    headerContent: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#333",
      margin: "0",
    },
    backBtn: {
      padding: "8px 16px",
      background: "#333",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "13px",
      fontWeight: "500",
      transition: "all 0.2s ease",
    },
    mainContent: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "32px 16px",
    },
    card: {
      background: "white",
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
      padding: "24px",
      marginBottom: "24px",
    },
    sectionTitle: {
      fontSize: "16px",
      fontWeight: "bold",
      color: "#333",
      margin: "0 0 16px 0",
    },
    formRow: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr auto",
      gap: "8px",
      alignItems: "center",
    },
    input: {
      width: "100%",
      padding: "10px 12px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      fontSize: "14px",
      fontFamily: "inherit",
    },
    addBtn: {
      padding: "10px 16px",
      background: "#333",
      color: "white",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      transition: "all 0.2s ease",
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
      padding: "12px 8px",
      fontSize: "14px",
      color: "#333",
    },
    totalRow: {
      fontWeight: "bold",
      background: "#fafafa",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerWrapper}>
        <div style={styles.headerInner}>
          <div style={styles.headerContent}>
            <h1 style={styles.title}>
              {user?.name
                ? `${user.name} - ${category}`
                : `Detail Kategori: ${category}`}
            </h1>
            <button
              onClick={onBack}
              style={styles.backBtn}
              onMouseEnter={(e) => (e.target.style.background = "#555")}
              onMouseLeave={(e) => (e.target.style.background = "#333")}
            >
              Kembali
            </button>
          </div>
        </div>
      </div>

      <div style={styles.mainContent}>
        {/* Form input */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Tambah Data</h2>
          <form onSubmit={handleAdd}>
            <div style={styles.formRow}>
              <input
                type="text"
                placeholder="Keterangan..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                style={styles.input}
              />
              <input
                type="number"
                placeholder="Jumlah..."
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={styles.input}
              />
              <button
                type="submit"
                style={styles.addBtn}
                onMouseEnter={(e) => (e.target.style.background = "#222")}
                onMouseLeave={(e) => (e.target.style.background = "#333")}
              >
                Simpan
              </button>
            </div>
          </form>
        </div>

        {/* Tabel hasil */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Data Tersimpan</h2>
          {items.length === 0 ? (
            <p style={{ color: "#999", fontSize: "14px" }}>
              Belum ada data untuk kategori ini.
            </p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Keterangan</th>
                  <th style={styles.th}>Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => (
                  <tr key={idx}>
                    <td style={styles.td}>{it.desc}</td>
                    <td style={styles.td}>
                      Rp {Number(it.amount).toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
                <tr style={styles.totalRow}>
                  <td style={styles.td}>Total</td>
                  <td style={styles.td}>
                    Rp {Number(total).toLocaleString("id-ID")}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
