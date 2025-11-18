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

  // Load kategori
  useEffect(() => {
    const saved = localStorage.getItem("MP_CATEGORIES");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCategories(parsed);
        }
      } catch (e) {}
    }
  }, []);

  // Simpan kategori
  useEffect(() => {
    localStorage.setItem("MP_CATEGORIES", JSON.stringify(categories));
  }, [categories]);

  const handleAddCategory = (e) => {
    e.preventDefault();
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) return alert("Kategori sudah ada");
    setCategories((prev) => [...prev, trimmed]);
    setNewCategory("");
  };

  // HAPUS kategori + data detailnya
  const handleDeleteCategory = (cat) => {
    const ok = window.confirm(`Hapus kategori "${cat}"?`);
    if (!ok) return;

    setCategories((prev) => prev.filter((c) => c !== cat));

    const raw = localStorage.getItem("MP_CATEGORY_DATA");
    if (raw) {
      try {
        const all = JSON.parse(raw) || {};
        delete all[cat];
        localStorage.setItem("MP_CATEGORY_DATA", JSON.stringify(all));
      } catch (e) {}
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#f5f5f5",
      padding: "20px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },

    /* HEADER */
    header: {
      display: "flex",
      alignItems: "center",
      gap: "20px",
      marginBottom: "30px",
      background: "#fff",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
    },
    backButton: {
      background: "#f0f0f0",
      border: "none",
      padding: "10px 16px",
      borderRadius: "6px",
      cursor: "pointer",
    },
    title: { fontSize: "24px", fontWeight: "600" },

    /* CARD */
    mainContent: { maxWidth: "1200px", margin: "0 auto" },
    card: {
      background: "white",
      borderRadius: "8px",
      padding: "24px",
      marginBottom: "24px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    },
    sectionTitle: {
      fontSize: "16px",
      fontWeight: "bold",
      marginBottom: "16px",
    },

    /* GRID */
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      gap: "12px",
    },

    /* KATEGORI ITEM */
    categoryCard: {
      background: "white",
      border: "2px solid #444",
      borderRadius: "10px",
      padding: "14px 18px",
      fontSize: "15px",
      fontWeight: "500",
      position: "relative",
      cursor: "pointer",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      transition: "0.2s",
    },

    deleteIcon: {
      position: "absolute",
      top: "6px",
      right: "10px",
      fontSize: "16px",
      cursor: "pointer",
      color: "#ff4b4b",
      fontWeight: "bold",
      transition: "0.2s",
    },

    input: {
      flex: 1,
      padding: "10px 12px",
      borderRadius: "6px",
      border: "1px solid #ccc",
    },
    addBtn: {
      padding: "10px 16px",
      background: "#333",
      color: "white",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
    },
    formRow: {
      display: "flex",
      gap: "8px",
      flexWrap: "wrap",
    },
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <button style={styles.backButton} onClick={onCancel}>
          ← Kembali
        </button>

        <h1 style={styles.title}>
          {user?.name ? `${user.name} - Kategori` : "Kategori"}
        </h1>
      </div>

      {/* CONTENT */}
      <div style={styles.mainContent}>
        {/* LIST */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Daftar Kategori</h2>

          <div style={styles.grid}>
            {categories.map((cat, idx) => (
              <div
                key={idx}
                style={styles.categoryCard}
                onClick={() => onOpenCategory(cat)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#333";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "white";
                  e.currentTarget.style.color = "#333";
                }}
              >
                {/* ❌ DELETE ICON */}
                <span
                  style={styles.deleteIcon}
                  onClick={(e) => {
                    e.stopPropagation(); // supaya tidak masuk ke halaman kategori
                    handleDeleteCategory(cat);
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#e60000")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#ff4b4b")
                  }
                >
                  ❌
                </span>

                {cat}
              </div>
            ))}
          </div>
        </div>

        {/* ADD */}
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
