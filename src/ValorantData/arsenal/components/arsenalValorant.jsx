import React, { useState, useMemo, useEffect, useRef } from "react";
import anime from "animejs";
import { useArmas } from "../hooks/useArmas";
import WeaponCard from "./WeaponCard";
import WeaponDetail from "./WeaponDetail";
import { ArsenalLoadingSkeleton } from "../../../shared/loadingSkeletons";

const CATEGORIAS = [
  { key: "Todas",   label: "Todas"          },
  { key: "Rifle",   label: "Rifles"         },
  { key: "SMG",     label: "Subfusiles"     },
  { key: "Shotgun", label: "Escopetas"      },
  { key: "Sidearm", label: "Pistolas"       },
  { key: "Sniper",  label: "Francotiradores"},
  { key: "Heavy",   label: "Armas Pesadas"  },
  { key: "Melee",   label: "Cuerpo a Cuerpo"},
];

const categorySortOrder = { Sidearm: 0, SMG: 1, Shotgun: 2, Rifle: 3, Sniper: 4, Heavy: 5, Melee: 6 };

export default function ArsenalValorant() {
  const { armas, cargando, error } = useArmas();
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");
  const [armaSeleccionada, setArmaSeleccionada] = useState(null);
  const [search, setSearch] = useState("");
  const gridRef  = useRef(null);
  const headerRef = useRef(null);
  const prevCat  = useRef("Todas");

  const armasFiltradas = useMemo(() => {
    let filtered = armas;
    if (categoriaActiva !== "Todas") filtered = armas.filter((a) => a.categoria === categoriaActiva);
    if (search.trim()) filtered = filtered.filter((a) => a.nombre.toLowerCase().includes(search.toLowerCase()));
    return [...filtered].sort((a, b) => {
      const cA = categorySortOrder[a.categoria] ?? 99;
      const cB = categorySortOrder[b.categoria] ?? 99;
      return cA !== cB ? cA - cB : (b.costo ?? 0) - (a.costo ?? 0);
    });
  }, [armas, categoriaActiva, search]);

  /* header entrance */
  useEffect(() => {
    if (!headerRef.current) return;
    anime({
      targets:    headerRef.current.querySelectorAll(".header-part"),
      translateY: [30, 0],
      opacity:    [0, 1],
      duration:   700,
      delay:      anime.stagger(100),
      easing:     "easeOutExpo",
    });
  }, []);

  /* grid entrance / category change */
  useEffect(() => {
    if (!gridRef.current || cargando) return;
    const cards = gridRef.current.querySelectorAll(".weapon-card-wrap");
    if (!cards.length) return;
    anime({
      targets:    cards,
      translateY: [20, 0],
      opacity:    [0, 1],
      scale:      [0.95, 1],
      duration:   450,
      delay:      anime.stagger(40),
      easing:     "easeOutExpo",
    });
    prevCat.current = categoriaActiva;
  }, [armasFiltradas, cargando]);

  if (cargando) return <ArsenalLoadingSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-spectrum-darker page-pattern">
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-10 text-center max-w-md">
          <svg className="w-14 h-14 mx-auto mb-4 text-red-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p className="text-red-400 text-sm font-medium">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-spectrum-darker page-pattern py-10 px-4">

      {/* ── Header ── */}
      <div ref={headerRef} className="text-center mb-8 max-w-3xl mx-auto">
        <p className="header-part opacity-0 text-spectrum-cyan/60 text-[10px] font-black tracking-[0.4em] uppercase mb-3">
          Valorant
        </p>
        <h1 className="header-part opacity-0 text-4xl font-display font-black text-white uppercase tracking-widest
                       drop-shadow-[0_0_30px_rgba(0,247,255,0.3)]">
          Arsenal
        </h1>
        <p className="header-part opacity-0 text-sm text-slate-500 mt-2">
          {armas.length} armas disponibles
        </p>

        {/* Search */}
        <div className="header-part opacity-0 mt-5 relative max-w-xs mx-auto">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar arma..."
            className="w-full pl-10 pr-4 py-2 bg-slate-800/40 border border-slate-700/30 rounded-xl
                       text-sm text-white placeholder-slate-600 focus:outline-none focus:border-spectrum-cyan/40
                       focus:ring-1 focus:ring-spectrum-cyan/20 transition-all"
          />
        </div>
      </div>

      {/* ── Category tabs ── */}
      <div className="flex justify-center mb-8">
        <div className="flex flex-wrap justify-center gap-1.5 bg-slate-800/30 border border-slate-700/20
                        rounded-2xl p-2 max-w-3xl">
          {CATEGORIAS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setCategoriaActiva(key)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl
                          transition-all duration-200 border
                ${categoriaActiva === key
                  ? "bg-spectrum-cyan/15 text-spectrum-cyan border-spectrum-cyan/40 shadow-cyan"
                  : "text-slate-400 border-transparent hover:text-white hover:bg-white/5"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Weapon grid ── */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
                   gap-4 max-w-screen-2xl mx-auto"
      >
        {armasFiltradas.map((arma) => (
          <div
            key={arma.uuid}
            className="weapon-card-wrap"
            style={{ opacity: 0 }}
          >
            <WeaponCard arma={arma} onClick={setArmaSeleccionada} />
          </div>
        ))}
      </div>

      {armasFiltradas.length === 0 && !cargando && (
        <div className="text-center py-20">
          <span className="text-5xl mb-4 block">🔍</span>
          <p className="text-slate-500 text-sm">No se encontraron armas.</p>
        </div>
      )}

      {armaSeleccionada && (
        <WeaponDetail arma={armaSeleccionada} onClose={() => setArmaSeleccionada(null)} />
      )}
    </div>
  );
}
