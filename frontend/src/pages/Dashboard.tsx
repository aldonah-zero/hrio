import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

// ============================================
// STYLES
// ============================================
const styles = {
  dashboard: {
    padding: "0",
    fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
    color: "#1e293b",
    maxWidth: "100%",
  },
  header: {
    marginBottom: "28px",
  },
  title: {
    fontSize: "26px",
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 4px",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#64748b",
    margin: 0,
  },
  filterBar: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap" as const,
    marginBottom: "24px",
    alignItems: "center",
  },
  filterBtn: (active: boolean) => ({
    padding: "8px 16px",
    borderRadius: "20px",
    border: active ? "2px solid #6366f1" : "1.5px solid #e2e8f0",
    background: active ? "linear-gradient(135deg, #6366f1, #7c3aed)" : "#fff",
    color: active ? "#fff" : "#64748b",
    fontWeight: 600,
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    fontFamily: "inherit",
    whiteSpace: "nowrap" as const,
    transform: active ? "scale(1.02)" : "scale(1)",
  }),
  cardsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "14px",
    marginBottom: "28px",
  },
  card: (color: string, delay: number) => ({
    background: "#fff",
    borderRadius: "14px",
    padding: "20px 22px",
    border: "1px solid #f1f5f9",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    position: "relative" as const,
    overflow: "hidden",
    animation: `cardSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms both`,
  }),
  cardIcon: (bg: string) => ({
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    background: bg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "12px",
  }),
  cardValue: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 2px",
    letterSpacing: "-0.5px",
    fontVariantNumeric: "tabular-nums",
  },
  cardLabel: {
    fontSize: "13px",
    color: "#94a3b8",
    fontWeight: 500,
    margin: 0,
  },
  chartSection: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "18px",
    marginBottom: "24px",
  },
  chartCard: {
    background: "#fff",
    borderRadius: "14px",
    padding: "22px",
    border: "1px solid #f1f5f9",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
  },
  chartTitle: {
    fontSize: "15px",
    fontWeight: 600,
    color: "#334155",
    margin: "0 0 16px",
  },
  barContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
  },
  barRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  barLabel: {
    fontSize: "13px",
    color: "#64748b",
    minWidth: "110px",
    fontWeight: 500,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
  },
  barTrack: {
    flex: 1,
    height: "26px",
    background: "#f1f5f9",
    borderRadius: "8px",
    overflow: "hidden",
    position: "relative" as const,
  },
  barFill: (width: number, color: string, delay: number) => ({
    height: "100%",
    borderRadius: "8px",
    background: color,
    width: `${width}%`,
    transition: `width 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingRight: width > 15 ? "8px" : "0",
  }),
  barValue: (inside: boolean) => ({
    fontSize: "11px",
    fontWeight: 700,
    color: inside ? "#fff" : "#64748b",
    marginLeft: inside ? "0" : "8px",
    whiteSpace: "nowrap" as const,
  }),
  tableContainer: {
    background: "#fff",
    borderRadius: "14px",
    border: "1px solid #f1f5f9",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    overflow: "hidden",
  },
  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 22px",
    borderBottom: "1px solid #f1f5f9",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    fontSize: "13px",
  },
  th: {
    textAlign: "left" as const,
    padding: "10px 16px",
    fontSize: "12px",
    fontWeight: 600,
    color: "#94a3b8",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    borderBottom: "1px solid #f1f5f9",
  },
  td: {
    padding: "12px 16px",
    borderBottom: "1px solid #f8fafc",
    color: "#334155",
  },
  badge: (paid: boolean) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: 600,
    background: paid ? "#dcfce7" : "#fef3c7",
    color: paid ? "#166534" : "#92400e",
  }),
  progressRing: {
    position: "relative" as const,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

// ============================================
// ANIMATION KEYFRAMES (inject once)
// ============================================
const injectStyles = () => {
  if (document.getElementById("dashboard-animations")) return;
  const styleEl = document.createElement("style");
  styleEl.id = "dashboard-animations";
  styleEl.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
    @keyframes cardSlideIn {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes countUp {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .dash-row:hover { background: #f8fafc; }
    .dash-chart-section { animation: fadeIn 0.6s ease both; }
    @media (max-width: 768px) {
      .dash-grid-2 { grid-template-columns: 1fr !important; }
    }
  `;
  document.head.appendChild(styleEl);
};

// ============================================
// MINI COMPONENTS
// ============================================

const CircularProgress: React.FC<{ percent: number; size?: number; stroke?: number }> = ({
  percent,
  size = 64,
  stroke = 5,
}) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  const color = percent >= 80 ? "#22c55e" : percent >= 40 ? "#f59e0b" : "#ef4444";

  return (
    <div style={styles.progressRing}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)" }}
        />
      </svg>
      <span
        style={{
          position: "absolute",
          fontSize: "14px",
          fontWeight: 700,
          color: "#0f172a",
        }}
      >
        {Math.round(percent)}%
      </span>
    </div>
  );
};

