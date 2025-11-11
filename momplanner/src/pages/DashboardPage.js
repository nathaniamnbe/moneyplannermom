"use client";
import { useMemo } from "react";

function DashboardPage({ user, transactions = [], onNavigate, onLogout }) {
  const totalDebet = (transactions || [])
    .filter((t) => t.type === "debet")
    .reduce((sum, t) => sum + Number.parseFloat(t.amount || 0), 0);

  const totalKredit = (transactions || [])
    .filter((t) => t.type === "kredit")
    .reduce((sum, t) => sum + Number.parseFloat(t.amount || 0), 0);

  const netBalance = totalDebet - totalKredit;

  const rows = useMemo(() => {
    const safe = Array.isArray(transactions) ? transactions : [];
    // urutkan desc by date (fallback jika yyyy-mm-dd/ dd-mm-yyyy)
    const toKey = (d) => {
      if (!d) return 0;
      const [a, b, c] = d.split(/[\/\-\.]/).map(Number);
      // deteksi format sederhana
      if (String(a).length === 4)
        return new Date(a, (b || 1) - 1, c || 1).getTime();
      return new Date(c || 2000, (b || 1) - 1, a || 1).getTime();
    };
    return [...safe].sort((x, y) => toKey(y.date) - toKey(x.date)).slice(0, 20);
  }, [transactions]);

  const styles = {
    container: {
      minHeight: "100vh",
      padding: "20px",
      background: "#f5f5f5",
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    },
    headerWrapper: { borderBottom: "1px solid #e0e0e0", background: "white" },
    headerInner: { maxWidth: "1200px", margin: "0 auto", padding: "24px 16px" },
    headerContent: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    title: { fontSize: "24px", fontWeight: "bold", color: "#333", margin: 0 },
    logoutBtn: {
      padding: "8px 16px",
      background: "#333",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "13px",
      fontWeight: 500,
      transition: "all .2s",
    },
    mainContent: { maxWidth: "1200px", margin: "0 auto", padding: "32px 16px" },
    summaryGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
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
      fontWeight: 500,
      color: "#666",
      marginBottom: "8px",
    },
    cardAmount: {
      fontSize: "28px",
      fontWeight: "bold",
      color: "#333",
      margin: 0,
    },
    buttonGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
      gap: "12px",
      marginBottom: "24px",
    },
    btn: {
      padding: "16px",
      border: "none",
      borderRadius: "8px",
      fontSize: "15px",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all .2s",
    },
    btnPrimary: { background: "#333", color: "white" },
    btnSecondary: {
      background: "white",
      color: "#333",
      border: "2px solid #333",
    },
    tableWrap: {
      background: "white",
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
      overflow: "hidden",
    },
    tableHeader: { padding: "16px 24px", borderBottom: "1px solid #e0e0e0" },
    tableTitle: {
      fontSize: "16px",
      fontWeight: "bold",
      color: "#333",
      margin: 0,
    },
    table: { width: "100%", borderCollapse: "collapse" },
    th: {
      textAlign: "left",
      fontSize: "13px",
      color: "#666",
      padding: "12px 16px",
      borderBottom: "1px solid #eee",
      background: "#fafafa",
    },
    td: {
      fontSize: "14px",
      color: "#333",
      padding: "14px 16px",
      borderBottom: "1px solid #f0f0f0",
    },
    pill: (bg, color) => ({
      display: "inline-block",
      padding: "2px 10px",
      borderRadius: "999px",
      fontSize: "12px",
      fontWeight: 600,
      background: bg,
      color,
    }),
    empty: { padding: "18px 16px", fontSize: "14px", color: "#888" },
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
        <div style={styles.summaryGrid}>
          <div style={styles.card}>
            <p style={styles.cardLabel}>Total Debet</p>
            <p style={styles.cardAmount}>
              Rp {totalDebet.toLocaleString("id-ID")}
            </p>
          </div>
          <div style={styles.card}>
            <p style={styles.cardLabel}>Total Kredit</p>
            <p style={styles.cardAmount}>
              Rp {totalKredit.toLocaleString("id-ID")}
            </p>
          </div>
          <div style={styles.card}>
            <p style={styles.cardLabel}>Saldo Bersih</p>
            <p style={styles.cardAmount}>
              Rp {netBalance.toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        <div style={styles.buttonGrid}>
          <button
            onClick={() => onNavigate("debet")}
            style={{ ...styles.btn, ...styles.btnSecondary }}
            onMouseEnter={(e) => {
              e.target.style.background = "#333";
              e.target.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#fff";
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
              e.target.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#fff";
              e.target.style.color = "#333";
            }}
          >
            Rekap Bulanan
          </button>
        </div>

        {/* === TABEL RIWAYAT === */}
        <div style={styles.tableWrap}>
          <div style={styles.tableHeader}>
            <h2 style={styles.tableTitle}>Riwayat Transaksi Terbaru</h2>
          </div>
          {rows.length === 0 ? (
            <div style={styles.empty}>Belum ada transaksi.</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Tanggal</th>
                  <th style={styles.th}>Keterangan</th>
                  <th style={styles.th}>Tipe</th>
                  <th style={styles.th} align="right">
                    Jumlah
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((t, i) => (
                  <tr key={i}>
                    <td style={styles.td}>{t.date || "-"}</td>
                    <td style={styles.td}>{t.description || "-"}</td>
                    <td style={styles.td}>
                      <span
                        style={styles.pill(
                          t.type === "debet" ? "#e8f5e9" : "#ffebee",
                          t.type === "debet" ? "#1b5e20" : "#b71c1c"
                        )}
                      >
                        {t.type === "debet" ? "Debet" : "Kredit"}
                      </span>
                    </td>
                    <td
                      style={{
                        ...styles.td,
                        textAlign: "right",
                        fontWeight: 700,
                      }}
                    >
                      {t.type === "debet" ? "+" : "-"} Rp{" "}
                      {Number(t.amount || 0).toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
