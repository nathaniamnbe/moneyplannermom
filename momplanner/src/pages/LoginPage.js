"use client";
import { useState } from "react";
import { apiLogin } from "../services/api";

function LoginPage({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#f5f5f5",
      padding: "20px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    card: {
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
      padding: "40px",
      width: "100%",
      maxWidth: "420px",
    },
    title: {
      fontSize: "28px",
      fontWeight: "700",
      color: "#1a1a1a",
      margin: "0 0 8px 0",
      textAlign: "center",
    },
    subtitle: {
      fontSize: "14px",
      color: "#888",
      margin: "0 0 32px 0",
      textAlign: "center",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    label: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#333",
    },
    input: {
      padding: "12px",
      fontSize: "14px",
      border: "1px solid #ddd",
      borderRadius: "6px",
      fontFamily: "inherit",
      transition: "all 0.3s ease",
      backgroundColor: "#f9f9f9",
      color: "#333",
      outline: "none",
    },
    inputFocus: {
      borderColor: "#333",
      backgroundColor: "white",
      boxShadow: "0 0 0 3px rgba(0, 0, 0, 0.05)",
    },
    button: {
      padding: "12px",
      fontSize: "15px",
      fontWeight: "600",
      backgroundColor: "#333",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "8px",
      marginTop: "8px",
    },
    buttonHover: {
      backgroundColor: "#555",
    },
    buttonDisabled: {
      backgroundColor: "#aaa",
      cursor: "not-allowed",
    },
    spinner: {
      width: "16px",
      height: "16px",
      border: "2px solid rgba(255, 255, 255, 0.3)",
      borderTop: "2px solid white",
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
    },
    errorText: {
      color: "#d32f2f",
      fontSize: "13px",
      marginTop: "12px",
      padding: "10px 12px",
      backgroundColor: "#ffebee",
      borderRadius: "6px",
      margin: "16px 0 0 0",
    },
  };

  const [focusedInput, setFocusedInput] = useState(null);
  const [buttonHovered, setButtonHovered] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    try {
      setError("");
      setLoading(true);
      const u = await apiLogin(username, password);
const session = { ...u, password }; // ubah `_pw` jadi `password`
localStorage.setItem("MP_USER", JSON.stringify(session));
setUser(session);

    } catch (err) {
      setError(err.message || "Gagal masuk");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>💰 Money Planner</h1>
          <p style={styles.subtitle}>Kelola Keuangan dengan Mudah</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
                style={{
                  ...styles.input,
                  ...(focusedInput === "username" ? styles.inputFocus : {}),
                }}
                onFocus={() => setFocusedInput("username")}
                onBlur={() => setFocusedInput(null)}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                style={{
                  ...styles.input,
                  ...(focusedInput === "password" ? styles.inputFocus : {}),
                }}
                onFocus={() => setFocusedInput("password")}
                onBlur={() => setFocusedInput(null)}
              />
            </div>

            <button
              type="submit"
              style={{
                ...styles.button,
                ...(buttonHovered && !loading ? styles.buttonHover : {}),
                ...(loading ? styles.buttonDisabled : {}),
              }}
              disabled={loading}
              onMouseEnter={() => setButtonHovered(true)}
              onMouseLeave={() => setButtonHovered(false)}
            >
              {loading ? (
                <>
                  <span style={styles.spinner} aria-hidden="true" /> Masuk...
                </>
              ) : (
                "Masuk"
              )}
            </button>
          </form>

          {error && <p style={styles.errorText}>{error}</p>}
        </div>
      </div>
    </>
  );
}

export default LoginPage;
