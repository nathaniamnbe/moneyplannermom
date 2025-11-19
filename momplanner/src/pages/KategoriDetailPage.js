"use client";

import React, { useEffect, useState } from "react";
import { apiKategoriAdd } from "../services/api";

export default function KategoriDetailPage({ user, category, onBack }) {
  const [items, setItems] = useState([]);
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");

  const [hoverBackBtn, setHoverBackBtn] = useState(false);
  const [hoverSubmitBtn, setHoverSubmitBtn] = useState(false);

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
      await apiKategoriAdd({
        category,
        desc: trimmedDesc,
        amount: num,
      });

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
    formRow: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },

    subRow: {
      display: "flex",
      flexDirection: "row",
      gap: "12px",
      alignItems: "center",
    },

    input: {
      flex: 1,
      minWidth: "0",
      padding: "12px 14px",
      borderRadius: "8px",
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
      {/* HEADER ala Input Debet */}
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
          {user?.name
            ? `${user.name} - ${category}`
            : `Detail Kategori: ${category}`}
        </h1>
      </div>

      {/* MAIN CONTENT */}
      <div style={styles.mainContent}>
        {/* Form input */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Tambah Data</h2>
          <form onSubmit={handleAdd}>
            <div style={styles.formRow}>
              {/* Keterangan full width */}
              <input
                type="text"
                placeholder="Keterangan..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                style={styles.input}
              />

              {/* Baris kedua: Jumlah + tombol Simpan */}
              <div style={styles.subRow}>
                <input
                  type="number"
                  placeholder="Jumlah..."
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={styles.input}
                />
                <button
                  type="submit"
                  style={{
                    ...styles.addBtn,
                    backgroundColor: hoverSubmitBtn ? "#222" : "#333",
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
