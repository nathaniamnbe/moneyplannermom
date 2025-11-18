"use client";

import React, { useEffect, useState } from "react";

export default function KategoriPage({ user, onCancel, onOpenCategory }) {
  const DEFAULT_CATEGORIES = [
    "Hp dde",
    "Maria",
    "Asuransi cce",
    "Tabungan cool",
  ];

  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [newCategory, setNewCategory] = useState("");

  // Load dari localStorage
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

  // Simpan setiap kali kategori berubah
  useEffect(() => {
    localStorage.setItem("MP_CATEGORIES", JSON.stringify(categories));
  }, [categories]);

  const handleAddCategory = (e) => {
    e.preventDefault();
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) {
      alert("Kategori sudah ada.");
      return;
    }
    setCategories((prev) => [...prev, trimmed]);
    setNewCategory("");
  };

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
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
      gap: "12px",
    },
    categoryCard: {
      background: "white",
      border: "2px solid #333",
      borderRadius: "8px",
      padding: "16px",
      textAlign: "center",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
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
  };

  return (
    <div style={styles.container}>
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

      <div style={styles.mainContent}>
        {/* Daftar kategori dalam bentuk kotak */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Daftar Kategori</h2>
          {categories.length === 0 ? (
            <p style={{ color: "#999", fontSize: "14px" }}>
              Belum ada kategori.
            </p>
          ) : (
            <div style={styles.grid}>
              {categories.map((cat, idx) => (
                <div
                  key={idx}
                  style={styles.categoryCard}
                  onClick={() => onOpenCategory && onOpenCategory(cat)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#333";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "white";
                    e.currentTarget.style.color = "#333";
                  }}
                >
                  {cat}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tambah kategori baru */}
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
              <button
                type="submit"
                style={styles.addBtn}
                onMouseEnter={(e) => (e.target.style.background = "#222")}
                onMouseLeave={(e) => (e.target.style.background = "#333")}
              >
                Tambah
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
