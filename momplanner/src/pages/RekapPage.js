"use client";
import { useState } from "react";
import { apiSummary, apiDelete } from "../services/api";


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

  // status animasi hapus
  const [deletingKey, setDeletingKey] = useState(null); // contoh: "debet-42" / "kredit-7"

  // state untuk export PDF
  const [exporting, setExporting] = useState(false);
  const [hoverExportBtn, setHoverExportBtn] = useState(false);

  // helper format tanggal singkat "Senin, November 2025"
  // === Parser tanggal aman untuk semua device ===
  function parseTanggal(str) {
    if (!str) return null;
    const s = String(str).trim();

    // yyyy-mm-dd
    let m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return new Date(+m[1], +m[2] - 1, +m[3]);

    // dd/mm/yyyy atau dd-mm-yyyy
    m = s.match(/^(\d{2})[\/-](\d{2})[\/-](\d{4})/);
    if (m) return new Date(+m[3], +m[2] - 1, +m[1]);

    const d = new Date(s);
    return isNaN(d) ? null : d;
  }

  // helper format tanggal singkat "Senin, November 2025"
function fmtTanggalAngka(tgl) {
  const d = parseTanggal(tgl);
  if (!d) return String(tgl || "");
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
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
      // Header
      const pageWidth = doc.internal.pageSize.getWidth();
      doc.setFontSize(18);
      doc.setFont(undefined, "bold");
      doc.text(`Rekap Bulanan ${monthName} ${year}`, pageWidth / 2, 40, {
        align: "center",
      });
      doc.setFont(undefined, "normal");

      /** ===== Ringkasan 1×3 (Total Debet / Total Kredit / Selisih) ===== */
      const summaryHead = [["Total Debet", "Total Kredit", "Selisih"]];
      const summaryBody = [
        [
          fmtRupiah(res.totalDebet),
          fmtRupiah(res.totalKredit),
          fmtRupiah(res.selisih),
        ],
      ];
      autoTable(doc, {
        startY: 56,
        margin: { left: margin, right: margin },
        head: summaryHead,
        body: summaryBody,
        theme: "grid",
        styles: { fontSize: 12, cellPadding: 8 },
        headStyles: {
          fontSize: 12,
          fontStyle: "bold",
          fillColor: [245, 245, 245],
          textColor: 20,
          halign: "center",
        },
        bodyStyles: { fontSize: 16, fontStyle: "bold", halign: "center" }, // angka lebih besar & rata tengah
        columnStyles: {
          0: { halign: "center" },
          1: { halign: "center" },
          2: { halign: "center" },
        },
      });

      let currY = (doc.lastAutoTable?.finalY || 80) + 18;

      /** ===== Judul & Tabel Debet ===== */
      doc.setFontSize(14);
      doc.setFont(undefined, "bold");
      doc.text("Tabel Debet", margin, currY);
      doc.setFont(undefined, "normal");
      currY += 10;

      autoTable(doc, {
        startY: currY,
        margin: { left: margin, right: margin },
        head: [["Tanggal", "Keterangan", "Uang (Rp)"]],
        body: (res.debetRows || []).map((r) => [
          fmtTanggalAngka(r.tanggal),
          r.keterangan || "",
          Number(r.uang || 0).toLocaleString("id-ID"),
        ]),

        theme: "grid",
        styles: { fontSize: 10, cellPadding: 4 },
        headStyles: { fillColor: [247, 247, 247], textColor: 20 },
        columnStyles: {
          0: { cellWidth: 170 },
          1: { cellWidth: "auto" },
          2: { halign: "right", cellWidth: 100 },
        },
      });

      currY = (doc.lastAutoTable?.finalY || currY) + 20;

      /** ===== Judul & Tabel Kredit ===== */
      doc.setFontSize(14);
      doc.setFont(undefined, "bold");
      doc.text("Tabel Kredit", margin, currY);
      doc.setFont(undefined, "normal");
      currY += 10;

      autoTable(doc, {
        startY: currY,
        margin: { left: margin, right: margin },
        head: [["Tanggal", "Keterangan", "Uang (Rp)"]],
        body: (res.kreditRows || []).map((r) => [
          fmtTanggalAngka(r.tanggal),
          r.keterangan || "",
          Number(r.uang || 0).toLocaleString("id-ID"),
        ]),

        theme: "grid",
        styles: { fontSize: 10, cellPadding: 4 },
        headStyles: { fillColor: [247, 247, 247], textColor: 20 },
        columnStyles: {
          0: { cellWidth: 170 },
          1: { cellWidth: "auto" },
          2: { halign: "right", cellWidth: 100 },
        },
      });

      doc.save(`Rekap_${year}_${monthName}.pdf`);
    } catch (err) {
      window.alert(`Gagal membuat PDF: ${err.message || err}`);
    } finally {
      setExporting(false);
    }
  }

  // Ambil ulang summary (dipanggil setelah delete)
  async function reloadSummary() {
    setLoading(true);
    setMsg("");
    try {
      const data = await apiSummary(year, month);
      setRes(data);
    } catch (err) {
      setMsg(err.message || "Gagal mengambil ringkasan");
    } finally {
      setLoading(false);
    }
  }

  // Hapus 1 baris (debet/kredit)
  async function handleDelete(type, rowOrId) {
    const id = typeof rowOrId === "number" ? rowOrId : rowOrId?.id ?? null;
    const key = `${type}-${id ?? "x"}`;
    setDeletingKey(key);
    try {
      const isNumber = typeof rowOrId === "number";
      await apiDelete({
        type,
        rowIndex: isNumber ? rowOrId : rowOrId?.id ?? null,
        year,
        month,
        tanggal: isNumber ? null : rowOrId?.tanggal,
        uang: isNumber ? null : rowOrId?.uang,
        keterangan: isNumber ? null : rowOrId?.keterangan,
      });
      await reloadSummary();
    } catch (e) {
      window.alert(e.message || "Gagal menghapus baris.");
    } finally {
      setDeletingKey(null);
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
                          padding: "6px 4px",
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
                      <th
                        style={{
                          textAlign: "center",
                          padding: "6px 4px",
                          borderBottom: "1px solid #eee",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Aksi
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
                          {fmtTanggalAngka(r.tanggal)}
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
                        <td
                          style={{
                            padding: 10,
                            borderBottom: "1px solid #f0f0f0",
                            textAlign: "center",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <button
                            onClick={() => handleDelete("debet", r)}
                            style={{
                              background: "#fef2f2",
                              color: "#b91c1c",
                              border: "1px solid #fecaca",
                              padding: "4px 8px",
                              borderRadius: 6,
                              cursor:
                                deletingKey === `debet-${r.id}`
                                  ? "wait"
                                  : "pointer",
                              fontSize: 12,
                              fontWeight: 600,
                              opacity:
                                deletingKey === `debet-${r.id}` ? 0.6 : 1,
                              transition: "opacity 0.3s ease",
                            }}
                            title="Hapus baris ini"
                            disabled={deletingKey === `debet-${r.id}`}
                          >
                            {deletingKey === `debet-${r.id}` ? (
                              <>
                                <span
                                  style={{
                                    display: "inline-block",
                                    width: "12px",
                                    height: "12px",
                                    border: "2px solid #b91c1c",
                                    borderTopColor: "transparent",
                                    borderRadius: "50%",
                                    marginRight: 6,
                                    animation: "spin 0.8s linear infinite",
                                  }}
                                />
                                Menghapus...
                              </>
                            ) : (
                              "Hapus"
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {(!res.debetRows || res.debetRows.length === 0) && (
                      <tr>
                        <td colSpan={4} style={{ padding: 10, color: "#666" }}>
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
                          padding: "6px 4px",
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
                      <th
                        style={{
                          textAlign: "center",
                          padding: "6px 4px",
                          borderBottom: "1px solid #eee",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Aksi
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
                          {fmtTanggalAngka(r.tanggal)}
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
                        <td
                          style={{
                            padding: 10,
                            borderBottom: "1px solid #f0f0f0",
                            textAlign: "center",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <button
                            onClick={() => handleDelete("kredit", r)}
                            style={{
                              background: "#fef2f2",
                              color: "#b91c1c",
                              border: "1px solid #fecaca",
                              padding: "4px 8px",
                              borderRadius: 6,
                              cursor:
                                deletingKey === `kredit-${r.id}`
                                  ? "wait"
                                  : "pointer",
                              fontSize: 12,
                              fontWeight: 600,
                              opacity:
                                deletingKey === `kredit-${r.id}` ? 0.6 : 1,
                              transition: "opacity 0.3s ease",
                            }}
                            title="Hapus baris ini"
                            disabled={deletingKey === `kredit-${r.id}`}
                          >
                            {deletingKey === `kredit-${r.id}` ? (
                              <>
                                <span
                                  style={{
                                    display: "inline-block",
                                    width: "12px",
                                    height: "12px",
                                    border: "2px solid #b91c1c",
                                    borderTopColor: "transparent",
                                    borderRadius: "50%",
                                    marginRight: 6,
                                    animation: "spin 0.8s linear infinite",
                                  }}
                                />
                                Menghapus...
                              </>
                            ) : (
                              "Hapus"
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {(!res.kreditRows || res.kreditRows.length === 0) && (
                      <tr>
                        <td colSpan={4} style={{ padding: 10, color: "#666" }}>
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
