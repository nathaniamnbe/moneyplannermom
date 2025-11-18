// src/App.js
import React, { useState, useEffect } from "react";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import DebetPage from "./pages/DebetPage";
import RekapPage from "./pages/RekapPage"; // ✅ import halaman rekap
import KategoriPage from "./pages/KategoriPage"; // ✅ HALAMAN BARU

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("login");
  const [transactions] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("MP_USER");
    if (saved) {
      setUser(JSON.parse(saved));
      setPage("dashboard"); // ✅ kalau sudah login sebelumnya, langsung ke dashboard
    }
  }, []);

  if (!user) {
    // ✅ Halaman login
    return <LoginPage setUser={setUser} />;
  }

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("MP_USER");
    setPage("login");
  };

  // === DASHBOARD ===
  if (page === "dashboard") {
    return (
      <DashboardPage
        transactions={transactions}
        onNavigate={setPage}
        onLogout={handleLogout}
      />
    );
  }

  // === INPUT DEBET ===
  if (page === "debet") {
    return (
      <DebetPage
        user={user}
        type="debet"
        onCancel={() => setPage("dashboard")}
        onDone={() => setPage("dashboard")}
      />
    );
  }

  // === INPUT KREDIT ===
  if (page === "kredit") {
    return (
      <DebetPage
        user={user}
        type="kredit"
        onCancel={() => setPage("dashboard")}
        onDone={() => setPage("dashboard")}
      />
    );
  }

  // === REKAP BULANAN ===
  if (page === "rekap") {
    return <RekapPage onCancel={() => setPage("dashboard")} />;
  }

  // === KATEGORI ===
  if (page === "kategori") {
    return <KategoriPage user={user} onCancel={() => setPage("dashboard")} />;
  }

  // Default fallback ke dashboard
  return (
    <DashboardPage
      transactions={transactions}
      onNavigate={setPage}
      onLogout={handleLogout}
    />
  );
}

export default App;
