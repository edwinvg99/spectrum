import React, { useState, useRef } from "react";
import anime from "animejs";

/* ── Type styling (no emojis) ─────────────────── */
export const TYPE_STYLE = {
  buddy:      { label: "Llavero",  color: "#f59e0b", bg: "rgba(245,158,11,0.10)" },
  spray:      { label: "Spray",    color: "#a78bfa", bg: "rgba(167,139,250,0.10)" },
  playercard: { label: "Tarjeta",  color: "#22d3ee", bg: "rgba(34,211,238,0.10)"  },
};
const fallbackType = { label: "Item", color: "#64748b", bg: "rgba(100,116,139,0.08)" };

/* ── Download logic ──────────────────────────── */
async function triggerDownload(url, filename, ext = "png") {
  try {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) throw new Error("fetch failed");
    const blob   = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href     = blobUrl;
    a.download = `${filename}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
    return true;
  } catch {
    window.open(url, "_blank");
    return false;
  }
}

/* ── Download button ──────────────────────────── */
export function DownloadBtn({ item, dlOption, variant = "ghost" }) {
  const [state, setState] = useState("idle");
  const btnRef = useRef(null);

  const handle = async (e) => {
    e.stopPropagation();
    if (state === "loading") return;
    setState("loading");
    const ok = await triggerDownload(
      dlOption.url,
      `${item.nameEs.replace(/[^a-z0-9]/gi, "_")}_${dlOption.label.toLowerCase()}`,
      dlOption.ext
    );
    setState(ok ? "done" : "error");
    if (btnRef.current) {
      anime({ targets: btnRef.current, scale: [1, 1.2, 1], duration: 300, easing: "easeOutBack" });
    }
    setTimeout(() => setState("idle"), 2200);
  };

  const labels = { idle: dlOption.label, loading: "Descargando…", done: "Descargado", error: "Abrir" };

  /* Primary style — for modal */
  if (variant === "primary") {
    const bg   = state === "done" ? "rgba(52,211,153,0.15)" : state === "error" ? "rgba(248,113,113,0.15)" : "rgba(0,247,255,0.1)";
    const border = state === "done" ? "rgba(52,211,153,0.4)" : state === "error" ? "rgba(248,113,113,0.4)" : "rgba(0,247,255,0.3)";
    const color  = state === "done" ? "#34d399" : state === "error" ? "#f87171" : "rgba(0,247,255,0.9)";
    return (
      <button
        ref={btnRef}
        onClick={handle}
        style={{
          display: "inline-flex", alignItems: "center", gap: "0.4rem",
          padding: "0.45rem 1rem",
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: 6,
          color,
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: "0.72rem",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          cursor: state === "loading" ? "default" : "pointer",
          transition: "all 0.2s",
          whiteSpace: "nowrap",
        }}
      >
        <DownloadIcon state={state} />
        {labels[state]}
      </button>
    );
  }

  /* Ghost — fallback */
  return (
    <button
      ref={btnRef}
      onClick={handle}
      title={labels[state]}
      style={{
        display: "inline-flex", alignItems: "center", gap: "0.3rem",
        padding: "0.3rem 0.7rem",
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 6,
        color: "#cbd5e1",
        fontFamily: "'Rajdhani', sans-serif",
        fontSize: "0.7rem",
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        cursor: "pointer",
        transition: "all 0.15s",
      }}
    >
      <DownloadIcon state={state} />
      {labels[state]}
    </button>
  );
}

function DownloadIcon({ state }) {
  const s = { width: 12, height: 12, flexShrink: 0 };
  if (state === "loading") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
      className="animate-spin">
      <path strokeLinecap="round" d="M12 2a10 10 0 110 20A10 10 0 0112 2z" strokeOpacity={0.2}/>
      <path strokeLinecap="round" d="M12 2a10 10 0 019.5 13"/>
    </svg>
  );
  if (state === "done") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
    </svg>
  );
  return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M16 11l-4 4m0 0l-4-4m4 4V4"/>
    </svg>
  );
}

/* ══════════════════════════════════════════════
   CARD — clean, clickable, opens modal
══════════════════════════════════════════════ */
export function AccesorioCard({ item, onClick }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const ts = TYPE_STYLE[item.tipo] || fallbackType;

  const imgSrc = item.tipo === "playercard"
    ? (item.imagenLarge || item.imagen)
    : (item.imagenLarge || item.imagen);

  const imgHeight = item.tipo === "playercard" ? 172 : 140;
  const imgMax    = item.tipo === "playercard" ? 158 : 120;

  return (
    <div
      onClick={() => onClick?.(item)}
      style={{
        width: 200,
        background: "rgba(10,18,32,0.85)",
        border: "1px solid rgba(0,247,255,0.1)",
        borderRadius: 14,
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.22s, box-shadow 0.22s, border-color 0.22s",
        position: "relative",
        userSelect: "none",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.borderColor = `${ts.color}45`;
        e.currentTarget.style.boxShadow = `0 16px 40px -8px ${ts.color}28`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.borderColor = "rgba(0,247,255,0.1)";
        e.currentTarget.style.boxShadow = "";
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2, zIndex: 2,
        background: `linear-gradient(90deg, transparent, ${ts.color}55, transparent)`,
      }} />

      {/* Image area */}
      <div style={{
        height: imgHeight,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden",
        background: `radial-gradient(ellipse at 50% 70%, ${ts.color}12 0%, transparent 70%)`,
      }}>
        {!imgLoaded && (
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(10,22,40,0.6)",
            animation: "pulse 1.5s ease-in-out infinite",
          }} />
        )}
        <img
          src={imgSrc}
          alt={item.nameEs}
          loading="lazy"
          style={{
            opacity: imgLoaded ? 1 : 0,
            maxHeight: imgMax,
            maxWidth: "88%",
            objectFit: "contain",
            transition: "opacity 0.3s, transform 0.3s",
          }}
          onLoad={() => setImgLoaded(true)}
          onError={e => { e.target.style.opacity = 0.15; setImgLoaded(true); }}
        />
        {/* GIF badge */}
        {item.animado && (
          <div style={{
            position: "absolute", top: 8, left: 8,
            padding: "2px 6px",
            background: "rgba(167,139,250,0.18)",
            border: "1px solid rgba(167,139,250,0.35)",
            borderRadius: 5,
            color: "#c4b5fd",
            fontSize: "0.6rem",
            fontFamily: "'Rajdhani', sans-serif",
            fontWeight: 700,
            letterSpacing: "0.1em",
          }}>
            GIF
          </div>
        )}
        {/* Type pill */}
        <div style={{
          position: "absolute", top: 8, right: 8,
          padding: "2px 7px",
          background: ts.bg,
          border: `1px solid ${ts.color}30`,
          borderRadius: 5,
          color: ts.color,
          fontSize: "0.6rem",
          fontFamily: "'Rajdhani', sans-serif",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}>
          {ts.label}
        </div>
      </div>

      {/* Name */}
      <div style={{ padding: "10px 12px 12px" }}>
        <p style={{
          margin: 0,
          color: "#f1f5f9",
          fontFamily: "'Rajdhani', sans-serif",
          fontWeight: 600,
          fontSize: "0.82rem",
          letterSpacing: "0.02em",
          lineHeight: 1.35,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textAlign: "center",
        }}>
          {item.nameEs}
        </p>
      </div>
    </div>
  );
}

export default AccesorioCard;
