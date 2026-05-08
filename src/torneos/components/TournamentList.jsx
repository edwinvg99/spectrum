import React from 'react';

const TEAM_LABELS = { 1: '1v1', 2: '2v2', 3: '3v3', 4: '4v4', 5: '5v5' };

function TournamentList({ tournaments, onSelect, onDelete }) {
  if (tournaments.length === 0) return null;

  return (
    <div className="space-y-3 animate-fade-in-up">
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-[0.2em]">
        Torneos guardados
      </h3>
      {tournaments.map((t, i) => (
        <div
          key={t.id}
          className="group bg-slate-800/30 border border-slate-700/20 rounded-xl p-4 flex items-center justify-between hover:border-slate-600/40 hover:bg-slate-800/40 transition-all duration-200 cursor-pointer animate-fade-in-up"
          style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
          onClick={() => onSelect(t.id)}
        >
          <div className="flex items-center gap-4 min-w-0">
            {/* Status icon */}
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
              t.status === 'completed'
                ? 'bg-yellow-500/15 text-yellow-400'
                : 'bg-spectrum-cyan/10 text-spectrum-cyan'
            }`}>
              {t.status === 'completed' ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3 6.5L22 10l-5 5 1.5 7L12 18.5 5.5 22 7 15l-5-5 7-1.5L12 2z"/>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 4l2 4 4-3 4 3 2-4M6 4v8c0 3.31 2.69 6 6 6s6-2.69 6-6V4M9 20h6M12 18v2"/>
                </svg>
              )}
            </div>

            <div className="min-w-0">
              <h4 className="text-sm font-bold text-white truncate">
                {t.name}
              </h4>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-700/30 px-1.5 py-0.5 rounded">
                  {TEAM_LABELS[t.teamSize] || t.teamSize}
                </span>
                <span className="text-[10px] text-slate-600">
                  {t.participants.length} participantes
                </span>
                {t.champion && (
                  <span className="text-[10px] text-yellow-400 font-semibold">
                    Campeon: {t.champion}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
              t.status === 'completed'
                ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                : 'bg-spectrum-cyan/10 text-spectrum-cyan border border-spectrum-cyan/20'
            }`}>
              {t.status === 'completed' ? 'Finalizado' : 'En curso'}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(t.id); }}
              className="p-1.5 text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
              title="Eliminar torneo"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TournamentList;
