import React, { useState, useEffect } from "react";
import SpectrumLogo from "../../assets/images/spectrumLOGO.svg?react";
import { PlaylistLoadingSkeleton } from "../../sharred/loadingSkeletons";

const playlists = {
  highlights: "PLD3-ET5DlQ0pYfjFhL-lqgQy9BstIsPSO",
  bloopers:   "PLD3-ET5DlQ0qlpgbRG1zFyyrjQ1dPX8VF",
};

const addClipLinks = {
  highlights: "https://www.youtube.com/playlist?list=PLD3-ET5DlQ0pYfjFhL-lqgQy9BstIsPSO&jct=QL-CHUkQzsfTiCH564o4zg",
  bloopers:   "https://www.youtube.com/playlist?list=PLD3-ET5DlQ0qlpgbRG1zFyyrjQ1dPX8VF&jct=CKrWldwmGYKhtIxkfX0FLA",
};

const tabConfig = {
  highlights: {
    label:    "Highlights",
    subtitle: "Las mejores jugadas épicas",
    accent:   "#00f7ff",
  },
  bloopers: {
    label:    "Bloopers",
    subtitle: "Momentos divertidos y fails",
    accent:   "#a855f7",
  },
};

const statCards = [
  { label: "Ace",     accent: "#f87171" },
  { label: "Clutch",  accent: "#fb923c" },
  { label: "Blooper", accent: "#a78bfa" },
  { label: "Team",    accent: "#60a5fa" },
];

/* ── Video skeleton ─────────────────────────────── */
function VideoSkeleton() {
  return (
    <div style={{
      background: "rgba(10,18,32,0.7)",
      border: "1px solid rgba(0,247,255,0.12)",
      borderRadius: 14,
      overflow: "hidden",
      marginBottom: 24,
    }}>
      <div style={{ position: "relative", paddingTop: "56.25%" }}>
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 16, background: "rgba(4,11,20,0.9)",
        }}>
          <div style={{
            width: 56, height: 56,
            border: "2px solid rgba(0,247,255,0.2)",
            borderTopColor: "rgba(0,247,255,0.8)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }} />
          <p style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "rgba(0,247,255,0.5)",
            animation: "pulse 1.5s ease-in-out infinite",
          }}>
            Cargando video…
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Tab icon SVGs ─────────────────────────────── */
const HighlightsIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <polygon points="5 3 19 12 5 21 5 3" strokeLinejoin="round"/>
  </svg>
);
const BloopmersIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
  </svg>
);