const AnimatedNumber: React.FC<{ value: number; prefix?: string; suffix?: string }> = ({
  value,
  prefix = "",
  suffix = "",
}) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 800;
    const start = performance.now();
    const startVal = 0;

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(startVal + (value - startVal) * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <span>
      {prefix}
      {display.toLocaleString("sr-Latn")}
      {suffix}
    </span>
  );
};

// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================
const Dashboard: React.FC = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all"); // "all" | "individual" | "group" | klijent name
  const [viewMode, setViewMode] = useState<"overview" | "clients">("overview");

  useEffect(() => {
    injectStyles();
    fetchData();
  }, []);

  const fetchData = async () => {
    const backendBase = import.meta.env.VITE_API_URL || "http://localhost:8000";
    try {
      const res = await axios.get(`${backendBase}/sesija/`);
      if (Array.isArray(res.data)) {
        setSessions(res.data);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Unique client/group names for filter
  const filterOptions = useMemo(() => {
    const names = new Set<string>();
    sessions.forEach((s) => {
      if (s.klijent_ime) names.add(s.klijent_ime);
    });
    return Array.from(names).sort();
  }, [sessions]);

  // Filtered sessions
  const filtered = useMemo(() => {
    if (filter === "all") return sessions;
    if (filter === "individual") return sessions.filter((s) => !s.grupa_id);
    if (filter === "group") return sessions.filter((s) => !!s.grupa_id);
    return sessions.filter((s) => s.klijent_ime === filter);
  }, [sessions, filter]);

  // Stats
  const stats = useMemo(() => {
    const total = filtered.length;
    const totalRevenue = filtered.reduce((sum, s) => sum + (s.cena || 0), 0);
    const paid = filtered.filter((s) => s.placeno);
    const paidRevenue = paid.reduce((sum, s) => sum + (s.cena || 0), 0);
    const unpaidRevenue = totalRevenue - paidRevenue;
    const paidPercent = totalRevenue > 0 ? (paidRevenue / totalRevenue) * 100 : 0;
    const individual = filtered.filter((s) => !s.grupa_id).length;
    const group = filtered.filter((s) => !!s.grupa_id).length;

    return { total, totalRevenue, paidRevenue, unpaidRevenue, paidPercent, paid: paid.length, unpaid: total - paid.length, individual, group };
  }, [filtered]);

  // Per-client stats for bar chart
  const clientStats = useMemo(() => {
    const map: Record<string, { name: string; total: number; paid: number; sessions: number; isGroup: boolean }> = {};
    filtered.forEach((s) => {
      const key = s.klijent_ime || "Nepoznato";
      if (!map[key]) {
        map[key] = { name: key, total: 0, paid: 0, sessions: 0, isGroup: !!s.grupa_id };
      }
      map[key].total += s.cena || 0;
      if (s.placeno) map[key].paid += s.cena || 0;
      map[key].sessions += 1;
    });
    return Object.values(map).sort((a, b) => b.total - a.total);
  }, [filtered]);

  // Monthly stats
  const monthlyStats = useMemo(() => {
    const map: Record<string, { month: string; total: number; paid: number; count: number }> = {};
    filtered.forEach((s) => {
      if (!s.pocetak) return;
      const d = new Date(s.pocetak);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Avg", "Sep", "Okt", "Nov", "Dec"];
      const label = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      if (!map[key]) map[key] = { month: label, total: 0, paid: 0, count: 0 };
      map[key].total += s.cena || 0;
      if (s.placeno) map[key].paid += s.cena || 0;
      map[key].count += 1;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => v);
  }, [filtered]);

  const maxClientTotal = useMemo(() => Math.max(...clientStats.map((c) => c.total), 1), [clientStats]);
  const maxMonthlyTotal = useMemo(() => Math.max(...monthlyStats.map((m) => m.total), 1), [monthlyStats]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "60px", opacity: 0.5 }}>
        <svg width="44" height="44" viewBox="0 0 44 44">
          <circle cx="22" cy="22" r="18" fill="none" stroke="#e2e8f0" strokeWidth="3.5" />
          <circle cx="22" cy="22" r="18" fill="none" stroke="#6366f1" strokeWidth="3.5" strokeDasharray="80 33" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate" from="0 22 22" to="360 22 22" dur="0.7s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
    );
  }

  return (
    <div style={styles.dashboard}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>Statistika</h2>
        <p style={styles.subtitle}>Pregled sesija, prihoda i naplate</p>
      </div>

      {/* View toggle */}
      <div style={{ display: "flex", gap: "0", marginBottom: "18px", borderRadius: "12px", overflow: "hidden", border: "1.5px solid #e2e8f0", width: "fit-content" }}>
        <button
          onClick={() => setViewMode("overview")}
          style={{
            padding: "9px 20px",
            border: "none",
            background: viewMode === "overview" ? "linear-gradient(135deg, #6366f1, #7c3aed)" : "#fff",
            color: viewMode === "overview" ? "#fff" : "#64748b",
            fontWeight: 600,
            fontSize: "13px",
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 0.2s",
          }}
        >
          Pregled
        </button>
        <button
          onClick={() => setViewMode("clients")}
          style={{
            padding: "9px 20px",
            border: "none",
            borderLeft: "1.5px solid #e2e8f0",
            background: viewMode === "clients" ? "linear-gradient(135deg, #6366f1, #7c3aed)" : "#fff",
            color: viewMode === "clients" ? "#fff" : "#64748b",
            fontWeight: 600,
            fontSize: "13px",
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 0.2s",
          }}
        >
          Po klijentima
        </button>
      </div>

      {/* Filters */}
      <div style={styles.filterBar}>
        <button style={styles.filterBtn(filter === "all")} onClick={() => setFilter("all")}>
          Sve
        </button>
        <button style={styles.filterBtn(filter === "individual")} onClick={() => setFilter("individual")}>
          Individualne
        </button>
        <button style={styles.filterBtn(filter === "group")} onClick={() => setFilter("group")}>
          Grupne
        </button>
        <span style={{ width: "1px", height: "24px", background: "#e2e8f0" }} />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: "8px 14px",
            borderRadius: "20px",
            border: "1.5px solid #e2e8f0",
            fontSize: "13px",
            color: "#64748b",
            fontFamily: "inherit",
            fontWeight: 500,
            cursor: "pointer",
            background: "#fff",
            minWidth: "160px",
          }}
        >
          <option value="all">— Filtriraj po klijentu —</option>
          {filterOptions.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* Summary Cards */}
      <div style={styles.cardsRow}>
        <div style={styles.card("#6366f1", 0)}>
          <div style={styles.cardIcon("linear-gradient(135deg, #eef2ff, #e0e7ff)")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
          </div>
          <p style={styles.cardValue}><AnimatedNumber value={stats.total} /></p>
          <p style={styles.cardLabel}>Ukupno sesija</p>
        </div>

        <div style={styles.card("#059669", 80)}>
          <div style={styles.cardIcon("linear-gradient(135deg, #ecfdf5, #d1fae5)")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
          </div>
          <p style={styles.cardValue}><AnimatedNumber value={stats.totalRevenue} suffix=" RSD" /></p>
          <p style={styles.cardLabel}>Ukupan prihod</p>
        </div>

        <div style={styles.card("#22c55e", 160)}>
          <div style={styles.cardIcon("linear-gradient(135deg, #f0fdf4, #dcfce7)")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <p style={styles.cardValue}><AnimatedNumber value={stats.paidRevenue} suffix=" RSD" /></p>
          <p style={styles.cardLabel}>Naplaćeno ({stats.paid})</p>
        </div>

        <div style={styles.card("#f59e0b", 240)}>
          <div style={styles.cardIcon("linear-gradient(135deg, #fffbeb, #fef3c7)")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          </div>
          <p style={styles.cardValue}><AnimatedNumber value={stats.unpaidRevenue} suffix=" RSD" /></p>
          <p style={styles.cardLabel}>Nenaplaćeno ({stats.unpaid})</p>
        </div>

        <div style={styles.card("#8b5cf6", 320)}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "4px" }}>
            <CircularProgress percent={stats.paidPercent} size={56} stroke={5} />
          </div>
          <p style={{ ...styles.cardLabel, textAlign: "center" as const }}>Procenat naplate</p>
        </div>
      </div>

      {/* Charts Section */}
      {viewMode === "overview" && (
        <div className="dash-chart-section">
          <div style={styles.chartSection} className="dash-grid-2">
            {/* Monthly Revenue Chart */}
            <div style={styles.chartCard}>
              <h4 style={styles.chartTitle}>Mesečni prihod</h4>
              <div style={styles.barContainer}>
                {monthlyStats.map((m, i) => {
                  const paidW = maxMonthlyTotal > 0 ? (m.paid / maxMonthlyTotal) * 100 : 0;
                  const unpaidW = maxMonthlyTotal > 0 ? ((m.total - m.paid) / maxMonthlyTotal) * 100 : 0;
                  return (
                    <div key={m.month} style={styles.barRow}>
                      <span style={styles.barLabel}>{m.month}</span>
                      <div style={{ ...styles.barTrack, display: "flex" }}>
                        <div
                          style={{
                            height: "100%",
                            borderRadius: unpaidW > 0 ? "8px 0 0 8px" : "8px",
                            background: "linear-gradient(135deg, #22c55e, #16a34a)",
                            width: `${paidW}%`,
                            transition: `width 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 80}ms`,
                          }}
                        />
                        <div
                          style={{
                            height: "100%",
                            borderRadius: paidW > 0 ? "0 8px 8px 0" : "8px",
                            background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                            width: `${unpaidW}%`,
                            transition: `width 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 80 + 100}ms`,
                          }}
                        />
                      </div>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "#334155", minWidth: "70px", textAlign: "right" as const }}>
                        {m.total.toLocaleString()} RSD
                      </span>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: "16px", marginTop: "14px", fontSize: "12px", color: "#94a3b8" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <span style={{ width: "10px", height: "10px", borderRadius: "3px", background: "#22c55e" }} />
                  Naplaćeno
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <span style={{ width: "10px", height: "10px", borderRadius: "3px", background: "#fbbf24" }} />
                  Nenaplaćeno
                </span>
              </div>
            </div>

            {/* Session Type Distribution */}
            <div style={styles.chartCard}>
              <h4 style={styles.chartTitle}>Tip sesije</h4>
              <div style={{ display: "flex", gap: "20px", alignItems: "center", justifyContent: "center", padding: "20px 0" }}>
                {/* Mini donut */}
                <svg width="120" height="120" viewBox="0 0 120 120">
                  {(() => {
                    const total = stats.individual + stats.group || 1;
                    const indPct = stats.individual / total;
                    const r = 48;
                    const c = 2 * Math.PI * r;
                    return (
                      <>
                        <circle cx="60" cy="60" r={r} fill="none" stroke="#e2e8f0" strokeWidth="12" />
                        <circle
                          cx="60" cy="60" r={r} fill="none"
                          stroke="#6366f1" strokeWidth="12"
                          strokeDasharray={`${indPct * c} ${c}`}
                          strokeLinecap="round"
                          style={{ transform: "rotate(-90deg)", transformOrigin: "60px 60px", transition: "stroke-dasharray 1s ease" }}
                        />
                        <circle
                          cx="60" cy="60" r={r} fill="none"
                          stroke="#f59e0b" strokeWidth="12"
                          strokeDasharray={`${(1 - indPct) * c} ${c}`}
                          strokeDashoffset={-indPct * c}
                          strokeLinecap="round"
                          style={{ transform: "rotate(-90deg)", transformOrigin: "60px 60px", transition: "all 1s ease" }}
                        />
                        <text x="60" y="56" textAnchor="middle" fontSize="18" fontWeight="700" fill="#0f172a">{stats.total}</text>
                        <text x="60" y="72" textAnchor="middle" fontSize="11" fill="#94a3b8">sesija</text>
                      </>
                    );
                  })()}
                </svg>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                      <span style={{ width: "10px", height: "10px", borderRadius: "3px", background: "#6366f1" }} />
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Individualne</span>
                    </div>
                    <span style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a" }}>{stats.individual}</span>
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                      <span style={{ width: "10px", height: "10px", borderRadius: "3px", background: "#f59e0b" }} />
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Grupne</span>
                    </div>
                    <span style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a" }}>{stats.group}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Client Stats - Bar Chart */}
      {viewMode === "clients" && (
        <div className="dash-chart-section" style={{ animation: "fadeIn 0.4s ease" }}>
          <div style={styles.chartCard}>
            <h4 style={styles.chartTitle}>Prihod po klijentu / grupi</h4>
            <div style={styles.barContainer}>
              {clientStats.map((c, i) => {
                const totalW = (c.total / maxClientTotal) * 100;
                const paidW = (c.paid / maxClientTotal) * 100;
                return (
                  <div key={c.name} style={styles.barRow}>
                    <span style={styles.barLabel} title={c.name}>
                      {c.isGroup ? "👥 " : "👤 "}
                      {c.name}
                    </span>
                    <div style={{ ...styles.barTrack, display: "flex" }}>
                      <div
                        style={{
                          height: "100%",
                          borderRadius: paidW < totalW ? "8px 0 0 8px" : "8px",
                          background: "linear-gradient(135deg, #22c55e, #16a34a)",
                          width: `${paidW}%`,
                          transition: `width 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 60}ms`,
                        }}
                      />
                      <div
                        style={{
                          height: "100%",
                          borderRadius: paidW > 0 ? "0 8px 8px 0" : "8px",
                          background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                          width: `${totalW - paidW}%`,
                          transition: `width 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 60 + 80}ms`,
                        }}
                      />
                    </div>
                    <div style={{ minWidth: "100px", textAlign: "right" as const }}>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "#166534" }}>
                        {c.paid > 0 ? `${c.paid.toLocaleString()}` : "0"}
                      </span>
                      <span style={{ fontSize: "11px", color: "#94a3b8" }}> / {c.total.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: "16px", marginTop: "14px", fontSize: "12px", color: "#94a3b8" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "3px", background: "#22c55e" }} />
                Naplaćeno (RSD)
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "3px", background: "#fbbf24" }} />
                Nenaplaćeno (RSD)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Recent Sessions Table */}
      <div style={{ ...styles.tableContainer, marginTop: "6px" }}>
        <div style={styles.tableHeader}>
          <h4 style={{ ...styles.chartTitle, margin: 0 }}>Poslednje sesije</h4>
          <span style={{ fontSize: "13px", color: "#94a3b8" }}>
            {filtered.length} rezultata
          </span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Klijent / Grupa</th>
                <th style={styles.th}>Datum</th>
                <th style={styles.th}>Vreme</th>
                <th style={styles.th}>Cena</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Plaćeno</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 15).map((s, i) => {
                const d = s.pocetak ? new Date(s.pocetak) : null;
                const dEnd = s.kraj ? new Date(s.kraj) : null;
                return (
                  <tr key={s.id || i} className="dash-row" style={{ transition: "background 0.15s" }}>
                    <td style={{ ...styles.td, fontWeight: 600 }}>
                      {s.grupa_id ? "👥 " : "👤 "}
                      {s.klijent_ime || "—"}
                    </td>
                    <td style={styles.td}>
                      {d ? d.toLocaleDateString("sr-Latn", { day: "2-digit", month: "2-digit", year: "numeric" }) : "—"}
                    </td>
                    <td style={styles.td}>
                      {d ? d.toLocaleTimeString("sr-Latn", { hour: "2-digit", minute: "2-digit" }) : "—"}
                      {dEnd ? ` – ${dEnd.toLocaleTimeString("sr-Latn", { hour: "2-digit", minute: "2-digit" })}` : ""}
                    </td>
                    <td style={{ ...styles.td, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                      {(s.cena || 0).toLocaleString()} RSD
                    </td>
                    <td style={styles.td}>
                      <span
                        style={{
                          padding: "3px 10px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: 600,
                          background: s.status === "zakazano" ? "#dbeafe" : s.status === "zavrseno" ? "#dcfce7" : s.status === "otkazano" ? "#fee2e2" : "#f3f4f6",
                          color: s.status === "zakazano" ? "#1e40af" : s.status === "zavrseno" ? "#166534" : s.status === "otkazano" ? "#991b1b" : "#374151",
                        }}
                      >
                        {s.status === "zakazano" ? "Zakazano" : s.status === "zavrseno" ? "Završeno" : s.status === "otkazano" ? "Otkazano" : s.status || "—"}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.badge(s.placeno)}>
                        {s.placeno ? (
                          <>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                            Da
                          </>
                        ) : (
                          "Ne"
                        )}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;