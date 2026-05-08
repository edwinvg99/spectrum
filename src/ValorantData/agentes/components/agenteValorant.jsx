import React, { useState, useEffect, useRef, useMemo } from 'react';
import anime from 'animejs';
import { usePersonajes } from "../hooks/usePersonajes";
import AgentCard from "./AgentCard";
import AgentDetailModal from "./AgentDetailModal";
import { AgentsLoadingSkeleton } from "../../../sharred/loadingSkeletons";

/* ── Role filter options ── */
const ROLE_FILTERS = [
  { key: 'Todos',       color: '#94a3b8' },
  { key: 'Duelista',    color: '#f87171' },
  { key: 'Iniciador',   color: '#22d3ee' },
  { key: 'Controlador', color: '#a855f7' },
  { key: 'Centinela',   color: '#4ade80' },
];

export default function PersonajesValorant() {
  const { personajes, cargando, error } = usePersonajes();

  const [selectedAgent, setSelectedAgent] = useState(null);
  const [activeRole,    setActiveRole]    = useState('Todos');
  const [search,        setSearch]        = useState('');

  const headerRef = useRef(null);
  const gridRef   = useRef(null);

  /* ── Filtered list ── */
  const filtered = useMemo(() => {
    return personajes.filter(a => {
      const roleOk   = activeRole === 'Todos' || a.rol === activeRole;
      const searchOk = !search.trim() || a.nombre.toLowerCase().includes(search.toLowerCase());
      return roleOk && searchOk;
    });
  }, [personajes, activeRole, search]);

  /* ── Header entrance ── */
  useEffect(() => {
    if (cargando || !headerRef.current) return;
    anime({
      targets:    headerRef.current.querySelectorAll('.h-part'),
      translateY: [30, 0],
      opacity:    [0, 1],
      duration:   700,
      delay:      anime.stagger(100),
      easing:     'easeOutExpo',
    });
  }, [cargando]);

  /* ── Grid entrance on filter/search change ── */
  useEffect(() => {
    if (cargando || !gridRef.current) return;
    const cards = gridRef.current.querySelectorAll('.agent-wrap');
    if (!cards.length) return;
    anime({
      targets:    cards,
      translateY: [24, 0],
      opacity:    [0, 1],
      scale:      [0.94, 1],
      duration:   450,
      delay:      anime.stagger(35),
      easing:     'easeOutExpo',
    });
  }, [filtered, cargando]);

  /* ── Lock body scroll when modal is open ── */
  useEffect(() => {
    document.body.style.overflow = selectedAgent ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedAgent]);

  /* ── Early returns ── */
  if (cargando) return <AgentsLoadingSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-spectrum-darker page-pattern">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 text-center max-w-md">
          <svg className="w-14 h-14 mx-auto mb-4 text-red-500/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p className="text-red-400 font-semibold">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-spectrum-darker page-pattern pb-20">

      {/* ── Hero gradient ── */}
      <div className="absolute inset-x-0 top-16 h-64 bg-gradient-to-b from-red-900/8 via-spectrum-purple/5 to-transparent pointer-events-none" />

      {/* ── Header ── */}
      <div ref={headerRef} className="relative text-center pt-12 pb-2 px-4 max-w-3xl mx-auto">
        <p className="h-part opacity-0 text-spectrum-cyan/60 text-[10px] font-black tracking-[0.4em] uppercase mb-3">
          Valorant
        </p>
        <h1 className="h-part opacity-0 text-5xl font-display font-black text-white uppercase tracking-widest
                       drop-shadow-[0_0_40px_rgba(248,113,113,0.3)]">
          Agentes
        </h1>
        <p className="h-part opacity-0 text-slate-500 text-sm mt-2">
          {personajes.length} agentes · haz clic en cualquier carta para ver sus detalles
        </p>

        {/* Decorative divider */}
        <div className="h-part opacity-0 flex items-center gap-4 justify-center mt-5 max-w-xs mx-auto">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-red-500/30" />
          <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-red-500/30" />
        </div>

        {/* Search */}
        <div className="h-part opacity-0 mt-6 relative max-w-xs mx-auto">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar agente..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/30 rounded-xl
                       text-sm text-white placeholder-slate-600
                       focus:outline-none focus:border-spectrum-cyan/40 focus:ring-1 focus:ring-spectrum-cyan/20
                       transition-all duration-200"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* ── Role filter tabs ── */}
      <div className="flex justify-center mt-6 mb-8 px-4">
        <div className="flex flex-wrap justify-center gap-1.5 bg-slate-900/60 border border-slate-700/30
                        rounded-2xl p-2 max-w-2xl backdrop-blur-sm">
          {ROLE_FILTERS.map(({ key, color }) => (
            <button
              key={key}
              onClick={() => setActiveRole(key)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl
                          transition-all duration-200 border ${
                activeRole === key
                  ? 'border-current shadow-lg'
                  : 'text-slate-400 border-transparent hover:text-white hover:bg-white/5'
              }`}
              style={activeRole === key ? {
                color,
                backgroundColor: `${color}18`,
                borderColor: `${color}50`,
                boxShadow: `0 0 16px ${color}25`,
              } : {}}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* ── Agent grid ── */}
      <div
        ref={gridRef}
        className="flex flex-wrap justify-center gap-5 px-4 max-w-screen-2xl mx-auto"
      >
        {filtered.map(agente => (
          <div
            key={agente.uuid || agente.nombre}
            className="agent-wrap"
            style={{ opacity: 0 }}
          >
            <AgentCard agente={agente} onClick={setSelectedAgent} />
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && !cargando && (
        <div className="text-center py-24">
          <span className="text-6xl mb-4 block">🔍</span>
          <p className="text-slate-500 text-sm">No se encontraron agentes.</p>
          <button
            onClick={() => { setSearch(''); setActiveRole('Todos'); }}
            className="mt-3 text-xs text-spectrum-cyan/60 hover:text-spectrum-cyan transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      )}

      {/* ── Detail modal ── */}
      {selectedAgent && (
        <AgentDetailModal
          agente={selectedAgent}
          onClose={() => setSelectedAgent(null)}
        />
      )}
    </div>
  );
}