/* ══════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════ */
export default function PlaylistEmbed() {
  const [showContent,     setShowContent]     = useState(false);
  const [activeTab,       setActiveTab]       = useState("highlights");
  const [videoLoaded,     setVideoLoaded]     = useState(false);
  const [currentVideoKey, setCurrentVideoKey] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setShowContent(true);
      setTimeout(() => setVideoLoaded(true), 400);
    }, 500);
    return () => clearTimeout(t1);
  }, []);

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setVideoLoaded(false);
    setActiveTab(tab);
    setCurrentVideoKey(k => k + 1);
    setTimeout(() => setVideoLoaded(true), 700);
  };

  if (!showContent) return <PlaylistLoadingSkeleton />;

  const tab    = tabConfig[activeTab];
  const embedUrl = `https://www.youtube.com/embed/videoseries?list=${playlists[activeTab]}&autoplay=0&rel=0`;

  return (
    <div className="min-h-screen bg-spectrum-darker page-pattern" style={{ paddingTop: 64 }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 20px 80px" }}>

        {/* ── Header ── */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <p style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: "0.65rem", fontWeight: 700,
            letterSpacing: "0.45em", textTransform: "uppercase",
            color: "rgba(0,247,255,0.5)", marginBottom: 12,
          }}>
            Spectrum Clan · Valorant
          </p>
          <h1 style={{
            fontFamily: "'Rajdhani', 'Impact', sans-serif",
            fontSize: "clamp(2rem, 6vw, 3.6rem)",
            fontWeight: 900, color: "#ffffff",
            textTransform: "uppercase", letterSpacing: "0.04em",
            textShadow: "0 0 28px rgba(0,247,255,0.35), 0 0 70px rgba(0,247,255,0.1)",
            margin: "0 0 10px",
          }}>
            Jugadas
          </h1>
          <p style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: "0.85rem",
            color: "rgba(255,255,255,0.35)",
            letterSpacing: "0.06em",
          }}>
            Colección de highlights y bloopers del clan
          </p>
          <div style={{
            height: 1, maxWidth: 160, margin: "18px auto 0",
            background: "linear-gradient(90deg, transparent, rgba(0,247,255,0.4), transparent)",
          }} />
        </div>

        {/* ── Tabs ── */}
        <div style={{
          display: "flex", justifyContent: "center", gap: 6,
          background: "rgba(4,11,20,0.5)",
          border: "1px solid rgba(0,247,255,0.1)",
          borderRadius: 10, padding: "6px 8px",
          backdropFilter: "blur(8px)",
          marginBottom: 24,
        }}>
          {Object.entries(tabConfig).map(([key, cfg]) => {
            const active = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => handleTabChange(key)}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "8px 22px",
                  borderRadius: 7,
                  border: active ? `1px solid ${cfg.accent}40` : "1px solid transparent",
                  background: active ? `${cfg.accent}12` : "transparent",
                  color: active ? cfg.accent : "rgba(255,255,255,0.35)",
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: "0.8rem", fontWeight: 700,
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  cursor: "pointer", transition: "all 0.2s",
                  boxShadow: active ? `0 0 12px ${cfg.accent}18` : "none",
                }}
              >
                {key === "highlights" ? <HighlightsIcon /> : <BloopmersIcon />}
                {cfg.label}
              </button>
            );
          })}
        </div>

        {/* ── Video section ── */}
        <div style={{ marginBottom: 28 }}>
          {/* Section label */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            marginBottom: 14,
          }}>
            <div style={{ height: 1, flex: 1, background: "rgba(255,255,255,0.06)" }} />
            <span style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: "0.65rem", fontWeight: 700,
              letterSpacing: "0.2em", textTransform: "uppercase",
              color: `${tab.accent}80`,
            }}>
              {tab.subtitle}
            </span>
            <div style={{ height: 1, flex: 1, background: "rgba(255,255,255,0.06)" }} />
          </div>

          {!videoLoaded ? <VideoSkeleton /> : (
            <div style={{
              background: "rgba(4,11,20,0.8)",
              border: `1px solid ${tab.accent}20`,
              borderRadius: 14, overflow: "hidden",
              boxShadow: `0 0 40px ${tab.accent}08`,
              marginBottom: 0,
            }}>
              <div style={{ position: "relative", paddingTop: "56.25%" }}>
                <iframe
                  key={currentVideoKey}
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                  src={embedUrl}
                  title={`${tab.label} — Spectrum Clan`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Stats row ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: 10, marginBottom: 24,
        }}>
          {statCards.map(({ label, accent }) => (
            <div
              key={label}
              style={{
                background: "rgba(10,18,32,0.7)",
                border: `1px solid ${accent}20`,
                borderRadius: 10, padding: "14px 16px",
                display: "flex", flexDirection: "column",
                alignItems: "center", gap: 6,
                transition: "border-color 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `${accent}45`}
              onMouseLeave={e => e.currentTarget.style.borderColor = `${accent}20`}
            >
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: accent, boxShadow: `0 0 8px ${accent}` }} />
              <span style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: "0.75rem", fontWeight: 700,
                letterSpacing: "0.15em", textTransform: "uppercase",
                color: accent,
              }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* ── CTA ── */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          background: "rgba(10,18,32,0.7)",
          border: "1px solid rgba(0,247,255,0.12)",
          borderRadius: 12, padding: "22px 28px",
          textAlign: "center",
        }}>
          <p style={{
            fontFamily: "'Rajdhani', 'Impact', sans-serif",
            fontSize: "1.1rem", fontWeight: 700,
            letterSpacing: "0.04em", textTransform: "uppercase",
            color: "#fff",
            textShadow: "0 0 16px rgba(0,247,255,0.25)",
            margin: 0,
          }}>
            Sube tu clip
          </p>
          <p style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: "0.82rem", color: "rgba(255,255,255,0.38)",
            letterSpacing: "0.04em", margin: 0,
          }}>
            Comparte tus mejores momentos o las jugadas más lamentables con el clan
          </p>
          <a
            href={addClipLinks[activeTab]}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              marginTop: 6,
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "10px 28px",
              background: "rgba(0,247,255,0.1)",
              border: "1px solid rgba(0,247,255,0.3)",
              borderRadius: 8,
              color: "rgba(0,247,255,0.9)",
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: "0.78rem", fontWeight: 700,
              letterSpacing: "0.14em", textTransform: "uppercase",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,247,255,0.16)"; e.currentTarget.style.borderColor = "rgba(0,247,255,0.5)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,247,255,0.1)"; e.currentTarget.style.borderColor = "rgba(0,247,255,0.3)"; }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
            </svg>
            Añadir mi clip
          </a>
        </div>

      </div>
    </div>
  );
}
