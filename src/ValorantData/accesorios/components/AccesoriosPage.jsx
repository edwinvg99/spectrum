import React, {
  useState, useEffect, useMemo, useRef, useCallback,
} from "react";
import anime from "animejs";
import { useAccesorios }            from "../hooks/useAccesorios";
import { AccesorioCard, DownloadBtn, TYPE_STYLE } from "./AccesorioCard";

const PAGE_SIZE = 80;

const TYPE_TABS = [
  { key: "all",        label: "Todos",    color: "rgba(0,247,255,0.7)" },
  { key: "buddy",      label: "Llaveros", color: "#f59e0b" },
  { key: "spray",      label: "Sprays",   color: "#a78bfa" },
  { key: "playercard", label: "Tarjetas", color: "#22d3ee" },
];

/* ── map download label → preview image URL ─── */
function getVariantImage(item, dlLabel) {
  switch (dlLabel) {
    case "Grande":      return item.imagenLarge || item.imagen;
    case "Ancha":       return item.imagenWide  || item.imagenLarge;
    case "Pequeña":     return item.imagen;
    case "GIF animado": return item.gifUrl;
    default:            return item.imagenLarge || item.imagen;
  }
}

/* ══════════════════════════════════════════════
   MODAL
══════════════════════════════════════════════ */
function ItemModal({ item, onClose }) {
  const ts = TYPE_STYLE[item?.tipo] || { label: "Item", color: "#64748b" };

  /* close on Escape */
  useEffect(() => {
    if (!item) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [item, onClose]);

  if (!item) return null;

  const isWide   = (dl) => dl.label === "Ancha";
  const imgStyle = (dl) => isWide(dl)
    ? { maxWidth: "100%", maxHeight: 160, objectFit: "contain" }
    : { maxWidth: "100%", maxHeight: 260, objectFit: "contain" };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(4,11,20,0.88)",
        backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px 16px",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: "relative",
          background: "rgba(8,16,28,0.97)",
          border: "1px solid rgba(0,247,255,0.22)",
          borderRadius: 16,
          width: "100%",
          maxWidth: 820,
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "32px 28px 28px",
          boxShadow: "0 0 80px rgba(0,247,255,0.08), 0 40px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 16, right: 16,
            width: 32, height: 32,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            color: "rgba(255,255,255,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", fontSize: 16, transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
        >
          ✕
        </button>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{
            display: "inline-block",
            padding: "2px 10px",
            background: `${ts.color}15`,
            border: `1px solid ${ts.color}35`,
            borderRadius: 999,
            color: ts.color,
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: 10,
          }}>
            {ts.label}
          </div>
          <h2 style={{
            margin: 0,
            fontFamily: "'Rajdhani', 'Impact', sans-serif",
            fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
            fontWeight: 700,
            color: "#fff",
            textTransform: "uppercase",
            letterSpacing: "0.03em",
            textShadow: "0 0 22px rgba(0,247,255,0.3)",
            lineHeight: 1.1,
          }}>
            {item.nameEs}
          </h2>
          {item.nameEn && item.nameEn !== item.nameEs && (
            <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,0.3)", fontSize: "0.78rem", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.05em" }}>
              {item.nameEn}
            </p>
          )}
        </div>

        {/* Divider */}
        <div style={{
          height: 1,
          background: "linear-gradient(90deg, rgba(0,247,255,0.25) 0%, rgba(168,85,247,0.2) 50%, transparent 100%)",
          marginBottom: 24,
        }} />

        {/* Variants */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 20,
          justifyContent: item.downloads.length === 1 ? "center" : "flex-start",
        }}>
          {item.downloads.map((dl, i) => {
            const previewSrc = getVariantImage(item, dl.label);
            const wide = dl.label === "Ancha";

            return (
              <div
                key={i}
                style={{
                  flex: wide ? "1 1 100%" : "1 1 200px",
                  maxWidth: wide ? "100%" : 260,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                {/* Variant label */}
                <div style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(0,247,255,0.6)",
                  alignSelf: "flex-start",
                }}>
                  {dl.label}
                  {dl.ext === "gif" && (
                    <span style={{ marginLeft: 6, color: "#c4b5fd" }}>· Animado</span>
                  )}
                </div>

                {/* Preview box */}
                <div style={{
                  width: "100%",
                  background: "rgba(4,11,20,0.7)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 16,
                  minHeight: wide ? 100 : 160,
                }}>
                  {previewSrc ? (
                    <img
                      src={previewSrc}
                      alt={`${item.nameEs} — ${dl.label}`}
                      style={imgStyle(dl)}
                      loading="lazy"
                    />
                  ) : (
                    <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.75rem", fontFamily: "'Rajdhani', sans-serif" }}>
                      Sin vista previa
                    </span>
                  )}
                </div>

                {/* Download button */}
                <DownloadBtn item={item} dlOption={dl} variant="primary" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Skeleton ─────────────────────────────── */
function SkeletonGrid() {
  return (
    <div className="flex flex-wrap justify-center gap-4 animate-pulse">
      {[...Array(24)].map((_, i) => (
        <div key={i} style={{ width: 200, height: 248, borderRadius: 14, background: "rgba(10,22,40,0.6)", border: "1px solid rgba(0,247,255,0.06)" }} />
      ))}
    </div>
  );
}

/* ── Stats badge (no emoji) ───────────────── */
function StatBadge({ label, count, color }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      padding: "5px 12px",
      background: `${color}0d`,
      border: `1px solid ${color}25`,
      borderRadius: 8,
    }}>
      <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase" }}>{label}</span>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", fontWeight: 700, color }}>{count.toLocaleString()}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════ */
export default function AccesoriosPage() {
  const { items, loading, error, fromCache, reload } = useAccesorios();

  const [search,       setSearch]       = useState("");
  const [activeTab,    setActiveTab]    = useState("all");
  const [shown,        setShown]        = useState(PAGE_SIZE);
  const [sortBy,       setSortBy]       = useState("name");
  const [selectedItem, setSelectedItem] = useState(null);

  const headerRef = useRef(null);
  const gridRef   = useRef(null);
  const searchRef = useRef(null);

  /* ── Filtered list ── */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = items;
    if (activeTab !== "all") list = list.filter(x => x.tipo === activeTab);
    if (q) list = list.filter(x =>
      x.nameEs.toLowerCase().includes(q) ||
      x.nameEn.toLowerCase().includes(q)
    );
    if (sortBy === "name") list = [...list].sort((a, b) => a.nameEs.localeCompare(b.nameEs, "es"));
    else                   list = [...list].sort((a, b) => a.tipo.localeCompare(b.tipo));
    return list;
  }, [items, search, activeTab, sortBy]);

  const visible = useMemo(() => filtered.slice(0, shown), [filtered, shown]);

  useEffect(() => { setShown(PAGE_SIZE); }, [search, activeTab, sortBy]);

  /* ── Header entrance ── */
  useEffect(() => {
    if (loading || !headerRef.current) return;
    anime({
      targets:    headerRef.current.querySelectorAll(".h-part"),
      translateY: [24, 0],
      opacity:    [0, 1],
      duration:   650,
      delay:      anime.stagger(70),
      easing:     "easeOutExpo",
    });
  }, [loading]);

  /* ── Grid entrance ── */
  useEffect(() => {
    if (loading || !gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(".acc-wrap");
    if (!cards.length) return;
    anime({
      targets:    cards,
      opacity:    [0, 1],
      translateY: [16, 0],
      scale:      [0.94, 1],
      duration:   380,
      delay:      anime.stagger(14, { from: "first" }),
      easing:     "easeOutExpo",
    });
  }, [visible, loading]);

  /* ── Keyboard shortcut: "/" focuses search ── */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/" && document.activeElement.tagName !== "INPUT") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ── Counts ── */
  const counts = useMemo(() => ({
    buddy:      items.filter(x => x.tipo === "buddy").length,
    spray:      items.filter(x => x.tipo === "spray").length,
    playercard: items.filter(x => x.tipo === "playercard").length,
  }), [items]);

  /* ── Error ── */
  if (error) {
    return (
      <div className="min-h-screen bg-spectrum-darker page-pattern flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h2 style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "1.4rem", fontWeight: 700, color: "#fca5a5", letterSpacing: "0.05em", marginBottom: 8 }}>
            Error cargando accesorios
          </h2>
          <p className="text-sm text-red-400/70 mb-5">{error}</p>
          <button
            onClick={reload}
            style={{
              padding: "10px 28px",
              background: "rgba(0,247,255,0.08)",
              border: "1px solid rgba(0,247,255,0.25)",
              borderRadius: 8,
              color: "rgba(0,247,255,0.9)",
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 700,
              fontSize: "0.8rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-spectrum-darker page-pattern pb-24">

      {/* Subtle gradient */}
      <div className="absolute inset-x-0 top-16 h-64 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(0,247,255,0.04) 0%, transparent 100%)" }} />

      {/* ══ HEADER ══ */}
      <div ref={headerRef} className="relative text-center pt-12 pb-4 px-4 max-w-3xl mx-auto">

        <p className="h-part opacity-0" style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: "0.65rem", fontWeight: 700,
          letterSpacing: "0.45em",
          color: "rgba(0,247,255,0.5)",
          textTransform: "uppercase",
          marginBottom: 12,
        }}>
          Valorant · Cosméticos
        </p>

        <h1 className="h-part opacity-0" style={{
          fontFamily: "'Rajdhani', 'Impact', sans-serif",
          fontSize: "clamp(2.4rem, 6vw, 4rem)",
          fontWeight: 900,
          color: "#ffffff",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          textShadow: "0 0 28px rgba(0,247,255,0.35), 0 0 70px rgba(0,247,255,0.12)",
          margin: "0 0 8px",
        }}>
          Accesorios
        </h1>

        <p className="h-part opacity-0" style={{
          color: "rgba(255,255,255,0.38)",
          fontSize: "0.82rem",
          fontFamily: "'Rajdhani', sans-serif",
          letterSpacing: "0.08em",
          margin: "0 0 18px",
        }}>
          Llaveros, sprays y tarjetas — busca en español o inglés
        </p>

        {/* Accent divider */}
        <div className="h-part opacity-0" style={{
          height: 1,
          maxWidth: 200,
          margin: "0 auto 18px",
          background: "linear-gradient(90deg, transparent, rgba(0,247,255,0.4), transparent)",
        }} />

        {/* Stats */}
        {!loading && (
          <div className="h-part opacity-0" style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
            <StatBadge label="Llaveros" count={counts.buddy}      color="#f59e0b" />
            <StatBadge label="Sprays"   count={counts.spray}      color="#a78bfa" />
            <StatBadge label="Tarjetas" count={counts.playercard} color="#22d3ee" />
          </div>
        )}
      </div>

      {/* ══ CONTROLS ══ */}
      <div className="relative max-w-5xl mx-auto px-4 mt-6 space-y-3">

        {/* Search + Sort */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          {/* Search */}
          <div style={{ position: "relative", flex: "1", minWidth: 260, maxWidth: 420 }}>
            <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: "rgba(255,255,255,0.25)" }}
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar en español o inglés…  [/]"
              style={{
                width: "100%",
                paddingLeft: 36, paddingRight: 36, paddingTop: 10, paddingBottom: 10,
                background: "rgba(10,18,32,0.7)",
                border: "1px solid rgba(0,247,255,0.14)",
                borderRadius: 9,
                color: "#e2e8f0",
                fontSize: "0.82rem",
                fontFamily: "'Rajdhani', sans-serif",
                letterSpacing: "0.04em",
                outline: "none",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
              }}
              onFocus={e => { e.target.style.borderColor = "rgba(0,247,255,0.35)"; }}
              onBlur={e => { e.target.style.borderColor = "rgba(0,247,255,0.14)"; }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{
                  position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", color: "rgba(255,255,255,0.3)",
                  cursor: "pointer", padding: 2,
                }}
              >
                <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{
              padding: "10px 32px 10px 12px",
              background: "rgba(10,18,32,0.7)",
              border: "1px solid rgba(0,247,255,0.14)",
              borderRadius: 9,
              color: "rgba(255,255,255,0.6)",
              fontSize: "0.8rem",
              fontFamily: "'Rajdhani', sans-serif",
              letterSpacing: "0.06em",
              outline: "none",
              cursor: "pointer",
              appearance: "none",
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2300f7ff40' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 10px center",
              backgroundSize: 14,
            }}
          >
            <option value="name">A–Z Nombre</option>
            <option value="tipo">Por tipo</option>
          </select>
        </div>

        {/* Type tabs */}
        <div style={{
          display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 6,
          background: "rgba(4,11,20,0.5)",
          border: "1px solid rgba(0,247,255,0.1)",
          borderRadius: 12,
          padding: "8px 10px",
          backdropFilter: "blur(8px)",
        }}>
          {TYPE_TABS.map(({ key, label, color }) => {
            const active = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  padding: "6px 16px",
                  borderRadius: 8,
                  border: active ? `1px solid ${color}40` : "1px solid transparent",
                  background: active ? `${color}12` : "transparent",
                  color: active ? color : "rgba(255,255,255,0.35)",
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: active ? `0 0 12px ${color}18` : "none",
                }}
              >
                {label}
                {key !== "all" && (
                  <span style={{ fontSize: "0.6rem", opacity: 0.5, fontWeight: 400, fontFamily: "'JetBrains Mono', monospace" }}>
                    {counts[key] ?? 0}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Result count */}
        <div style={{ textAlign: "center" }}>
          <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.68rem", letterSpacing: "0.08em", color: "rgba(255,255,255,0.22)" }}>
            {search
              ? <><span style={{ color: "rgba(255,255,255,0.55)" }}>{filtered.length}</span>{" resultados para \""}<span style={{ color: "rgba(0,247,255,0.7)" }}>{search}</span>{"\""}  </>
              : <><span style={{ color: "rgba(255,255,255,0.45)" }}>{filtered.length}</span>{" items"}</>
            }
            {shown < filtered.length && ` — mostrando ${shown}`}
          </span>
        </div>
      </div>

      {/* ══ GRID ══ */}
      <div className="relative max-w-screen-2xl mx-auto px-4 mt-8">
        {loading ? (
          <SkeletonGrid />
        ) : visible.length === 0 ? (
          <EmptyState query={search} onClear={() => { setSearch(""); setActiveTab("all"); }} />
        ) : (
          <>
            <div ref={gridRef} className="flex flex-wrap justify-center" style={{ gap: 16 }}>
              {visible.map(item => (
                <div key={item.uuid} className="acc-wrap" style={{ opacity: 0 }}>
                  <AccesorioCard item={item} onClick={setSelectedItem} />
                </div>
              ))}
            </div>

            {shown < filtered.length && (
              <LoadMoreBtn
                shown={shown}
                total={filtered.length}
                onLoad={() => setShown(s => s + PAGE_SIZE)}
              />
            )}
          </>
        )}
      </div>

      {/* Cache indicator */}
      {fromCache && !loading && (
        <div style={{
          position: "fixed", bottom: 16, right: 16, zIndex: 30,
          display: "flex", alignItems: "center", gap: 6,
          padding: "5px 12px",
          background: "rgba(4,11,20,0.85)",
          border: "1px solid rgba(0,247,255,0.15)",
          borderRadius: 8,
          backdropFilter: "blur(8px)",
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: "0.65rem",
          fontWeight: 600,
          letterSpacing: "0.1em",
          color: "rgba(255,255,255,0.3)",
          textTransform: "uppercase",
        }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#34d399", boxShadow: "0 0 4px #34d399" }} />
          Desde caché
        </div>
      )}

      {/* ══ MODAL ══ */}
      <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}

/* ── Sub-components ─────────────────────── */
function EmptyState({ query, onClear }) {
  return (
    <div style={{ textAlign: "center", padding: "80px 0" }}>
      <p style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Rajdhani', sans-serif", fontSize: "1rem", fontWeight: 600, letterSpacing: "0.06em", marginBottom: 6 }}>
        {query ? `Sin resultados para "${query}"` : "Sin items en esta categoría"}
      </p>
      <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.8rem", fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.04em", marginBottom: 20 }}>
        Intenta en el otro idioma o ajusta el filtro
      </p>
      <button
        onClick={onClear}
        style={{
          padding: "9px 24px",
          background: "rgba(0,247,255,0.07)",
          border: "1px solid rgba(0,247,255,0.2)",
          borderRadius: 8,
          color: "rgba(0,247,255,0.7)",
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: "0.75rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          cursor: "pointer",
        }}
      >
        Limpiar filtros
      </button>
    </div>
  );
}

function LoadMoreBtn({ shown, total, onLoad }) {
  const remaining = total - shown;
  const btnRef = useRef(null);
  const handle = () => {
    onLoad();
    if (btnRef.current) {
      anime({ targets: btnRef.current, scale: [0.95, 1], duration: 280, easing: "easeOutBack" });
    }
  };
  return (
    <div style={{ textAlign: "center", marginTop: 48 }}>
      <button
        ref={btnRef}
        onClick={handle}
        style={{
          padding: "12px 36px",
          background: "rgba(0,247,255,0.07)",
          border: "1px solid rgba(0,247,255,0.2)",
          borderRadius: 10,
          color: "rgba(0,247,255,0.8)",
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: "0.8rem",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,247,255,0.12)"; e.currentTarget.style.borderColor = "rgba(0,247,255,0.35)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,247,255,0.07)"; e.currentTarget.style.borderColor = "rgba(0,247,255,0.2)"; }}
      >
        Cargar {Math.min(PAGE_SIZE, remaining)} más
        <span style={{ marginLeft: 8, opacity: 0.45, fontWeight: 400, fontSize: "0.7rem" }}>
          ({remaining} restantes)
        </span>
      </button>
    </div>
  );
}
