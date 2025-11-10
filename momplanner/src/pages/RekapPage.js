"use client";
import { useState } from "react";
import { apiSummary } from "../services/api";

export default function RekapPage({ onCancel }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1); // 1..12
  const [loading, setLoading] = useState(false);
  const [hoverBackBtn, setHoverBackBtn] = useState(false);
  const [hoverCancelBtn, setHoverCancelBtn] = useState(false);
  const [hoverSubmitBtn, setHoverSubmitBtn] = useState(false);

const [res, setRes] = useState(null);
const [msg, setMsg] = useState("");

// state untuk export PDF
const [exporting, setExporting] = useState(false);
const [hoverExportBtn, setHoverExportBtn] = useState(false);

// helper format tanggal singkat "Senin, November 2025"
function fmtTanggalSingkat(tgl) {
  const d = new Date(tgl);
  const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"][
    d.getDay()
  ];
  const bulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ][d.getMonth()];
  return `${hari}, ${bulan} ${d.getFullYear()}`;
}
function fmtRupiah(n) {
  return `Rp ${Number(n || 0).toLocaleString("id-ID")}`;
}

  const months = [
    { v: 1, n: "Januari" },
    { v: 2, n: "Februari" },
    { v: 3, n: "Maret" },
    { v: 4, n: "April" },
    { v: 5, n: "Mei" },
    { v: 6, n: "Juni" },
    { v: 7, n: "Juli" },
    { v: 8, n: "Agustus" },
    { v: 9, n: "September" },
    { v: 10, n: "Oktober" },
    { v: 11, n: "November" },
    { v: 12, n: "Desember" },
  ];

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
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
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
    title: { fontSize: "24px", fontWeight: "600", color: "#222", margin: 0 },
    formWrapper: {
      backgroundColor: "#ffffff",
      padding: "40px",
      borderRadius: "8px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      maxWidth: "600px",
      margin: "0 auto",
    },
    formGroup: { marginBottom: "24px" },
    label: {
      display: "block",
      fontSize: 14,
      fontWeight: 600,
      color: "#333",
      marginBottom: 8,
    },
    input: {
      width: "100%",
      padding: "12px",
      fontSize: 14,
      border: "1px solid #d0d0d0",
      borderRadius: 6,
      boxSizing: "border-box",
      color: "#333",
    },
    formActions: {
      display: "flex",
      gap: 12,
      justifyContent: "flex-end",
      marginTop: 32,
    },
    cancelButton: {
      backgroundColor: "#e0e0e0",
      border: "none",
      padding: "12px 24px",
      borderRadius: 6,
      cursor: "pointer",
      fontSize: 14,
      fontWeight: 600,
      color: "#333",
      transition: "all .2s ease",
    },
    submitButton: {
      backgroundColor: "#333",
      border: "none",
      padding: "12px 24px",
      borderRadius: 6,
      cursor: "pointer",
      fontSize: 14,
      fontWeight: 600,
      color: "#fff",
      transition: "all .2s ease",
    },
    exportButton: {
      backgroundColor: "#0f6",
      color: "#0b3d0b",
      border: "1px solid #0a0",
      padding: "10px 16px",
      borderRadius: 6,
      cursor: "pointer",
      fontSize: 14,
      fontWeight: 700,
      transition: "all .2s ease",
    },

    message: {
      marginTop: 16,
      padding: "12px 16px",
      borderRadius: 6,
      fontSize: 14,
      textAlign: "center",
    },
    messageError: {
      background: "#fef0f0",
      color: "#7d2626",
      border: "1px solid #f0d4d4",
    },
    cards: { marginTop: 20, display: "grid", gap: 12 },
    card: { border: "1px solid #eee", borderRadius: 8, padding: 16 },
    cardTitle: { marginBottom: 6, color: "#555" },
    cardValue: { fontSize: 24, fontWeight: 700 },
  };

  async function handleFetch(e) {
    e.preventDefault();
    setMsg("");
    setRes(null);
    setLoading(true);
    try {
      const data = await apiSummary(year, month);
      setRes(data);
    } catch (err) {
      setMsg(err.message || "Gagal mengambil ringkasan");
    } finally {
      setLoading(false);
    }
  }

  async function handleExportPDF() {
    if (!res) return;
    setExporting(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");

      const monthName = months.find((m) => m.v === month)?.n || String(month);
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const margin = 40;

      // Header
      doc.setFontSize(16);
      doc.text(`Rekap Bulanan ${monthName} ${year}`, margin, 40);

      // Ringkasan
      doc.setFontSize(11);
      let y = 70;
      doc.text(`Total Debet : ${fmtRupiah(res.totalDebet)}`, margin, y);
      y += 16;
      doc.text(`Total Kredit: ${fmtRupiah(res.totalKredit)}`, margin, y);
      y += 16;
      doc.text(`Selisih     : ${fmtRupiah(res.selisih)}`, margin, y);
      y += 20;

      // Tabel Debet
      autoTable(doc, {
        startY: y + 10,
        margin: { left: margin, right: margin },
        head: [["Tanggal", "Keterangan", "Uang (Rp)"]],
        body: (res.debetRows || []).map((r) => [
          fmtTanggalSingkat(r.tanggal),
          r.keterangan || "",
          Number(r.uang || 0).toLocaleString("id-ID"),
        ]),
        styles: { fontSize: 10, cellPadding: 4 },
        headStyles: { fillColor: [247, 247, 247], textColor: 20 },
        theme: "grid",
      });

      // Tabel Kredit
      const nextY = (doc.lastAutoTable?.finalY || y) + 20;
      autoTable(doc, {
        startY: nextY,
        margin: { left: margin, right: margin },
        head: [["Tanggal", "Keterangan", "Uang (Rp)"]],
        body: (res.kreditRows || []).map((r) => [
          fmtTanggalSingkat(r.tanggal),
          r.keterangan || "",
          Number(r.uang || 0).toLocaleString("id-ID"),
        ]),
        styles: { fontSize: 10, cellPadding: 4 },
        headStyles: { fillColor: [247, 247, 247], textColor: 20 },
        theme: "grid",
      });

      doc.save(`Rekap_${year}_${monthName}.pdf`);
    } catch (err) {
      alert(`Gagal membuat PDF: ${err.message || err}`);
    } finally {
      setExporting(false);
    }
  }


  return (
    <div style={styles.container}>
      {/* Header */}
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
        <h1 style={styles.title}>Rekap Bulanan</h1>
      </div>

      {/* Form Card */}
      <div style={styles.formWrapper}>
        <form onSubmit={handleFetch}>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div style={styles.formGroup}>
              <label style={styles.label}>Tahun</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                style={styles.input}
                required
                disabled={loading}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Bulan</label>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                style={styles.input}
                required
                disabled={loading}
              >
                {months.map((m) => (
                  <option key={m.v} value={m.v}>
                    {m.n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.formActions}>
            <button
              type="button"
              style={{
                ...styles.cancelButton,
                backgroundColor: hoverCancelBtn ? "#d0d0d0" : "#e0e0e0",
              }}
              onClick={onCancel}
              onMouseEnter={() => setHoverCancelBtn(true)}
              onMouseLeave={() => setHoverCancelBtn(false)}
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              style={{
                ...styles.submitButton,
                backgroundColor: hoverSubmitBtn ? "#1a1a1a" : "#333333",
              }}
              onMouseEnter={() => setHoverSubmitBtn(true)}
              onMouseLeave={() => setHoverSubmitBtn(false)}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  Menghitung…
                </>
              ) : (
                "Lihat Rekap"
              )}
            </button>
          </div>
        </form>

        {/* Error */}
        {msg && (
          <p style={{ ...styles.message, ...styles.messageError }}>
            Error: {msg}
          </p>
        )}

        {/* Hasil Rekap */}
        {res && (
          <>
            {/* Ringkasan angka */}
            <div style={styles.cards}>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Total Debet</div>
                <div style={styles.cardValue}>
                  Rp {Number(res.totalDebet || 0).toLocaleString("id-ID")}
                </div>
              </div>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Total Kredit</div>
                <div style={styles.cardValue}>
                  Rp {Number(res.totalKredit || 0).toLocaleString("id-ID")}
                </div>
              </div>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Selisih</div>
                <div style={styles.cardValue}>
                  Rp {Number(res.selisih || 0).toLocaleString("id-ID")}
                </div>
              </div>
            </div>

            {/* Tombol Download PDF */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: 12,
              }}
            >
              <button
                onClick={handleExportPDF}
                disabled={exporting}
                style={{
                  ...styles.exportButton,
                  backgroundColor: exporting
                    ? "#cfe"
                    : hoverExportBtn
                    ? "#0e8"
                    : "#0f6",
                  cursor: exporting ? "not-allowed" : "pointer",
                }}
                onMouseEnter={() => setHoverExportBtn(true)}
                onMouseLeave={() => setHoverExportBtn(false)}
              >
                {exporting ? "Menyusun PDF…" : "Download PDF"}
              </button>
            </div>

            {/* Tabel Debet */}
            <div style={{ marginTop: 24 }}>
              <h3 style={{ margin: "16px 0 8px", color: "#222" }}>
                Rincian Debet
              </h3>
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    background: "#fff",
                    fontSize: "12px", // ukuran font lebih kecil agar muat di layar HP
                  }}
                >
                  <thead>
                    <tr style={{ background: "#f7f7f7" }}>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "6px 4px", // padding lebih kecil
                          borderBottom: "1px solid #eee",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Tanggal
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "6px 4px",
                          borderBottom: "1px solid #eee",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Keterangan
                      </th>
                      <th
                        style={{
                          textAlign: "right",
                          padding: "6px 4px",
                          borderBottom: "1px solid #eee",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Uang (Rp)
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {(res.debetRows || []).map((r, i) => (
                      <tr key={`d-${i}`}>
                        <td
                          style={{
                            padding: "6px 4px",
                            borderBottom: "1px solid #f0f0f0",
                            wordBreak: "break-word",
                          }}
                        >
                          {(() => {
                            const dateObj = new Date(r.tanggal);
                            const hariList = [
                              "Minggu",
                              "Senin",
                              "Selasa",
                              "Rabu",
                              "Kamis",
                              "Jumat",
                              "Sabtu",
                            ];
                            const bulanList = [
                              "Januari",
                              "Februari",
                              "Maret",
                              "April",
                              "Mei",
                              "Juni",
                              "Juli",
                              "Agustus",
                              "September",
                              "Oktober",
                              "November",
                              "Desember",
                            ];
                            const hari = hariList[dateObj.getDay()];
                            const bulan = bulanList[dateObj.getMonth()];
                            const tahun = dateObj.getFullYear();
                            return `${hari}, ${bulan} ${tahun}`;
                          })()}
                        </td>

                        <td
                          style={{
                            padding: 10,
                            borderBottom: "1px solid #f0f0f0",
                          }}
                        >
                          {r.keterangan}
                        </td>
                        <td
                          style={{
                            padding: 10,
                            borderBottom: "1px solid #f0f0f0",
                            textAlign: "right",
                          }}
                        >
                          {Number(r.uang || 0).toLocaleString("id-ID")}
                        </td>
                      </tr>
                    ))}
                    {(!res.debetRows || res.debetRows.length === 0) && (
                      <tr>
                        <td colSpan={3} style={{ padding: 10, color: "#666" }}>
                          Tidak ada data
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tabel Kredit */}
            <div style={{ marginTop: 24 }}>
              <h3 style={{ margin: "16px 0 8px", color: "#222" }}>
                Rincian Kredit
              </h3>
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    background: "#fff",
                    fontSize: "12px", // ukuran font lebih kecil agar muat di layar HP
                  }}
                >
                  <thead>
                    <tr style={{ background: "#f7f7f7" }}>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "6px 4px", // padding lebih kecil
                          borderBottom: "1px solid #eee",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Tanggal
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "6px 4px",
                          borderBottom: "1px solid #eee",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Keterangan
                      </th>
                      <th
                        style={{
                          textAlign: "right",
                          padding: "6px 4px",
                          borderBottom: "1px solid #eee",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Uang (Rp)
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {(res.kreditRows || []).map((r, i) => (
                      <tr key={`k-${i}`}>
                        <td
                          style={{
                            padding: "6px 4px",
                            borderBottom: "1px solid #f0f0f0",
                            wordBreak: "break-word",
                          }}
                        >
                          {(() => {
                            const dateObj = new Date(r.tanggal);
                            const hariList = [
                              "Minggu",
                              "Senin",
                              "Selasa",
                              "Rabu",
                              "Kamis",
                              "Jumat",
                              "Sabtu",
                            ];
                            const bulanList = [
                              "Januari",
                              "Februari",
                              "Maret",
                              "April",
                              "Mei",
                              "Juni",
                              "Juli",
                              "Agustus",
                              "September",
                              "Oktober",
                              "November",
                              "Desember",
                            ];
                            const hari = hariList[dateObj.getDay()];
                            const bulan = bulanList[dateObj.getMonth()];
                            const tahun = dateObj.getFullYear();
                            return `${hari}, ${bulan} ${tahun}`;
                          })()}
                        </td>

                        <td
                          style={{
                            padding: 10,
                            borderBottom: "1px solid #f0f0f0",
                          }}
                        >
                          {r.keterangan}
                        </td>
                        <td
                          style={{
                            padding: 10,
                            borderBottom: "1px solid #f0f0f0",
                            textAlign: "right",
                          }}
                        >
                          {Number(r.uang || 0).toLocaleString("id-ID")}
                        </td>
                      </tr>
                    ))}
                    {(!res.kreditRows || res.kreditRows.length === 0) && (
                      <tr>
                        <td colSpan={3} style={{ padding: 10, color: "#666" }}>
                          Tidak ada data
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Spinner CSS */}
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spinner{
          width:16px;height:16px;border:2px solid #fff;
          border-top-color: transparent;border-radius:50%;
          display:inline-block;margin-right:8px;vertical-align:middle;
          animation: spin .8s linear infinite;
        }
      `}</style>
    </div>
  );
}
