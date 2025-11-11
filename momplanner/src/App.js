"use client";
import { useEffect, useState } from "react";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import DebetPage from "./pages/DebetPage";
import RekapPage from "./pages/RekapPage";

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("login");
  const [transactions, setTransactions] = useState([]);

  // load user & history
  useEffect(() => {
    const savedUser = localStorage.getItem("MP_USER");
    if (savedUser) setUser(JSON.parse(savedUser));

    const savedHist = localStorage.getItem("MP_HISTORY");
    if (savedHist) {
      try {
        setTransactions(JSON.parse(savedHist));
      } catch {}
    }
  }, []);

  const persistHistory = (next) => {
    setTransactions(next);
    localStorage.setItem("MP_HISTORY", JSON.stringify(next));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("MP_USER");
    setPage("login");
  };

  // Router sederhana
  if (!user) return <LoginPage setUser={setUser} />;

  if (page === "dashboard") {
    return (
      <DashboardPage
        user={user}
        transactions={transactions}
        onNavigate={setPage}
        onLogout={handleLogout}
      />
    );
  }

  if (page === "debet" || page === "kredit") {
    return (
      <DebetPage
        user={user}
        type={page} // "debet" | "kredit"
        onCancel={() => setPage("dashboard")}
        onDone={(newTx) => {
          // newTx: {type, date, description, amount}
          const next = [newTx, ...transactions];
          persistHistory(next);
          setPage("dashboard");
        }}
      />
    );
  }

  if (page === "rekap") {
    return <RekapPage onCancel={() => setPage("dashboard")} />;
  }

  return (
    <DashboardPage
      user={user}
      transactions={transactions}
      onNavigate={setPage}
      onLogout={handleLogout}
    />
  );
}

export default App;
