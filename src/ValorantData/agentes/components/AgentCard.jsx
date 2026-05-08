import React, { useState, useEffect, useRef } from 'react';
import anime from 'animejs';
import ValorantAbility from "./ValorantAbility";

/* ── Role accent colors ── */
const ROLE_ACCENTS = {
  Duelista:    '#f87171',
  Iniciador:   '#22d3ee',
  Controlador: '#a855f7',
  Centinela:   '#4ade80',
};

/* ── Skeleton ── */
const AgentCardSkeleton = () => (
  <div className="w-64 relative overflow-hidden border border-slate-700/40 bg-slate-900/60 h-[340px] rounded-2xl animate-pulse">
    <div className="absolute inset-0 bg-slate-800/40 rounded-2xl" />
    <div className="absolute top-4 left-4 flex flex-col gap-2.5 z-10">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="w-9 h-9 rounded-lg bg-slate-700/60" />
      ))}
    </div>
    <div className="absolute bottom-0 left-0 right-0 p-4">
      <div className="h-5 w-24 bg-slate-700/60 rounded mb-1.5" />
      <div className="h-3 w-16 bg-slate-700/40 rounded" />
    </div>
  </div>
);

/* ── Agent Card ── */
export default function AgentCard({ agente, onClick }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [ready,       setReady]       = useState(false);
  const cardRef = useRef(null);

  const accentColor = ROLE_ACCENTS[agente?.rol] || '#64748b';

  /* Gradient for hover overlay */
  const buildGradient = (colors) => {
    if (!colors?.length) return 'none';
    const hex = colors.map(c => `#${c.substring(0, 6)}`);
    return `linear-gradient(160deg, ${hex.map((c, i) => `${c}${i === 0 ? '33' : '11'}`).join(', ')})`;
  };

  /* Preload portrait, then reveal */
  useEffect(() => {
    if (!agente) return;
    let mounted = true;
    const img = new Image();
    img.onload  = () => { if (mounted) { setImageLoaded(true); setReady(true); } };
    img.onerror = () => { if (mounted) setReady(true); };
    img.src = agente.imagen;
    // Safety timeout
    const t = setTimeout(() => { if (mounted) setReady(true); }, 1500);
    return () => { mounted = false; clearTimeout(t); };
  }, [agente]);

  /* Entrance animation */
  useEffect(() => {
    if (!ready || !cardRef.current) return;
    anime({ targets: cardRef.current, opacity: [0, 1], translateY: [14, 0], duration: 450, easing: 'easeOutExpo' });
  }, [ready]);

  if (!ready) return <AgentCardSkeleton />;

  return (
    <div
      ref={cardRef}
      onClick={() => onClick?.(agente)}
      className="w-64 group relative overflow-hidden border border-slate-700/40
                 bg-[#0D1117] h-[340px] rounded-2xl cursor-pointer select-none
                 transition-border duration-300 hover:-translate-y-2"
      style={{ opacity: 0 }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${accentColor}60`;
        e.currentTarget.style.boxShadow   = `0 24px 60px -12px ${accentColor}35`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '';
        e.currentTarget.style.boxShadow   = '';
      }}
    >
      {/* Gradient tint (hover) */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[1] rounded-2xl"
        style={{ backgroundImage: buildGradient(agente.gradientColors) }}
      />

      {/* Background pattern */}
      {agente.fondo && (
        <div
          className="absolute inset-0 opacity-15 group-hover:opacity-30 transition-all duration-600
                     bg-cover bg-center blur-sm group-hover:scale-110 z-[2]"
          style={{ backgroundImage: `url(${agente.fondo})` }}
        />
      )}

      {/* Dark vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-[#0D1117]/30 to-transparent z-[3]" />

      {/* Ability icons — left column */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        {agente.habilidades.slice(0, 4).map((hab, i) => (
          <ValorantAbility key={i} habilidad={hab} />
        ))}
      </div>

      {/* Role icon — top right */}
      {agente.iconoRol && (
        <div className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full
                        bg-black/50 backdrop-blur-sm border border-white/10
                        flex items-center justify-center
                        group-hover:scale-110 transition-transform duration-300">
          <img src={agente.iconoRol} alt={agente.rol}
            className="w-4.5 h-4.5 brightness-200 object-contain" style={{ width: 18, height: 18 }} />
        </div>
      )}

      {/* Agent portrait — centred, bottom-anchored */}
      <div className="absolute inset-0 z-[4] flex items-end justify-center pointer-events-none">
        <img
          src={agente.imagen}
          alt={agente.nombre}
          className="h-[84%] w-auto object-contain object-bottom drop-shadow-2xl
                     transition-transform duration-500 group-hover:scale-105"
          style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.4s, transform 0.5s' }}
        />
      </div>

      {/* Bottom name strip */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-4 pt-12 pb-3
                      bg-gradient-to-t from-[#0D1117] via-[#0D1117]/90 to-transparent">
        <div className="flex items-end justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="text-white font-display font-black text-lg tracking-wide leading-tight
                           truncate group-hover:text-opacity-90 transition-colors duration-300"
                style={{ textShadow: `0 0 20px ${accentColor}40` }}>
              {agente.nombre}
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-widest block mt-0.5"
              style={{ color: accentColor }}>
              {agente.rol}
            </span>
          </div>

          {/* "Ver info" chip — appears on hover */}
          <div className="flex-shrink-0 ml-2 translate-y-2 opacity-0
                          group-hover:translate-y-0 group-hover:opacity-100
                          transition-all duration-300">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full
                            bg-white/10 backdrop-blur-sm border border-white/20">
              <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span className="text-[9px] text-white font-semibold tracking-wide">INFO</span>
            </div>
          </div>
        </div>
      </div>

      {/* Accent bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-px z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />
    </div>
  );
}
