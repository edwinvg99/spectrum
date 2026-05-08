import React, {
  useState, useEffect, useMemo, useRef, useCallback,
} from "react";
import anime from "animejs";
import { useAccesorios } from "../hooks/useAccesorios";
import { AccesorioCard } from "./AccesorioCard";

/* ── Config ─────────────────────────────────── */
const PAGE_SIZE = 80;

const TYPE_TABS = [
  { key: "all",        label: "Todos",    icon: "✨", color: "#94a3b8" },
  { key: "buddy",      label: "Llaveros", icon: "🔑", color: "#f59e0b" },
  { key: "spray",      label: "Sprays",   icon: "🎨", color: "#a78bfa" },
  { key: "playercard", label: "Tarjetas", icon: "🃏", color: "#22d3ee" },
];

/* ── Skeleton grid ───────────────────────────── */
function SkeletonGrid({ size }) {
  const count = size === "lg" ? 24 : 40;
  const w     = size === "lg" ? 224 : 148;
  const h     = size === "lg" ? 280 : 185;
  return (
    <div className="flex flex-wrap justify-center gap-3 animate-pulse">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="rounded-2xl bg-slate-800/50 border border-slate-700/30"
          style={{ width: w, height: h }} />
      ))}
    </div>
  );
}

/* ── Stats badge ─────────────────────────────── */
function StatBadge({ label, count, color }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border"
      style={{ backgroundColor: `${color}10`, borderColor: `${color}25` }}>
      <span className="text-base leading-none">{label}</span>
      <span className="text-xs font-black tabular-nums" style={{ color }}>{count.toLocaleString()}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════ */
export default function AccesoriosPage() {
  const { items, loading, error, fromCache, reload } = useAccesorios();

  const [search,    setSearch]    = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [viewSize,  setViewSize]  = useState("sm");  // "sm" | "lg"
  const [shown,     setShown]     = useState(PAGE_SIZE);
  const [sortBy,    setSortBy]    = useState("name"); // "name" | "tipo"

  const headerRef = useRef(null);
  const gridRef   = useRef(null);
  const searchRef = useRef(null);

  /* ── Filtered + sorted list ── */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = items;

    if (activeTab !== "all") {
      list = list.filter(x => x.tipo === activeTab);
    }
    if (q) {
      list = list.filter(x =>
        x.nameEs.toLowerCase().includes(q) ||
        x.nameEn.toLowerCase().includes(q)
      );
    }
    if (sortBy === "name") {
      list = [...list].sort((a, b) => a.nameEs.localeCompare(b.nameEs, "es"));
    } else {
      list = [...list].sort((a, b) => a.tipo.localeCompare(b.tipo));
    }
    return list;
  }, [items, search, activeTab, sortBy]);

  const visible = useMemo(() => filtered.slice(0, shown), [filtered, shown]);

  /* ── Reset pagination when filter changes ── */
  useEffect(() => { setShown(PAGE_SIZE); }, [search, activeTab, sortBy]);

  /* ── Header entrance ── */
  useEffect(() => {
    if (loading || !headerRef.current) return;
    anime({
      targets:    headerRef.current.querySelectorAll(".h-part"),
      translateY: [30, 0],
      opacity:    [0, 1],
      duration:   700,
      delay:      anime.stagger(80),
      easing:     "easeOutExpo",
    });
  }, [loading]);

  /* ── Grid entrance (on filter/view change) ── */
  useEffect(() => {
    if (loading || !gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(".acc-wrap");
    if (!cards.length) return;
    anime({
      targets:  cards,
      opacity:  [0, 1],
      translateY: [20, 0],
      scale:    [0.93, 1],
      duration: 400,
      delay:    anime.stagger(18, { grid: [Math.ceil(Math.sqrt(cards.length)), Math.floor(Math.sqrt(cards.length))], from: "first" }),
      easing:   "easeOutExpo",
    });
  }, [visible, viewSize, loading]);

  /* ── Keyboard shortcut: focus search on "/" ── */
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

  /* ── Counts per type ── */
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
          <div className="text-6xl mb-4">😵</div>
          <h2 className="text-xl font-bold text-red-300 mb-2">Error cargando accesorios</h2>
          <p className="text-sm text-red-400/70 mb-5">{error}</p>
          <button onClick={reload}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm rounded-lg
                       border border-slate-700 hover:border-spectrum-cyan/30 transition-all">
            ↺ Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-spectrum-darker page-pattern pb-24">

      {/* ── Hero gradient ── */}
      <div className="absolute inset-x-0 top-16 h-72 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(245,158,11,0.07) 0%, rgba(167,139,250,0.05) 40%, transparent 100%)" }} />

      {/* ══ HEADER ══ */}
      <div ref={headerRef} className="relative text-center pt-12 pb-4 px-4 max-w-3xl mx-auto">
        <p className="h-part opacity-0 text-[10px] font-black tracking-[0.4em] uppercase mb-3"
          style={{ color: "rgba(245,158,11,0.6)" }}>
          Valorant · Cosméticos
        </p>
        <h1 className="h-part opacity-0 text-5xl font-display font-black text-white uppercase tracking-widest"
          style={{ textShadow: "0 0 40px rgba(245,158,11,0.25)" }}>
          Accesorios
        </h1>
        <p className="h-part opacity-0 text-slate-500 text-sm mt-2">
          Explora llaveros, sprays y tarjetas · busca en español o inglés
        </p>

        {/* Divider */}
        <div className="h-part opacity-0 flex items-center gap-4 justify-center mt-4 max-w-xs mx-auto">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-yellow-500/30" />
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50" />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-yellow-500/30" />
        </div>

        {/* Stats badges */}
        {!loading && (
          <div className="h-part opacity-0 flex justify-center gap-2 mt-5 flex-wrap">
            <StatBadge label="🔑" count={counts.buddy}      color="#f59e0b" />
            <StatBadge label="🎨" count={counts.spray}      color="#a78bfa" />
            <StatBadge label="🃏" count={counts.playercard} color="#22d3ee" />
          </div>
        )}
      </div>

      {/* ══ CONTROLS ══ */}
      <div className="relative max-w-5xl mx-auto px-4 mt-6 space-y-4">

        {/* Search + View toggle row */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[260px] max-w-md">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
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
              className="w-full pl-10 pr-10 py-2.5 bg-slate-800/60 border border-slate-700/40 rounded-xl
                         text-sm text-white placeholder-slate-600
                         focus:outline-none focus:border-yellow-500/40 focus:ring-1 focus:ring-yellow-500/20
                         transition-all duration-200"
            />
            {search && (
              <button onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-3 py-2.5 bg-slate-800/60 border border-slate-700/40 rounded-xl text-sm
                       text-slate-300 focus:outline-none focus:border-yellow-500/30 transition-all
                       cursor-pointer appearance-none pr-8"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "16px" }}
          >
            <option value="name">A–Z Nombre</option>
            <option value="tipo">Por tipo</option>
          </select>

          {/* View toggle */}
          <div className="flex gap-1 bg-slate-800/60 border border-slate-700/40 rounded-xl p-1">
            {[
              { key: "sm", icon: <GridSmIcon />,  label: "Vista compacta" },
              { key: "lg", icon: <GridLgIcon />,  label: "Vista grande"   },
            ].map(({ key, icon, label }) => (
              <button
                key={key}
                onClick={() => setViewSize(key)}
                title={label}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200
                            text-slate-400 ${viewSize === key
                              ? "bg-slate-700 text-white shadow-sm"
                              : "hover:bg-slate-700/40 hover:text-slate-200"}`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Type tabs */}
        <div className="flex flex-wrap justify-center gap-1.5 bg-slate-900/50 border border-slate-700/25
                        rounded-2xl p-2 backdrop-blur-sm">
          {TYPE_TABS.map(({ key, label, icon, color }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider
                          rounded-xl transition-all duration-200 border ${
                activeTab === key
                  ? "shadow-lg"
                  : "text-slate-400 border-transparent hover:text-white hover:bg-white/5"
              }`}
              style={activeTab === key ? {
                color,
                backgroundColor: `${color}15`,
                borderColor: `${color}45`,
                boxShadow: `0 0 16px ${color}20`,
              } : {}}
            >
              <span className="text-base leading-none">{icon}</span>
              {label}
              {key !== "all" && (
                <span className="ml-0.5 text-[9px] opacity-60 font-normal tabular-nums">
                  {counts[key] ?? 0}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Result count */}
        <div className="text-center">
          <span className="text-xs text-slate-600">
            {search
              ? <><span className="text-slate-300 font-semibold">{filtered.length}</span> resultados para "<span className="text-yellow-400/80">{search}</span>"</>
              : <><span className="text-slate-400 font-semibold">{filtered.length}</span> {filtered.length === 1 ? "item" : "items"}</>
            }
            {shown < filtered.length && <span className="ml-1">(mostrando {shown})</span>}
          </span>
        </div>
      </div>

      {/* ══ GRID ══ */}
      <div className="relative max-w-screen-2xl mx-auto px-4 mt-8">
        {loading ? (
          <SkeletonGrid size={viewSize} />
        ) : visible.length === 0 ? (
          <EmptyState query={search} onClear={() => { setSearch(""); setActiveTab("all"); }} />
        ) : (
          <>
            <div
              ref={gridRef}
              className="flex flex-wrap justify-center"
              style={{ gap: viewSize === "lg" ? "16px" : "10px" }}
            >
              {visible.map(item => (
                <div key={item.uuid} className="acc-wrap" style={{ opacity: 0 }}>
                  <AccesorioCard item={item} size={viewSize} />
                </div>
              ))}
            </div>

            {/* Load more */}
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
        <div className="fixed bottom-4 right-4 z-30 flex items-center gap-1.5 px-3 py-1.5
                        bg-slate-900/80 border border-slate-700/40 rounded-lg backdrop-blur-sm
                        text-[10px] text-slate-500 animate-fade-in">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400/60" />
          Desde caché
        </div>
      )}
    </div>
  );
}

/* ── Sub-components ──────────────────────────── */
function EmptyState({ query, onClear }) {
  return (
    <div className="text-center py-24">
      <div className="text-6xl mb-4">🔍</div>
      <p className="text-slate-400 font-semibold mb-1">
        {query ? `Sin resultados para "${query}"` : "Sin items en esta categoría"}
      </p>
      <p className="text-slate-600 text-sm mb-5">Intenta en el otro idioma o ajusta el filtro</p>
      <button onClick={onClear}
        className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white
                   text-sm rounded-lg border border-slate-700 hover:border-slate-600 transition-all">
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
      anime({ targets: btnRef.current, scale: [0.95, 1], duration: 300, easing: "easeOutBack" });
    }
  };
  return (
    <div className="text-center mt-12">
      <button
        ref={btnRef}
        onClick={handle}
        className="px-8 py-3 bg-slate-800/80 hover:bg-slate-700/80 text-white font-semibold text-sm
                   rounded-xl border border-slate-700/50 hover:border-slate-600/60
                   transition-all duration-200 hover:scale-105 active:scale-95
                   backdrop-blur-sm"
      >
        Cargar {Math.min(PAGE_SIZE, remaining)} más
        <span className="ml-2 text-slate-500 font-normal text-xs">({remaining} restantes)</span>
      </button>
    </div>
  );
}

/* ── Grid view icons ─────────────────────────── */
const GridSmIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <rect x="2"  y="2"  width="7" height="7" rx="1.5"/>
    <rect x="11" y="2"  width="7" height="7" rx="1.5"/>
    <rect x="2"  y="11" width="7" height="7" rx="1.5"/>
    <rect x="11" y="11" width="7" height="7" rx="1.5"/>
  </svg>
);
const GridLgIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 20 20" strokeWidth={1.8}>
    <rect x="2" y="2" width="7" height="16" rx="1.5"/>
    <rect x="11" y="2" width="7" height="16" rx="1.5"/>
  </svg>
);
