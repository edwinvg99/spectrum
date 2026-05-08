import React, { useState, useRef } from "react";
import anime from "animejs";

/* ── Type styling ─────────────────────────────── */
const TYPE_STYLE = {
  buddy:      { label: "Llavero",  color: "#f59e0b", icon: "🔑", bg: "rgba(245,158,11,0.12)" },
  spray:      { label: "Spray",    color: "#a78bfa", icon: "🎨", bg: "rgba(167,139,250,0.12)" },
  playercard: { label: "Tarjeta",  color: "#22d3ee", icon: "🃏", bg: "rgba(34,211,238,0.12)" },
};
const fallbackType = { label: "Item", color: "#64748b", icon: "🎮", bg: "rgba(100,116,139,0.10)" };

/* ── Download logic ─────────────────────────────── */
async function triggerDownload(url, filename, ext = "png") {
  try {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) throw new Error("fetch failed");
    const blob = await res.blob();
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

/* ── Download button with animated feedback ─── */
function DownloadBtn({ item, dlOption, compact = false }) {
  const [state, setState] = useState("idle"); // idle | loading | done | error
  const btnRef = useRef(null);

  const handle = async (e) => {
    e.stopPropagation();
    if (state === "loading") return;
    setState("loading");
    const ok = await triggerDownload(
      dlOption.url,
      `${item.nameEs.replace(/[^a-z0-9]/gi, "_")}_${dlOption.ext}`,
      dlOption.ext
    );
    setState(ok ? "done" : "error");
    // Pulse animation
    if (btnRef.current) {
      anime({
        targets:  btnRef.current,
        scale:    [1, 1.25, 1],
        duration: 350,
        easing:   "easeOutBack",
      });
    }
    setTimeout(() => setState("idle"), 2200);
  };

  const icon = {
    idle:    <DownloadIcon />,
    loading: <SpinIcon />,
    done:    <CheckIcon />,
    error:   <OpenIcon />,
  }[state];

  const tip = {
    idle:    dlOption.label,
    loading: "Descargando…",
    done:    "¡Descargado!",
    error:   "Abriendo…",
  }[state];

  const bg = {
    idle:    "bg-white/8 hover:bg-white/15 border-white/10 hover:border-white/25",
    loading: "bg-white/8 border-white/10",
    done:    "bg-green-500/20 border-green-500/30 text-green-400",
    error:   "bg-orange-500/20 border-orange-500/30 text-orange-400",
  }[state];

  if (compact) {
    return (
      <button
        ref={btnRef}
        onClick={handle}
        title={tip}
        className={`w-7 h-7 rounded-lg border flex items-center justify-center
                    transition-all duration-200 ${bg}`}
      >
        <span className="text-slate-300 w-3.5 h-3.5 flex items-center justify-center">{icon}</span>
      </button>
    );
  }

  return (
    <button
      ref={btnRef}
      onClick={handle}
      title={tip}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold
                  transition-all duration-200 ${bg}`}
    >
      <span className="w-3.5 h-3.5 flex items-center justify-center flex-shrink-0">{icon}</span>
      <span className="truncate max-w-[80px] text-slate-200">{tip}</span>
    </button>
  );
}

/* ── SVG icons ─────────────────────────────────── */
const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}
    className="w-full h-full">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M16 11l-4 4m0 0l-4-4m4 4V4"/>
  </svg>
);
const SpinIcon = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full animate-spin" fill="none" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" d="M12 2a10 10 0 110 20A10 10 0 0112 2z" strokeOpacity={0.25}/>
    <path strokeLinecap="round" d="M12 2a10 10 0 019.5 13"/>
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-full h-full text-green-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
  </svg>
);
const OpenIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-full h-full">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
  </svg>
);

/* ══════════════════════════════════════════════════════
   SMALL CARD  (compact grid, ~144px)
══════════════════════════════════════════════════════ */
function SmallCard({ item }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const ts = TYPE_STYLE[item.tipo] || fallbackType;

  return (
    <div
      className="group relative flex flex-col items-center bg-slate-900/60 rounded-2xl
                 border border-slate-700/30 overflow-hidden cursor-default
                 transition-all duration-250
                 hover:border-slate-500/50 hover:-translate-y-1 hover:shadow-lg"
      style={{ width: 148 }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 8px 30px -8px ${ts.color}35`; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = ""; }}
    >
      {/* Image area */}
      <div
        className="relative w-full flex items-center justify-center overflow-hidden"
        style={{
          height: item.tipo === "playercard" ? 108 : 88,
          background: `radial-gradient(circle at 50% 60%, ${ts.color}12 0%, transparent 70%)`,
        }}
      >
        {!imgLoaded && <div className="absolute inset-0 bg-slate-800/50 animate-pulse" />}
        <img
          src={item.tipo === "playercard" ? (item.imagenLarge || item.imagen) : item.imagen}
          alt={item.nameEs}
          loading="lazy"
          className="transition-all duration-300 group-hover:scale-110"
          style={{
            opacity:   imgLoaded ? 1 : 0,
            maxHeight: item.tipo === "playercard" ? 100 : 72,
            maxWidth:  "90%",
            objectFit: "contain",
          }}
          onLoad={() => setImgLoaded(true)}
          onError={(e) => { e.target.style.opacity = 0.2; setImgLoaded(true); }}
        />
        {/* Animated GIF badge */}
        {item.animado && (
          <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md text-[8px] font-black
                          uppercase tracking-wider bg-purple-500/20 border border-purple-500/30 text-purple-300">
            GIF
          </div>
        )}
        {/* Type badge */}
        <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md text-[8px] font-black
                        uppercase tracking-wider border"
          style={{ backgroundColor: ts.bg, borderColor: `${ts.color}30`, color: ts.color }}>
          {ts.icon}
        </div>
      </div>

      {/* Name */}
      <div className="w-full px-2 pt-1.5 pb-2 min-h-[40px] flex flex-col justify-between">
        <p className="text-white text-[10px] font-semibold text-center leading-tight line-clamp-2">
          {item.nameEs}
        </p>
        {/* Download — appears on hover */}
        <div className="mt-1.5 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <DownloadBtn item={item} dlOption={item.downloads[0]} compact />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   LARGE CARD  (detailed grid, ~220px)
══════════════════════════════════════════════════════ */
function LargeCard({ item }) {
  const [imgLoaded,     setImgLoaded]     = useState(false);
  const [showGif,       setShowGif]       = useState(false);
  const [activeDlIdx,   setActiveDlIdx]   = useState(0);
  const ts = TYPE_STYLE[item.tipo] || fallbackType;

  // For player cards: show small / wide / large toggle
  const imgSrc =
    item.tipo === "spray" && showGif && item.gifUrl
      ? item.gifUrl
      : item.imagenLarge || item.imagen;

  return (
    <div
      className="group relative flex flex-col bg-slate-900/70 rounded-2xl
                 border border-slate-700/30 overflow-hidden
                 transition-all duration-300
                 hover:border-slate-500/50 hover:-translate-y-1.5 hover:shadow-2xl"
      style={{ width: 224 }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 20px 50px -10px ${ts.color}30`; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = ""; }}
    >
      {/* Gradient accent top line */}
      <div className="absolute top-0 inset-x-0 h-px z-10"
        style={{ background: `linear-gradient(90deg, transparent, ${ts.color}60, transparent)` }} />

      {/* Image area */}
      <div
        className="relative w-full flex items-center justify-center overflow-hidden"
        style={{
          height: item.tipo === "playercard" ? 180 : 150,
          background: `radial-gradient(ellipse at 50% 70%, ${ts.color}14 0%, transparent 70%)`,
        }}
      >
        {!imgLoaded && <div className="absolute inset-0 bg-slate-800/60 animate-pulse" />}

        <img
          src={imgSrc}
          alt={item.nameEs}
          loading="lazy"
          className="transition-transform duration-400 group-hover:scale-105"
          style={{
            opacity:   imgLoaded ? 1 : 0,
            maxHeight: item.tipo === "playercard" ? 168 : 130,
            maxWidth:  "88%",
            objectFit: "contain",
            transition: "opacity 0.3s, transform 0.4s",
          }}
          onLoad={() => setImgLoaded(true)}
          onError={(e) => { e.target.style.opacity = 0.15; setImgLoaded(true); }}
        />

        {/* Overlay badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {item.animado && (
            <button
              onClick={() => setShowGif(v => !v)}
              className={`px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider border
                         transition-all duration-150 ${showGif ? "bg-purple-500/30 border-purple-400/50 text-purple-200" : "bg-slate-800/70 border-slate-700/50 text-slate-400"}`}
            >
              {showGif ? "◼ GIF" : "▶ GIF"}
            </button>
          )}
        </div>
        <div className="absolute top-2.5 right-2.5">
          <div className="flex items-center gap-1 px-2 py-1 rounded-xl border"
            style={{ backgroundColor: ts.bg, borderColor: `${ts.color}35` }}>
            <span className="text-base leading-none">{ts.icon}</span>
            <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: ts.color }}>
              {ts.label}
            </span>
          </div>
        </div>
      </div>

      {/* Info area */}
      <div className="px-3.5 pt-3 pb-3.5 flex flex-col gap-2.5">
        {/* Names */}
        <div>
          <p className="text-white font-bold text-sm leading-tight line-clamp-2 mb-0.5">
            {item.nameEs}
          </p>
          {item.nameEn !== item.nameEs && (
            <p className="text-slate-500 text-[10px] leading-tight truncate">
              {item.nameEn}
            </p>
          )}
        </div>

        {/* Download options */}
        {item.downloads.length === 1 ? (
          <DownloadBtn item={item} dlOption={item.downloads[0]} />
        ) : (
          <div className="space-y-1.5">
            {/* Option selector */}
            <div className="flex gap-1 flex-wrap">
              {item.downloads.map((dl, i) => (
                <button
                  key={i}
                  onClick={() => setActiveDlIdx(i)}
                  className={`px-2 py-0.5 rounded-md text-[9px] font-bold border transition-all duration-150 ${
                    activeDlIdx === i
                      ? "text-white border-slate-500/50 bg-slate-700/60"
                      : "text-slate-500 border-transparent hover:text-slate-300 hover:bg-slate-800/50"
                  }`}
                >
                  {dl.ext === "gif" ? `🎞 ${dl.label}` : `🖼 ${dl.label}`}
                </button>
              ))}
            </div>
            <DownloadBtn item={item} dlOption={item.downloads[activeDlIdx]} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Public export ─────────────────────────────── */
export function AccesorioCard({ item, size = "sm" }) {
  return size === "lg" ? <LargeCard item={item} /> : <SmallCard item={item} />;
}

export default AccesorioCard;
