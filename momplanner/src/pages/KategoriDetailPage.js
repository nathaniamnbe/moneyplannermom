"use client";

import React, { useEffect, useState } from "react";
import { apiKategoriAdd } from "../services/api";

export default function KategoriDetailPage({ user, category, onBack }) {
  const [items, setItems] = useState([]);
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");

  // Load existing data
  useEffect(() => {
    const raw = localStorage.getItem("MP_CATEGORY_DATA");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed[category]) setItems(parsed[category]);
      } catch {}
    }
  }, [category]);

  const saveAll = (newItems) => {
    const raw = localStorage.getItem("MP_CATEGORY_DATA");
    let all = {};
    if (raw) {
      try {
        all = JSON.parse(raw);
      } catch {}
    }
    all[category] = newItems;
    localStorage.setItem("MP_CATEGORY_DATA", JSON.stringify(all));
  };

  // Add new item
  const handleAdd = async (e) => {
    e.preventDefault();
    const d = desc.trim();
    const num = Number(amount);

    if (!d || isNaN(num)) {
      alert("Isi keterangan & jumlah dengan benar.");
      return;
    }

    // Save to Google Sheets
    try {
      await apiKategoriAdd({ category, desc: d, amount: num });
    } catch (err) {
      console.error(err);
    }

    const newItems = [...items, { desc: d, amount: num }];
    setItems(newItems);
    saveAll(newItems);

    setDesc("");
    setAmount("");
  };

  // Delete item
  const handleDelete = (idx) => {
    if (!confirm("Hapus data ini?")) return;

    const newItems = items.filter((_, i) => i !== idx);
    setItems(newItems);
    saveAll(newItems);
  };

  const total = items.reduce((sum, it) => sum + Number(it.amount || 0), 0);

  const styles = {
    container: {
      minHeight: "100vh",
      background: "#f5f5f5",
      padding: "20px",
      fontFamily: "Segoe UI",
    },
    header: {
      background: "#fff",
      padding: "20px",
      borderRadius: "10px",
      display: "flex",
      alignItems: "center",
      gap: "20px",
      marginBottom: "25px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    },
    backBtn: {
      background: "#eee",
      border: "none",
      padding: "10px 16px",
      borderRadius: "6px",
      cursor: "pointer",
    },
    card: {
      background: "#fff",
      padding: "20px",
      borderRadius: "10px",
      marginBottom: "20px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    },

    inputRow: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },

    input: {
      padding: "12px",
      fontSize: "15px",
      borderRadius: "6px",
      border: "1px solid #cccccc",
    },

    submitBtn: {
      padding: "12px",
      background: "#333",
      color: "white",
      border: "none",
      borderRadius: "6px",
      fontSize: "15px",
      cursor: "pointer",
    },

    itemCard: {
      border: "1px solid #ddd",
      borderRadius: "10px",
      padding: "14px",
      marginBottom: "12px",
      background: "#fafafa",
    },
    itemTitle: {
      fontSize: "15px",
      fontWeight: "600",
      marginBottom: "6px",
    },
    delButton: {
      marginTop: "8px",
      padding: "6px 10px",
      fontSize: "12px",
      borderRadius: "5px",
      border: "none",
      background: "#ff6b6b",
      color: "white",
      cursor: "pointer",
    },

    totalRow: {
      marginTop: "10px",
      padding: "12px",
      background: "#f0f0f0",
      fontWeight: "700",
      borderRadius: "6px",
    },
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>
          ← Kembali
        </button>
        <h2>
          {user?.name} - {category}
        </h2>
      </div>

      {/* INPUT */}
      <div style={styles.card}>
        <h3>Tambah Data</h3>
        <form onSubmit={handleAdd} style={styles.inputRow}>
          <input
            style={styles.input}
            placeholder="Keterangan..."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="Jumlah..."
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <button style={styles.submitBtn}>Simpan</button>
        </form>
      </div>

      {/* LIST OF SAVED ITEMS */}
      <div style={styles.card}>
        <h3>Data Tersimpan</h3>

        {items.length === 0 ? (
          <p style={{ color: "#888" }}>Belum ada data.</p>
        ) : (
          <>
            {items.map((item, idx) => (
              <div key={idx} style={styles.itemCard}>
                <div style={styles.itemTitle}>Keterangan:</div>
                <div>{item.desc}</div>

                <div style={{ marginTop: "8px", fontWeight: "600" }}>
                  Jumlah: Rp {Number(item.amount).toLocaleString("id-ID")}
                </div>

                <button
                  style={styles.delButton}
                  onClick={() => handleDelete(idx)}
                >
                  Hapus
                </button>
              </div>
            ))}

            <div style={styles.totalRow}>
              Total: Rp {total.toLocaleString("id-ID")}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
