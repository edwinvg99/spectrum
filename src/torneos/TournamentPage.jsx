import React, { useState } from 'react';
import useTournament from './hooks/useTournament';
import TournamentSetup from './components/TournamentSetup';
import TournamentBracket from './components/TournamentBracket';
import TournamentList from './components/TournamentList';

function TournamentPage() {
  const {
    tournaments,
    activeTournament,
    createTournament,
    selectWinner,
    deleteTournament,
    resetTournament,
    setActive,
    clearActive,
    getRoundName,
  } = useTournament();

  const [showSetup, setShowSetup] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // --- VIEW: Active tournament bracket ---
  if (activeTournament) {
    return (
      <div className="min-h-screen bg-spectrum-darker page-pattern" style={{ paddingTop: 64 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 20px 80px" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <button
                onClick={clearActive}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: 34, height: 34,
                  background: "rgba(4,11,20,0.5)",
                  border: "1px solid rgba(0,247,255,0.15)",
                  borderRadius: 8,
                  color: "rgba(255,255,255,0.45)",
                  cursor: "pointer", transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.color = "#00f7ff"; e.currentTarget.style.borderColor = "rgba(0,247,255,0.35)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.45)"; e.currentTarget.style.borderColor = "rgba(0,247,255,0.15)"; }}
                title="Volver a torneos"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                </svg>
              </button>
              <div>
                <h1 style={{
                  fontFamily: "'Rajdhani', 'Impact', sans-serif",
                  fontSize: "clamp(1.4rem, 4vw, 2.2rem)",
                  fontWeight: 900, color: "#ffffff",
                  textTransform: "uppercase", letterSpacing: "0.04em",
                  textShadow: "0 0 20px rgba(0,247,255,0.3)",
                  margin: 0,
                }}>
                  {activeTournament.name}
                </h1>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                  <span style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: "0.65rem", fontWeight: 700,
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    padding: "2px 8px", borderRadius: 4,
                    background: activeTournament.status === 'completed' ? "rgba(234,179,8,0.1)" : "rgba(0,247,255,0.1)",
                    border: `1px solid ${activeTournament.status === 'completed' ? "rgba(234,179,8,0.25)" : "rgba(0,247,255,0.25)"}`,
                    color: activeTournament.status === 'completed' ? "#eab308" : "#00f7ff",
                  }}>
                    {activeTournament.status === 'completed' ? 'Finalizado' : 'En curso'}
                  </span>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.65rem",
                    color: "rgba(255,255,255,0.22)",
                    letterSpacing: "0.04em",
                  }}>
                    {activeTournament.participants.length} participantes
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => resetTournament(activeTournament.id)}
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: "0.72rem", fontWeight: 700,
                letterSpacing: "0.1em", textTransform: "uppercase",
                padding: "7px 16px",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 7,
                color: "rgba(255,255,255,0.35)",
                cursor: "pointer", transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.35)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
            >
              Reiniciar bracket
            </button>
          </div>

          {/* Instructions */}
          {!activeTournament.champion && (
            <div style={{
              marginBottom: 24,
              background: "rgba(4,11,20,0.5)",
              border: "1px solid rgba(0,247,255,0.1)",
              borderRadius: 8, padding: "10px 16px",
            }}>
              <p style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: "0.75rem", color: "rgba(255,255,255,0.35)",
                letterSpacing: "0.02em", margin: 0,
              }}>
                <span style={{ color: "#00f7ff", fontWeight: 700 }}>Tip:</span>{" "}
                Haz clic en el nombre del ganador de cada partido para avanzarlo a la siguiente ronda.
              </p>
            </div>
          )}

          {/* Bracket */}
          <TournamentBracket
            tournament={activeTournament}
            onSelectWinner={selectWinner}
            getRoundName={getRoundName}
          />
        </div>
      </div>
    );
  }

  // --- VIEW: Setup form ---
  if (showSetup) {
    return (
      <div className="min-h-screen bg-spectrum-darker page-pattern" style={{ paddingTop: 64 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 20px 80px" }}>
          <TournamentSetup
            onCreate={(name, teamSize, participants) => {
              createTournament(name, teamSize, participants);
              setShowSetup(false);
            }}
            onCancel={() => setShowSetup(false)}
          />
        </div>
      </div>
    );
  }

  // --- VIEW: Main list ---
  return (
    <div className="min-h-screen bg-spectrum-darker page-pattern" style={{ paddingTop: 64 }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 20px 80px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <p style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: "0.65rem", fontWeight: 700,
            letterSpacing: "0.45em", textTransform: "uppercase",
            color: "rgba(0,247,255,0.5)", marginBottom: 12,
          }}>
            Spectrum Clan · Eliminación directa
          </p>
          <h1 style={{
            fontFamily: "'Rajdhani', 'Impact', sans-serif",
            fontSize: "clamp(2rem, 6vw, 3.6rem)",
            fontWeight: 900, color: "#ffffff",
            textTransform: "uppercase", letterSpacing: "0.04em",
            textShadow: "0 0 28px rgba(0,247,255,0.35), 0 0 70px rgba(0,247,255,0.1)",
            margin: "0 0 10px",
          }}>
            Torneos
          </h1>
          <p style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: "0.85rem",
            color: "rgba(255,255,255,0.35)",
            letterSpacing: "0.06em",
            margin: 0,
          }}>
            Crea brackets de eliminación directa para el clan
          </p>
          <div style={{
            height: 1, maxWidth: 160, margin: "18px auto 0",
            background: "linear-gradient(90deg, transparent, rgba(0,247,255,0.4), transparent)",
          }} />
        </div>

        {/* Create button */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
          <button
            onClick={() => setShowSetup(true)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "10px 28px",
              background: "rgba(0,247,255,0.1)",
              border: "1px solid rgba(0,247,255,0.3)",
              borderRadius: 8,
              color: "rgba(0,247,255,0.9)",
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: "0.78rem", fontWeight: 700,
              letterSpacing: "0.14em", textTransform: "uppercase",
              cursor: "pointer", transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,247,255,0.16)"; e.currentTarget.style.borderColor = "rgba(0,247,255,0.5)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,247,255,0.1)"; e.currentTarget.style.borderColor = "rgba(0,247,255,0.3)"; }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
            </svg>
            Nuevo Torneo
          </button>
        </div>

        {/* Delete confirmation modal */}
        {confirmDelete && (
          <div style={{
            position: "fixed", inset: 0, zIndex: 50,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)",
          }}>
            <div style={{
              background: "rgba(4,11,20,0.95)",
              border: "1px solid rgba(248,113,113,0.2)",
              borderRadius: 12, padding: "24px 28px",
              maxWidth: 340, width: "90%",
              boxShadow: "0 0 40px rgba(0,0,0,0.5)",
            }}>
              <h3 style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: "1rem", fontWeight: 700,
                color: "#fff", letterSpacing: "0.04em",
                textTransform: "uppercase", margin: "0 0 8px",
              }}>
                Eliminar torneo
              </h3>
              <p style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: "0.78rem", color: "rgba(255,255,255,0.38)",
                letterSpacing: "0.02em", margin: "0 0 20px",
              }}>
                Esta acción no se puede deshacer. Se eliminará el torneo y todo su progreso.
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => { deleteTournament(confirmDelete); setConfirmDelete(null); }}
                  style={{
                    flex: 1, padding: "8px 0",
                    background: "rgba(248,113,113,0.08)",
                    border: "1px solid rgba(248,113,113,0.3)",
                    borderRadius: 7,
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: "0.72rem", fontWeight: 700,
                    letterSpacing: "0.1em", textTransform: "uppercase",
                    color: "#f87171", cursor: "pointer", transition: "all 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(248,113,113,0.16)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(248,113,113,0.08)"}
                >
                  Eliminar
                </button>
                <button
                  onClick={() => setConfirmDelete(null)}
                  style={{
                    flex: 1, padding: "8px 0",
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 7,
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: "0.72rem", fontWeight: 700,
                    letterSpacing: "0.1em", textTransform: "uppercase",
                    color: "rgba(255,255,255,0.4)", cursor: "pointer", transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.4)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tournament list */}
        <TournamentList
          tournaments={tournaments}
          onSelect={setActive}
          onDelete={(id) => setConfirmDelete(id)}
        />

        {/* Empty state */}
        {tournaments.length === 0 && (
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <div style={{
              width: 56, height: 56, margin: "0 auto 16px",
              borderRadius: "50%",
              background: "rgba(10,18,32,0.7)",
              border: "1px solid rgba(0,247,255,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "rgba(255,255,255,0.18)",
            }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 4l2 4 4-3 4 3 2-4M6 4v8c0 3.31 2.69 6 6 6s6-2.69 6-6V4M9 20h6M12 18v2M6 8H4a2 2 0 00-2 2v1a3 3 0 003 3h1M18 8h2a2 2 0 012 2v1a3 3 0 01-3 3h-1"/>
              </svg>
            </div>
            <p style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: "0.85rem", fontWeight: 600,
              color: "rgba(255,255,255,0.22)",
              letterSpacing: "0.06em", margin: "0 0 4px",
            }}>
              No hay torneos creados aún.
            </p>
            <p style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: "0.72rem",
              color: "rgba(255,255,255,0.14)",
              letterSpacing: "0.04em", margin: 0,
            }}>
              Crea uno para empezar a competir.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TournamentPage;
