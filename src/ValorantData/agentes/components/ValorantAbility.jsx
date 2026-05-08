// ValorantAbility.jsx - Ability icon with lazy loading + slot label
import React, { useState } from 'react';

const SLOT_LABELS = {
  Ability1: 'C',
  Ability2: 'Q',
  Grenade:  'E',
  Ultimate: 'X',
  Passive:  'P',
};

export default function ValorantAbility({ habilidad }) {
  const [iconLoaded, setIconLoaded] = useState(false);
  const slotLabel = SLOT_LABELS[habilidad?.slot] || '';

  return (
    <div
      className="group/ab relative flex items-center gap-2"
      title={habilidad?.nombre || ''}
    >
      {/* Icon box */}
      <div className="w-9 h-9 rounded-lg bg-black/40 border border-white/10 relative overflow-hidden
                      group-hover/ab:border-white/25 group-hover/ab:bg-white/10 transition-all duration-200 flex-shrink-0">
        {!iconLoaded && (
          <div className="absolute inset-0 bg-slate-700/50 animate-pulse rounded-lg" />
        )}
        {habilidad?.icono ? (
          <img
            src={habilidad.icono}
            alt={habilidad.nombre || 'Habilidad'}
            className={`w-full h-full object-contain p-1 transition-all duration-300
                        ${iconLoaded ? 'opacity-75 group-hover/ab:opacity-100' : 'opacity-0'}`}
            loading="lazy"
            onLoad={() => setIconLoaded(true)}
            onError={(e) => { e.target.style.display = 'none'; setIconLoaded(true); }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs font-bold">?</div>
        )}

        {/* Slot key — tiny badge */}
        {slotLabel && (
          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-sm
                          bg-slate-900 border border-slate-700 flex items-center justify-center">
            <span className="text-[7px] font-black text-slate-400">{slotLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}
