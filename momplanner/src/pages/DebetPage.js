"use client";
import { useState } from "react";
import { apiWrite } from "../services/api";

function DebetPage({ type = "debet", user, onCancel, onDone }) {
  const [dateStr, setDateStr] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

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
      "&:hover": {
        backgroundColor: "#e0e0e0",
      },
    },
    title: {
      fontSize: "24px",
      fontWeight: "600",
      color: "#222222",
      margin: "0",
    },
    formWrapper: {
      backgroundColor: "#ffffff",
      padding: "40px",
      borderRadius: "8px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      maxWidth: "600px",
      margin: "0 auto",
    },
    formGroup: {
      marginBottom: "24px",
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "600",
      color: "#333333",
      marginBottom: "8px",
    },
    input: {
      width: "100%",
      padding: "12px",
      fontSize: "14px",
      border: "1px solid #d0d0d0",
      borderRadius: "6px",
      boxSizing: "border-box",
      color: "#333333",
      transition: "border-color 0.2s ease",
    },
    formActions: {
      display: "flex",
      gap: "12px",
      justifyContent: "flex-end",
      marginTop: "32px",
    },
    cancelButton: {
      backgroundColor: "#e0e0e0",
      border: "none",
      padding: "12px 24px",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "600",
      color: "#333333",
      transition: "all 0.2s ease",
    },
    submitButton: {
      backgroundColor: "#333333",
      border: "none",
      padding: "12px 24px",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "600",
      color: "#ffffff",
      transition: "all 0.2s ease",
    },
    message: {
      marginTop: "16px",
      padding: "12px 16px",
      borderRadius: "6px",
      fontSize: "14px",
      textAlign: "center",
    },
    messageSuccess: {
      backgroundColor: "#f0f9f0",
      color: "#2d5016",
      border: "1px solid #d4e8d4",
    },
    messageError: {
      backgroundColor: "#fef0f0",
      color: "#7d2626",
      border: "1px solid #f0d4d4",
    },
  };

  const formatDateToDDMMYYYY = (iso) => {
    const [y, m, d] = iso.split("-");
    return `${d}-${m}-${y}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const fullDate = formatDateToDDMMYYYY(dateStr);
      await apiWrite({
        type,
        date: fullDate,
        description,
        amount,
        user,
        password: user._pw,
      });
      setMsg("Tersimpan ke Spreadsheet!");
      setDateStr("");
      setDescription("");
      setAmount("");
      if (onDone) onDone();
    } catch (err) {
      setMsg("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const [hoverBackBtn, setHoverBackBtn] = useState(false);
  const [hoverCancelBtn, setHoverCancelBtn] = useState(false);
  const [hoverSubmitBtn, setHoverSubmitBtn] = useState(false);
  const [focusDateInput, setFocusDateInput] = useState(false);

  return (
    <div style={styles.container}>
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
          {type === "debet" ? "Input Debet" : "Input Kredit"}
        </h1>
      </div>

      <div style={styles.formWrapper}>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Tanggal</label>
            <input
              type="date"
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
              style={{
                ...styles.input,
                borderColor: focusDateInput ? "#999999" : "#d0d0d0",
              }}
              onFocus={() => setFocusDateInput(true)}
              onBlur={() => setFocusDateInput(false)}
              required
              disabled={loading}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Keterangan</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={styles.input}
              required
              disabled={loading}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Jumlah (Rp)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={styles.input}
              required
              disabled={loading}
            />
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
                  Menyimpan…
                </>
              ) : (
                "Simpan"
              )}
            </button>
          </div>
        </form>

        {msg && (
          <p
            style={{
              ...styles.message,
              ...(msg.includes("Error")
                ? styles.messageError
                : styles.messageSuccess),
            }}
          >
            {msg}
          </p>
        )}
      </div>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spinner{
          width:16px;
          height:16px;
          border:2px solid #fff;
          border-top-color: transparent;
          border-radius:50%;
          display:inline-block;
          margin-right:8px;
          vertical-align:middle;
          animation: spin .8s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default DebetPage;
