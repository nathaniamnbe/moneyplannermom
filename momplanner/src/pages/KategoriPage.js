"use client";

import React, { useEffect, useState } from "react";

export default function KategoriPage({ user, onCancel }) {
  // Default kategori awal
  const DEFAULT_CATEGORIES = [
    "Hp dde",
    "Maria",
    "Asuransi cce",
    "Tabungan cool",
  ];

  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [newCategory, setNewCategory] = useState("");

  // Saat pertama kali load, coba ambil dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem("MP_CATEGORIES");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCategories(parsed);
        }
      } catch (e) {
        console.error("Gagal parse kategori dari localStorage", e);
      }
    }
  }, []);

  // Simpan setiap ada perubahan kategori
  useEffect(() => {
    localStorage.setItem("MP_CATEGORIES", JSON.stringify(categories));
  }, [categories]);

  const handleAddCategory = (e) => {
    e.preventDefault();
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    // Hindari duplikat
    if (categories.includes(trimmed)) {
      alert("Kategori sudah ada.");
      return;
    }
    setCategories((prev) => [...prev, trimmed]);
    setNewCategory("");
  };

  // ====== STYLE mirip Dashboard ======
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
      maxWidth: "800px",
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
      fontSize: "18px",
      fontWeight: "600",
      marginBottom: "16px",
      color: "#333",
    },
    categoryList: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
    },
    categoryItem: {
      padding: "8px 14px",
      borderRadius: "999px",
      border: "1px solid #333",
      fontSize: "13px",
      background: "white",
      color: "#333",
    },
    formRow: {
      display: "flex",
      gap: "8px",
      marginTop: "8px",
      flexWrap: "wrap",
    },
    input: {
      flex: "1",
      minWidth: "180px",
      padding: "10px 12px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      fontSize: "14px",
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
    },
  };

  return (
    <div style={styles.container}>
      {/* HEADER mirip Dashboard */}
      <div style={styles.headerWrapper}>
        <div style={styles.headerInner}>
          <div style={styles.headerContent}>
            <h1 style={styles.title}>
              {user?.name ? `${user.name} - Kategori` : "Kategori"}
            </h1>
            <button
              onClick={onCancel}
              style={styles.backBtn}
              onMouseEnter={(e) => (e.target.style.background = "#555")}
              onMouseLeave={(e) => (e.target.style.background = "#333")}
            >
              Kembali
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={styles.mainContent}>
        {/* Daftar Kategori */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Daftar Kategori</h2>
          {categories.length === 0 ? (
            <p style={{ color: "#777", fontSize: "14px" }}>
              Belum ada kategori.
            </p>
          ) : (
            <div style={styles.categoryList}>
              {categories.map((cat, idx) => (
                <span key={idx} style={styles.categoryItem}>
                  {cat}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Form Tambah Kategori */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Tambah Kategori Baru</h2>
          <form onSubmit={handleAddCategory}>
            <div style={styles.formRow}>
              <input
                type="text"
                placeholder="Nama kategori..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                style={styles.input}
              />
              <button type="submit" style={styles.addBtn}>
                Tambah
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
