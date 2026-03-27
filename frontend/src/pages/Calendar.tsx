import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

interface Session {
  id: number;
  pocetak: string;
  kraj: string;
  cena: number;
  status: string;
}

interface Client {
  id: number;
  ime: string;
  prezime: string;
  broj_telefona: string;
  email: string;
}

const DAYS = ["Pon", "Uto", "Sre", "Čet", "Pet", "Sub", "Ned"];
const MONTHS = [
  "Januar",
  "Februar",
  "Mart",
  "April",
  "Maj",
  "Jun",
  "Jul",
  "Avgust",
  "Septembar",
  "Oktobar",
  "Novembar",
  "Decembar",
];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 08:00 - 19:00

const getMonday = (d: Date) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
};

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const formatTime = (d: Date) =>
  `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;

const statusColors: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  zakazano: { bg: "#dbeafe", border: "#3b82f6", text: "#1e40af" },
  zavrseno: { bg: "#dcfce7", border: "#22c55e", text: "#166534" },
  otkazano: { bg: "#fee2e2", border: "#ef4444", text: "#991b1b" },
  default: { bg: "#f3e8ff", border: "#a855f7", text: "#6b21a8" },
};

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"week" | "month">(
    window.innerWidth <= 768 ? "month" : "week",
  );
  const [sessions, setSessions] = useState<Session[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    pocetak: "",
    kraj: "",
    cena: 4000,
    status: "zakazano",
    klijent_id: "",
  });

  const backendBase =
    (import.meta as any).env?.VITE_API_URL || "http://localhost:8000";

  const fetchSessions = async () => {
    try {
      const res = await axios.get(`${backendBase}/sesija/`);
      setSessions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching sessions:", err);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await axios.get(`${backendBase}/klijent/`);
      setClients(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching clients:", err);
    }
  };

  useEffect(() => {
    fetchSessions();
    fetchClients();
  }, []);

  const weekStart = useMemo(() => getMonday(currentDate), [currentDate]);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [weekStart]);

  // Month view helpers
  const monthStart = useMemo(
    () => new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
    [currentDate],
  );
  const monthDays = useMemo(() => {
    const start = getMonday(monthStart);
    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  }, [monthStart]);

  const getSessionsForDay = (day: Date) => {
    return sessions.filter((s) => {
      const sDate = new Date(s.pocetak);
      return isSameDay(sDate, day);
    });
  };

  const navigateWeek = (dir: number) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + dir * 7);
    setCurrentDate(d);
  };

  const navigateMonth = (dir: number) => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + dir);
    setCurrentDate(d);
  };

  const openNewSession = (date?: Date, hour?: number) => {
    const start = date ? new Date(date) : new Date();
    if (hour !== undefined) {
      start.setHours(hour, 0, 0, 0);
    }
    const end = new Date(start);
    end.setHours(start.getHours() + 1);

    const toLocal = (d: Date) => {
      const offset = d.getTimezoneOffset();
      const local = new Date(d.getTime() - offset * 60000);
      return local.toISOString().slice(0, 16);
    };

    setFormData({
      pocetak: toLocal(start),
      kraj: toLocal(end),
      cena: 4000,
      status: "zakazano",
      klijent_id: "",
    });
    setSelectedSession(null);
    setShowModal(true);
  };

  const openEditSession = (session: Session) => {
    const toLocal = (s: string) => {
      const d = new Date(s);
      const offset = d.getTimezoneOffset();
      const local = new Date(d.getTime() - offset * 60000);
      return local.toISOString().slice(0, 16);
    };

    setFormData({
      pocetak: toLocal(session.pocetak),
      kraj: toLocal(session.kraj),
      cena: session.cena,
      status: session.status,
      klijent_id: "",
    });
    setSelectedSession(session);
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      // Generate a random ID for new sessions
      const newId = selectedSession
        ? selectedSession.id
        : Math.floor(Math.random() * 900000) + 100000;

      const payload = {
        id: newId,
        pocetak: new Date(formData.pocetak).toISOString(),
        kraj: new Date(formData.kraj).toISOString(),
        cena: formData.cena, // float - price of session
        status: formData.status,
        uplate: null, // 1:N relationship to Cena table (renamed from 'cena')
        sesijaklijent_1: null, // 1:N relationship
        sesijagrupa_1: null, // 1:N relationship
      };

      if (selectedSession) {
        await axios.put(
          `${backendBase}/sesija/${selectedSession.id}/`,
          payload,
        );
      } else {
        const res = await axios.post(`${backendBase}/sesija/`, payload);
        // Get the created session ID from response
        const createdId = res.data?.sesija?.id || res.data?.id || newId;
        // If client selected, create SesijaKlijent link
        if (formData.klijent_id) {
          try {
            const linkId = Math.floor(Math.random() * 900000) + 100000;
            await axios.post(`${backendBase}/sesijaklijent/`, {
              id: linkId,
              sesija: createdId,
              klijent: parseInt(formData.klijent_id),
            });
          } catch (linkErr) {
            console.error("Error linking client to session:", linkErr);
          }
        }
      }

      await fetchSessions();
      setShowModal(false);
    } catch (err) {
      console.error("Error saving session:", err);
    }
  };

  const handleDelete = async () => {
    if (!selectedSession) return;
    try {
      await axios.delete(`${backendBase}/sesija/${selectedSession.id}/`);
      await fetchSessions();
      setShowModal(false);
    } catch (err) {
      console.error("Error deleting session:", err);
    }
  };

  const today = new Date();

  return (
    <div className="cal-container">
      {/* Calendar Header */}
      <div className="cal-header">
        <div className="cal-header-left">
          <h1 className="cal-title">Kalendar</h1>
          <p className="cal-subtitle">
            {view === "week"
              ? `${weekDays[0].getDate()}. - ${weekDays[6].getDate()}. ${MONTHS[weekDays[6].getMonth()]} ${weekDays[6].getFullYear()}`
              : `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
          </p>
        </div>
        <div className="cal-header-right">
          <div className="cal-view-toggle">
            <button
              className={`cal-view-btn ${view === "week" ? "active" : ""}`}
              onClick={() => setView("week")}
            >
              Nedelja
            </button>
            <button
              className={`cal-view-btn ${view === "month" ? "active" : ""}`}
              onClick={() => setView("month")}
            >
              Mesec
            </button>
          </div>
          <div className="cal-nav-group">
            <button
              className="cal-nav-btn"
              onClick={() => setCurrentDate(new Date())}
            >
              Danas
            </button>
            <button
              className="cal-nav-btn"
              onClick={() =>
                view === "week" ? navigateWeek(-1) : navigateMonth(-1)
              }
            >
              ‹
            </button>
            <button
              className="cal-nav-btn"
              onClick={() =>
                view === "week" ? navigateWeek(1) : navigateMonth(1)
              }
            >
              ›
            </button>
          </div>
          <button className="cal-add-btn" onClick={() => openNewSession()}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nova Sesija
          </button>
        </div>
      </div>

      {/* Week View — Desktop grid */}
      {view === "week" && (
        <>
          {/* Desktop/Tablet: time grid */}
          <div className="cal-week cal-week-desktop">
            {/* Time column */}
            <div className="cal-time-col">
              <div className="cal-time-header"></div>
              {HOURS.map((h) => (
                <div key={h} className="cal-time-slot">
                  {String(h).padStart(2, "0")}:00
                </div>
              ))}
            </div>

            {/* Day columns */}
            {weekDays.map((day, dayIdx) => {
              const isToday = isSameDay(day, today);
              const daySessions = getSessionsForDay(day);

              return (
                <div
                  key={dayIdx}
                  className={`cal-day-col ${isToday ? "today" : ""}`}
                >
                  <div className={`cal-day-header ${isToday ? "today" : ""}`}>
                    <span className="cal-day-name">{DAYS[dayIdx]}</span>
                    <span className={`cal-day-num ${isToday ? "today" : ""}`}>
                      {day.getDate()}
                    </span>
                  </div>
                  {HOURS.map((h) => {
                    const hourSessions = daySessions.filter((s) => {
                      const sHour = new Date(s.pocetak).getHours();
                      return sHour === h;
                    });

                    return (
                      <div
                        key={h}
                        className="cal-hour-cell"
                        onClick={() => openNewSession(day, h)}
                      >
                        {hourSessions.map((s) => {
                          const start = new Date(s.pocetak);
                          const end = new Date(s.kraj);
                          const colors =
                            statusColors[s.status] || statusColors.default;

                          return (
                            <div
                              key={s.id}
                              className="cal-session-block"
                              style={{
                                backgroundColor: colors.bg,
                                borderLeft: `3px solid ${colors.border}`,
                                color: colors.text,
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditSession(s);
                              }}
                            >
                              <span className="cal-session-time">
                                {formatTime(start)} - {formatTime(end)}
                              </span>
                              <span className="cal-session-price">
                                {s.cena.toLocaleString()} RSD
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Mobile: agenda list */}
          <div className="cal-week-mobile">
            {weekDays.map((day, dayIdx) => {
              const isToday = isSameDay(day, today);
              const daySessions = getSessionsForDay(day);

              return (
                <div
                  key={dayIdx}
                  className={`cal-agenda-day ${isToday ? "today" : ""}`}
                  onClick={() => openNewSession(day, 10)}
                >
                  <div className="cal-agenda-date">
                    <span
                      className={`cal-agenda-day-num ${isToday ? "today" : ""}`}
                    >
                      {day.getDate()}
                    </span>
                    <span className="cal-agenda-day-name">{DAYS[dayIdx]}</span>
                  </div>
                  <div className="cal-agenda-sessions">
                    {daySessions.length === 0 ? (
                      <span className="cal-agenda-empty">Nema sesija</span>
                    ) : (
                      daySessions.map((s) => {
                        const start = new Date(s.pocetak);
                        const end = new Date(s.kraj);
                        const colors =
                          statusColors[s.status] || statusColors.default;

                        return (
                          <div
                            key={s.id}
                            className="cal-agenda-item"
                            style={{
                              backgroundColor: colors.bg,
                              borderLeft: `3px solid ${colors.border}`,
                              color: colors.text,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditSession(s);
                            }}
                          >
                            <span className="cal-agenda-item-time">
                              {formatTime(start)} - {formatTime(end)}
                            </span>
                            <span className="cal-agenda-item-price">
                              {s.cena.toLocaleString()} RSD
                            </span>
                            <span className="cal-agenda-item-status">
                              {s.status}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Month View */}
      {view === "month" && (
        <div className="cal-month">
          <div className="cal-month-header">
            {DAYS.map((d) => (
              <div key={d} className="cal-month-day-name">
                {d}
              </div>
            ))}
          </div>
          <div className="cal-month-grid">
            {monthDays.map((day, i) => {
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isToday = isSameDay(day, today);
              const daySessions = getSessionsForDay(day);

              return (
                <div
                  key={i}
                  className={`cal-month-cell ${!isCurrentMonth ? "other-month" : ""} ${isToday ? "today" : ""}`}
                  onClick={() => openNewSession(day, 10)}
                >
                  <span className={`cal-month-date ${isToday ? "today" : ""}`}>
                    {day.getDate()}
                  </span>
                  <div className="cal-month-sessions">
                    {daySessions.slice(0, 3).map((s) => {
                      const colors =
                        statusColors[s.status] || statusColors.default;
                      return (
                        <div
                          key={s.id}
                          className="cal-month-session-dot"
                          style={{ backgroundColor: colors.border }}
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditSession(s);
                          }}
                          title={`${formatTime(new Date(s.pocetak))} - ${s.cena} RSD`}
                        />
                      );
                    })}
                    {daySessions.length > 3 && (
                      <span className="cal-month-more">
                        +{daySessions.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Session Legend */}
      <div className="cal-legend">
        {Object.entries(statusColors)
          .filter(([k]) => k !== "default")
          .map(([key, colors]) => (
            <div key={key} className="cal-legend-item">
              <div
                className="cal-legend-dot"
                style={{ backgroundColor: colors.border }}
              />
              <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
            </div>
          ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="cal-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="cal-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cal-modal-header">
              <h2>{selectedSession ? "Izmeni Sesiju" : "Nova Sesija"}</h2>
              <button
                className="cal-modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="cal-modal-body">
              <div className="cal-form-group">
                <label>Početak</label>
                <input
                  type="datetime-local"
                  value={formData.pocetak}
                  onChange={(e) =>
                    setFormData({ ...formData, pocetak: e.target.value })
                  }
                />
              </div>
              <div className="cal-form-group">
                <label>Kraj</label>
                <input
                  type="datetime-local"
                  value={formData.kraj}
                  onChange={(e) =>
                    setFormData({ ...formData, kraj: e.target.value })
                  }
                />
              </div>
              <div className="cal-form-row">
                <div className="cal-form-group">
                  <label>Cena (RSD)</label>
                  <input
                    type="number"
                    value={formData.cena}
                    onChange={(e) =>
                      setFormData({ ...formData, cena: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="cal-form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="zakazano">Zakazano</option>
                    <option value="zavrseno">Završeno</option>
                    <option value="otkazano">Otkazano</option>
                  </select>
                </div>
              </div>

              {!selectedSession && (
                <div className="cal-form-group">
                  <label>Klijent (opciono)</label>
                  <select
                    value={formData.klijent_id}
                    onChange={(e) =>
                      setFormData({ ...formData, klijent_id: e.target.value })
                    }
                  >
                    <option value="">-- Izaberite klijenta --</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.ime} {c.prezime}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="cal-modal-footer">
              {selectedSession && (
                <button
                  className="cal-btn cal-btn-danger"
                  onClick={handleDelete}
                >
                  Obriši
                </button>
              )}
              <div style={{ flex: 1 }} />
              <button
                className="cal-btn cal-btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Otkaži
              </button>
              <button className="cal-btn cal-btn-primary" onClick={handleSave}>
                Sačuvaj
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
