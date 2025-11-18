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

  const [hoverBackBtn, setHoverBackBtn] = useState(false);
  const [hoverAddBtn, setHoverAddBtn] = useState(false);

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

  // 🔥 Hapus kategori + data detailnya di localStorage
  const handleDeleteCategory = (cat) => {
    const ok = window.confirm(`Hapus kategori "${cat}"?`);
    if (!ok) return;

    // hapus dari list kategori
    setCategories((prev) => prev.filter((c) => c !== cat));

    // hapus data detail kategori di MP_CATEGORY_DATA
    const raw = localStorage.getItem("MP_CATEGORY_DATA");
    if (raw) {
      try {
        const all = JSON.parse(raw) || {};
        delete all[cat];
        localStorage.setItem("MP_CATEGORY_DATA", JSON.stringify(all));
      } catch (e) {
        console.error("Gagal hapus data kategori di localStorage", e);
      }
    }
  };

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
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
      gap: "12px",
    },
    categoryCard: {
      background: "white",
      border: "2px solid #333",
      borderRadius: "8px",
      padding: "12px 14px",
      textAlign: "center",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
      color: "#333",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      gap: "8px",
    },
    categoryName: {
      flex: 1,
    },
    deleteBtn: {
      padding: "6px 10px",
      borderRadius: "4px",
      border: "none",
      fontSize: "12px",
      cursor: "pointer",
      backgroundColor: "#ff6b6b",
      color: "#ffffff",
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
      border: "1px solid ",
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
      {/* HEADER ala Input Debet */}
      <div style={styles.header}>
        <button
          style={{
            ...styles.backButton,
            backgroundColor: hoverBackBtn ? "#e0e0e0" : "#f0f0f0",
          }}
          onClick={onCancel}
          onMouseEnter={() => setHoverBackBtn(true)}
          onMouseLeave={() => setHoverBackBtn(false)}
        >
          ← Kembali
        </button>
        <h1 style={styles.title}>
          {user?.name ? `${user.name} - Kategori` : "Kategori"}
        </h1>
      </div>

      {/* MAIN CONTENT */}
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
                  <div style={styles.categoryName}>{cat}</div>
                  <button
                    type="button"
                    style={styles.deleteBtn}
                    onClick={(e) => {
                      e.stopPropagation(); // biar tidak buka detail
                      handleDeleteCategory(cat);
                    }}
                    onMouseEnter={(e) => {
                      e.stopPropagation();
                      e.currentTarget.style.backgroundColor = "#e84141";
                    }}
                    onMouseLeave={(e) => {
                      e.stopPropagation();
                      e.currentTarget.style.backgroundColor = "#ff6b6b";
                    }}
                  >
                    Hapus
                  </button>
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
                style={{
                  ...styles.addBtn,
                  backgroundColor: hoverAddBtn ? "#222" : "#333",
                }}
                onMouseEnter={() => setHoverAddBtn(true)}
                onMouseLeave={() => setHoverAddBtn(false)}
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
