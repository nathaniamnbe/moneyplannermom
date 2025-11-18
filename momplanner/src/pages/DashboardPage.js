"use client";

import { useEffect, useState } from "react";
import {
  apiGetKategoriList,
  apiAddKategori,
  apiWriteKategori,
} from "../services/api";

function DashboardPage({ user, transactions = [], onNavigate, onLogout }) {
  const totalDebet = (transactions || [])
    .filter((t) => t.type === "debet")
    .reduce((sum, t) => sum + Number.parseFloat(t.amount || 0), 0);

  const totalKredit = (transactions || [])
    .filter((t) => t.type === "kredit")
    .reduce((sum, t) => sum + Number.parseFloat(t.amount || 0), 0);

  const netBalance = totalDebet - totalKredit;

  // ====== STATE KATEGORI ======
  const [kategoriList, setKategoriList] = useState([]);
  const [selectedKategori, setSelectedKategori] = useState("");
  const [katDescription, setKatDescription] = useState("");
  const [katAmount, setKatAmount] = useState("");
  const [showKategori, setShowKategori] = useState(false);
  const [isSavingKategori, setIsSavingKategori] = useState(false);
  const [newKategoriName, setNewKategoriName] = useState("");
  const [isAddingKategori, setIsAddingKategori] = useState(false);

  // Load list kategori dari Apps Script
  useEffect(() => {
    async function loadKategori() {
      try {
        const list = await apiGetKategoriList();
        if (list && list.length > 0) {
          setKategoriList(list);
        } else {
          // kalau belum ada di sheet, isi default 4 kategori
          const defaults = ["Hp dde", "Maria", "Asuransi cce", "Tabungan cool"];
          const created = [];
          for (const nm of defaults) {
            await apiAddKategori(nm);
            created.push(nm);
          }
          setKategoriList(created);
        }
      } catch (err) {
        console.error("Gagal memuat kategori:", err);
      }
    }
    loadKategori();
  }, []);

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
    logoutBtn: {
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
    summaryGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "24px",
      marginBottom: "32px",
    },
    card: {
      background: "white",
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
      padding: "24px",
    },
    cardLabel: {
      fontSize: "13px",
      fontWeight: "500",
      color: "#666",
      marginBottom: "8px",
    },
    cardAmount: {
      fontSize: "28px",
      fontWeight: "bold",
      color: "#333",
      margin: "0",
    },
    buttonGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
      gap: "12px",
      marginBottom: "32px",
    },
    btn: {
      padding: "16px",
      border: "none",
      borderRadius: "8px",
      fontSize: "15px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    btnPrimary: {
      background: "#333",
      color: "white",
    },
    btnSecondary: {
      background: "white",
      color: "#333",
      border: "2px solid #333",
    },
    transactionsContainer: {
      background: "white",
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
      overflow: "hidden",
    },
    transactionsHeader: {
      padding: "16px 24px",
      borderBottom: "1px solid #e0e0e0",
    },
    transactionsTitle: {
      fontSize: "16px",
      fontWeight: "bold",
      color: "#333",
      margin: "0",
    },
    transactionsList: {
      display: "flex",
      flexDirection: "column",
    },
    transactionItem: {
      padding: "16px 24px",
      borderBottom: "1px solid #e0e0e0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      transition: "background 0.2s ease",
    },
    transactionInfo: {
      flex: "1",
    },
    transactionDesc: {
      fontSize: "14px",
      fontWeight: "500",
      color: "#333",
      margin: "0 0 4px 0",
    },
    transactionDate: {
      fontSize: "12px",
      color: "#999",
      margin: "0",
    },
    transactionAmount: {
      fontSize: "15px",
      fontWeight: "bold",
      color: "#333",
      textAlign: "right",
    },

    // ====== STYLE KATEGORI ======
    kategoriSection: {
      marginTop: "16px",
      padding: "20px",
      background: "white",
      borderRadius: "8px",
      border: "1px solid #e0e0e0",
    },
    kategoriButtonsRow: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      marginBottom: "12px",
    },
    kategoriChip: {
      padding: "8px 12px",
      borderRadius: "999px",
      border: "1px solid #333",
      background: "white",
      fontSize: "13px",
      cursor: "pointer",
    },
    kategoriChipActive: {
      background: "#333",
      color: "white",
    },
    kategoriFormRow: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      marginTop: "8px",
    },
    kategoriInput: {
      padding: "8px 10px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      fontSize: "14px",
    },
    kategoriSubmitBtn: {
      marginTop: "4px",
      alignSelf: "flex-start",
      padding: "8px 16px",
      borderRadius: "6px",
      border: "none",
      background: "#16a34a",
      color: "white",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: 600,
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerWrapper}>
        <div style={styles.headerInner}>
          <div style={styles.headerContent}>
            <h1 style={styles.title}>{user?.name || "PEMBUKUAN"}</h1>
            <button
              onClick={onLogout}
              style={styles.logoutBtn}
              onMouseEnter={(e) => (e.target.style.background = "#ff6b6b")}
              onMouseLeave={(e) => (e.target.style.background = "#333")}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div style={styles.mainContent}>
        {/* (optional) ringkasan saldo bisa ditampilkan lagi nanti pakai totalDebet, totalKredit, netBalance */}

        <div style={styles.buttonGrid}>
          <button
            onClick={() => onNavigate("debet")}
            style={{ ...styles.btn, ...styles.btnSecondary }}
            onMouseEnter={(e) => {
              e.target.style.background = "#333";
              e.target.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "white";
              e.target.style.color = "#333";
            }}
          >
            + Debet
          </button>

          <button
            onClick={() => onNavigate("kredit")}
            style={{ ...styles.btn, ...styles.btnPrimary }}
            onMouseEnter={(e) => (e.target.style.background = "#222")}
            onMouseLeave={(e) => (e.target.style.background = "#333")}
          >
            - Kredit
          </button>

          <button
            onClick={() => onNavigate("rekap")}
            style={{ ...styles.btn, ...styles.btnSecondary }}
            onMouseEnter={(e) => {
              e.target.style.background = "#333";
              e.target.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "white";
              e.target.style.color = "#333";
            }}
          >
            Rekap Bulanan
          </button>

          {/* Tombol untuk membuka section kategori */}
          <button
            onClick={() => setShowKategori((prev) => !prev)}
            style={{ ...styles.btn, ...styles.btnSecondary }}
            onMouseEnter={(e) => {
              e.target.style.background = "#333";
              e.target.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "white";
              e.target.style.color = "#333";
            }}
          >
            Kategori
          </button>
        </div>

        {/* SECTION KATEGORI */}
        {showKategori && (
          <div style={styles.kategoriSection}>
            <h2 style={{ fontSize: 16, margin: "0 0 4px 0" }}>Kategori</h2>
            <p
              style={{
                fontSize: 12,
                color: "#666",
                margin: "0 0 10px 0",
              }}
            >
              Pilih kategori, lalu isi keterangan dan jumlah. Data akan
              tersimpan ke sheet kategori di Google Sheets.
            </p>

            <div style={styles.kategoriButtonsRow}>
              {kategoriList.map((nm) => (
                <button
                  key={nm}
                  type="button"
                  onClick={() => setSelectedKategori(nm)}
                  style={{
                    ...styles.kategoriChip,
                    ...(selectedKategori === nm
                      ? styles.kategoriChipActive
                      : {}),
                  }}
                >
                  {nm}
                </button>
              ))}
            </div>

            {/* Form input data kategori */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!selectedKategori) {
                  alert("Pilih kategori dulu.");
                  return;
                }
                try {
                  setIsSavingKategori(true);
                  await apiWriteKategori({
                    name: selectedKategori,
                    description: katDescription,
                    amount: katAmount,
                  });
                  setKatDescription("");
                  setKatAmount("");
                  alert("Data kategori tersimpan.");
                } catch (err) {
                  alert(err.message || "Gagal menyimpan data kategori.");
                } finally {
                  setIsSavingKategori(false);
                }
              }}
            >
              <div style={styles.kategoriFormRow}>
                <input
                  style={styles.kategoriInput}
                  placeholder="Keterangan"
                  value={katDescription}
                  onChange={(e) => setKatDescription(e.target.value)}
                />
                <input
                  style={styles.kategoriInput}
                  placeholder="Jumlah (Rp)"
                  type="number"
                  value={katAmount}
                  onChange={(e) => setKatAmount(e.target.value)}
                />
                <button
                  type="submit"
                  style={styles.kategoriSubmitBtn}
                  disabled={isSavingKategori}
                >
                  {isSavingKategori ? "Menyimpan..." : "Simpan ke Kategori"}
                </button>
              </div>
            </form>

            <hr style={{ margin: "16px 0" }} />

            {/* Form tambah kategori baru */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const nm = newKategoriName.trim();
                if (!nm) return;
                try {
                  setIsAddingKategori(true);
                  await apiAddKategori(nm);
                  setKategoriList((prev) =>
                    prev.includes(nm) ? prev : [...prev, nm]
                  );
                  setSelectedKategori(nm);
                  setNewKategoriName("");
                } catch (err) {
                  alert(err.message || "Gagal menambah kategori.");
                } finally {
                  setIsAddingKategori(false);
                }
              }}
            >
              <div style={styles.kategoriFormRow}>
                <input
                  style={styles.kategoriInput}
                  placeholder="Tambah kategori baru..."
                  value={newKategoriName}
                  onChange={(e) => setNewKategoriName(e.target.value)}
                />
                <button
                  type="submit"
                  style={{
                    ...styles.kategoriSubmitBtn,
                    background: "#2563eb",
                  }}
                  disabled={isAddingKategori}
                >
                  {isAddingKategori ? "Menambah..." : "Tambah Kategori"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Riwayat transaksi lama tetap seperti sebelumnya */}
        {transactions.length > 0 && (
          <div style={styles.transactionsContainer}>
            <div style={styles.transactionsHeader}>
              <h2 style={styles.transactionsTitle}>Riwayat Transaksi</h2>
            </div>
            <div style={styles.transactionsList}>
              {transactions.map((transaction, index) => (
                <div
                  key={index}
                  style={styles.transactionItem}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#fafafa")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "white")
                  }
                >
                  <div style={styles.transactionInfo}>
                    <p style={styles.transactionDesc}>
                      {transaction.description}
                    </p>
                    <p style={styles.transactionDate}>{transaction.date}</p>
                  </div>
                  <p style={styles.transactionAmount}>
                    {transaction.type === "debet" ? "+" : "-"} Rp
                    {Number.parseFloat(transaction.amount).toLocaleString(
                      "id-ID"
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
