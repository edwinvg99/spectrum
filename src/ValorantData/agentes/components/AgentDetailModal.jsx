import React, { useState, useEffect, useRef } from 'react';
import anime from 'animejs';

/* ── Constants ── */
const SLOT_LABELS = {
  Ability1: 'C',
  Ability2: 'Q',
  Grenade:  'E',
  Ultimate: 'X',
  Passive:  'Pasiva',
};
const SLOT_ORDER = ['Ability1', 'Ability2', 'Grenade', 'Ultimate', 'Passive'];

const ROLE_STYLES = {
  Duelista:    { accent: 'text-red-400',    border: 'border-red-500/30',    bg: 'bg-red-500/10',    color: '#f87171' },
  Iniciador:   { accent: 'text-cyan-400',   border: 'border-cyan-500/30',   bg: 'bg-cyan-500/10',   color: '#22d3ee' },
  Controlador: { accent: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-500/10', color: '#a855f7' },
  Centinela:   { accent: 'text-green-400',  border: 'border-green-500/30',  bg: 'bg-green-500/10',  color: '#4ade80' },
};
const FALLBACK_STYLE = { accent: 'text-slate-400', border: 'border-slate-500/30', bg: 'bg-slate-500/10', color: '#64748b' };

/* ── Small ability key badge ── */
function AbilityKey({ label, active, color }) {
  return (
    <div
      className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black uppercase
                  border transition-all duration-200 ${active ? 'scale-110' : ''}`}
      style={active
        ? { backgroundColor: `${color}20`, borderColor: `${color}60`, color }
        : { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.10)', color: '#64748b' }
      }
    >
      {label}
    </div>
  );
}

/* ── Main modal ── */
export default function AgentDetailModal({ agente, onClose }) {
  const [selectedAbility, setSelectedAbility] = useState(null);
  const [imageLoaded,     setImageLoaded]     = useState(false);
  const [closing,         setClosing]         = useState(false);

  const backdropRef  = useRef(null);
  const panelRef     = useRef(null);
  const portraitRef  = useRef(null);
  const infoRef      = useRef(null);
  const abilitiesRef = useRef(null);

  const rs = ROLE_STYLES[agente.rol] || FALLBACK_STYLE;

  /* Abilities sorted by slot */
  const sortedAbilities = [...agente.habilidades].sort((a, b) => {
    const ia = SLOT_ORDER.indexOf(a.slot);
    const ib = SLOT_ORDER.indexOf(b.slot);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });

  /* Default to first ability */
  useEffect(() => {
    if (sortedAbilities.length && !selectedAbility) setSelectedAbility(sortedAbilities[0]);
  }, []);

  /* Entrance animation */
  useEffect(() => {
    if (!backdropRef.current || !panelRef.current) return;

    // Backdrop fade
    anime({ targets: backdropRef.current, opacity: [0, 1], duration: 300, easing: 'easeOutQuad' });

    // Panel slide-up
    anime({
      targets:     panelRef.current,
      opacity:     [0, 1],
      translateY:  [40, 0],
      scale:       [0.96, 1],
      duration:    550,
      easing:      'easeOutExpo',
    });

    // Stagger inner parts
    const parts = panelRef.current.querySelectorAll('.modal-part');
    if (parts.length) {
      anime({
        targets:    parts,
        opacity:    [0, 1],
        translateY: [12, 0],
        duration:   500,
        delay:      anime.stagger(80, { start: 200 }),
        easing:     'easeOutExpo',
      });
    }
  }, []);

  /* Ability selector entrance stagger */
  useEffect(() => {
    if (!abilitiesRef.current) return;
    anime({
      targets:  abilitiesRef.current.querySelectorAll('.ability-btn'),
      scale:    [0.85, 1],
      opacity:  [0, 1],
      duration: 400,
      delay:    anime.stagger(60, { start: 400 }),
      easing:   'easeOutBack',
    });
  }, []);

  /* Handle close */
  const handleClose = () => {
    setClosing(true);
    anime({ targets: backdropRef.current, opacity: [1, 0], duration: 250, easing: 'easeInQuad' });
    anime({
      targets:  panelRef.current,
      opacity:  [1, 0],
      translateY: [0, 30],
      scale:    [1, 0.95],
      duration: 250,
      easing:   'easeInExpo',
      complete: onClose,
    });
  };

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) handleClose();
  };

  /* Gradient tint */
  const buildGradient = (colors) => {
    if (!colors?.length) return `linear-gradient(135deg, ${rs.color}08, transparent)`;
    const hex = colors.map(c => `#${c.substring(0, 6)}`);
    return `linear-gradient(135deg, ${hex.map((c, i) => `${c}${i === 0 ? '1A' : '0A'}`).join(', ')})`;
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      style={{ backgroundColor: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(10px)', opacity: 0 }}
    >
      <div
        ref={panelRef}
        className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl
                   border border-slate-700/40 shadow-2xl"
        style={{
          opacity: 0,
          background: `linear-gradient(180deg, #0a1628 0%, #040b14 100%)`,
          backgroundImage: buildGradient(agente.gradientColors),
          boxShadow: `0 40px 120px -20px ${rs.color}25`,
        }}
      >
        {/* Gradient border top */}
        <div className="absolute top-0 inset-x-0 h-px rounded-t-3xl"
          style={{ background: `linear-gradient(90deg, transparent, ${rs.color}60, transparent)` }} />

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full
                     bg-slate-800/80 border border-slate-700/50
                     flex items-center justify-center text-slate-400
                     hover:text-white hover:bg-slate-700 hover:border-slate-600
                     transition-all duration-200 hover:scale-110"
        >
          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            style={{ width: 18, height: 18 }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        {/* ══ Top: Portrait + Info ══ */}
        <div className="flex flex-col lg:flex-row">

          {/* Portrait side */}
          <div ref={portraitRef}
            className="relative w-full lg:w-[42%] min-h-[280px] lg:min-h-[500px] overflow-hidden rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none flex-shrink-0">
            {/* Background pattern */}
            {agente.fondo && (
              <div className="absolute inset-0 bg-cover bg-center opacity-15 blur-sm"
                style={{ backgroundImage: `url(${agente.fondo})` }} />
            )}
            <div className="absolute inset-0"
              style={{ background: `radial-gradient(ellipse at 50% 100%, ${rs.color}15 0%, transparent 70%)` }} />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#040b14] hidden lg:block" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#040b14] via-transparent to-transparent" />

            {/* Portrait */}
            <div className="relative h-full flex items-end justify-center py-4">
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 border-2 border-slate-800 rounded-full animate-spin"
                    style={{ borderTopColor: rs.color }} />
                </div>
              )}
              <img
                src={agente.imagenV2 || agente.imagen}
                alt={agente.nombre}
                className="max-h-[420px] lg:max-h-[470px] object-contain drop-shadow-2xl z-10 relative"
                style={{
                  opacity:    imageLoaded ? 1 : 0,
                  transition: 'opacity 0.5s ease',
                  filter:     `drop-shadow(0 0 40px ${rs.color}20)`,
                }}
                onLoad={() => setImageLoaded(true)}
              />
            </div>
          </div>

          {/* Info side */}
          <div ref={infoRef} className="flex-1 p-6 lg:p-8 lg:pt-10 overflow-hidden">

            {/* Role badge */}
            <div className="modal-part opacity-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl mb-4
                            border" style={{ backgroundColor: `${rs.color}12`, borderColor: `${rs.color}35` }}>
              {agente.iconoRol && (
                <img src={agente.iconoRol} alt={agente.rol} className="w-4 h-4 object-contain brightness-200" />
              )}
              <span className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: rs.color }}>
                {agente.rol}
              </span>
            </div>

            {/* Agent name */}
            <h2 className="modal-part opacity-0 font-display font-black text-white uppercase leading-none mb-3
                           text-4xl lg:text-5xl tracking-wider"
              style={{ textShadow: `0 0 40px ${rs.color}30` }}>
              {agente.nombre}
            </h2>

            {/* Bio */}
            <p className="modal-part opacity-0 text-slate-400 text-sm leading-relaxed mb-5 max-w-lg">
              {agente.descripcion}
            </p>

            {/* Role description */}
            {agente.rolDescripcion && (
              <div className="modal-part opacity-0 p-3 rounded-xl border mb-5"
                style={{ backgroundColor: `${rs.color}0A`, borderColor: `${rs.color}25` }}>
                <p className="text-slate-300 text-xs leading-relaxed">
                  <span className="font-bold mr-1.5" style={{ color: rs.color }}>{agente.rol}:</span>
                  {agente.rolDescripcion}
                </p>
              </div>
            )}

            {/* Divider */}
            <div className="modal-part opacity-0 h-px mb-6"
              style={{ background: `linear-gradient(90deg, ${rs.color}50, transparent)` }} />

            {/* ── Abilities ── */}
            <div ref={abilitiesRef} className="modal-part opacity-0">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.25em] mb-4">
                Habilidades
              </h3>

              {/* Selector row */}
              <div className="flex flex-wrap gap-2 mb-5">
                {sortedAbilities.map((hab, i) => {
                  const isActive = selectedAbility?.nombre === hab.nombre;
                  const slotLabel = SLOT_LABELS[hab.slot] || hab.slot || '?';
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedAbility(hab)}
                      className="ability-btn flex flex-col items-center gap-1.5 p-2.5 rounded-2xl border
                                 transition-all duration-200 hover:scale-105 focus:outline-none"
                      style={{
                        opacity: 0,
                        backgroundColor: isActive ? `${rs.color}18` : 'rgba(255,255,255,0.04)',
                        borderColor:     isActive ? `${rs.color}50` : 'rgba(255,255,255,0.08)',
                        boxShadow:       isActive ? `0 0 20px ${rs.color}20` : 'none',
                      }}
                      title={hab.nombre}
                    >
                      <AbilityKey label={slotLabel} active={isActive} color={rs.color} />
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: isActive ? `${rs.color}15` : 'rgba(255,255,255,0.06)' }}>
                        {hab.icono
                          ? <img src={hab.icono} alt={hab.nombre} className="w-8 h-8 object-contain"
                              style={{ filter: isActive ? `brightness(1.4) drop-shadow(0 0 6px ${rs.color}80)` : 'brightness(0.6)' }} />
                          : <span className="text-slate-600 text-xs font-bold">?</span>
                        }
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Ability detail */}
              {selectedAbility && (
                <div className="p-4 rounded-2xl border animate-fade-in-up"
                  style={{ backgroundColor: `${rs.color}08`, borderColor: `${rs.color}25` }}>
                  <div className="flex items-center gap-3 mb-3">
                    {selectedAbility.icono && (
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${rs.color}18` }}>
                        <img src={selectedAbility.icono} alt={selectedAbility.nombre}
                          className="w-7 h-7 object-contain"
                          style={{ filter: `brightness(1.5) drop-shadow(0 0 8px ${rs.color}60)` }} />
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="text-white font-display font-black text-base tracking-wide leading-tight">
                        {selectedAbility.nombre}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <AbilityKey
                          label={SLOT_LABELS[selectedAbility.slot] || selectedAbility.slot || '?'}
                          active
                          color={rs.color}
                        />
                        {selectedAbility.slot === 'Ultimate' && (
                          <span className="text-[9px] font-black uppercase tracking-widest"
                            style={{ color: rs.color }}>Definitiva</span>
                        )}
                        {selectedAbility.slot === 'Passive' && (
                          <span className="text-[9px] font-black uppercase tracking-widest"
                            style={{ color: rs.color }}>Pasiva</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {selectedAbility.descripcion || 'Sin descripción disponible.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ══ Bottom: Tips section ══ */}
        <div className="px-6 lg:px-8 pb-8 pt-2 border-t border-slate-800/60">
          <div className="flex items-center gap-2 mb-4 mt-5">
            <div className="h-px flex-1"
              style={{ background: `linear-gradient(90deg, ${rs.color}40, transparent)` }} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
              Tipo de Juego
            </span>
            <div className="h-px flex-1"
              style={{ background: `linear-gradient(90deg, transparent, ${rs.color}40)` }} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { icon: '⚔️', label: 'Duelo', tip: agente.rol === 'Duelista'    ? 'Especialidad' : 'Secundario' },
              { icon: '🎯', label: 'Apoyo', tip: agente.rol === 'Iniciador'   ? 'Especialidad' : 'Secundario' },
              { icon: '🔮', label: 'Control',tip: agente.rol === 'Controlador'? 'Especialidad' : 'Secundario' },
              { icon: '🛡️', label: 'Defensa',tip: agente.rol === 'Centinela'  ? 'Especialidad' : 'Secundario' },
            ].map(({ icon, label, tip }) => (
              <div key={label}
                className="flex items-center gap-2 p-2.5 rounded-xl border"
                style={{
                  backgroundColor: tip === 'Especialidad' ? `${rs.color}12` : 'rgba(255,255,255,0.03)',
                  borderColor:     tip === 'Especialidad' ? `${rs.color}35` : 'rgba(255,255,255,0.06)',
                }}>
                <span className="text-base">{icon}</span>
                <div>
                  <p className="text-xs font-bold text-white">{label}</p>
                  <p className="text-[9px] font-medium"
                    style={{ color: tip === 'Especialidad' ? rs.color : '#475569' }}>
                    {tip}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Keyboard hint */}
        <div className="text-center pb-4">
          <span className="text-[10px] text-slate-700">Presiona</span>
          <kbd className="mx-1 px-1.5 py-0.5 text-[9px] font-mono bg-slate-800 border border-slate-700 rounded text-slate-500">ESC</kbd>
          <span className="text-[10px] text-slate-700">para cerrar</span>
        </div>
      </div>
    </div>
  );
}
