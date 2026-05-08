import React, { useState, useEffect, useRef } from 'react';
import { useTeamDetail } from '../hooks/useTeamDetail';

function countryFlag(code) {
  if (!code || code === 'un') return null;
  const c = code.toUpperCase();
  if (c.length !== 2) return null;
  return String.fromCodePoint(...[...c].map(ch => 0x1F1E6 + ch.charCodeAt(0) - 65));
}

function PlayerRow({ player }) {
  return (
    <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/20 hover:border-slate-600/30 transition-all duration-200">
      <img
        src={player.img}
        alt={player.user}
        className="w-10 h-10 rounded-lg object-cover bg-slate-700/50"
        loading="lazy"
        onError={(e) => { e.target.style.display = 'none'; }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{player.user}</p>
        <p className="text-[10px] text-slate-500 truncate">{player.name}</p>
      </div>
      <span className="text-xs flex-shrink-0">{countryFlag(player.country)}</span>
    </div>
  );
}

function MatchResultRow({ result }) {
  if (!result.teams || result.teams.length < 2) return null;
  const [teamA, teamB] = result.teams;

  return (
    <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/15 hover:border-slate-600/30 transition-all duration-200">
      <div className="flex items-center gap-2 mb-2">
        {result.event?.logo && (
          <img src={result.event.logo} alt="" className="w-4 h-4 rounded-sm object-cover" loading="lazy" />
        )}
        <span className="text-[10px] text-slate-500 truncate">{result.event?.name}</span>
        {result.utc && (
          <span className="text-[10px] text-slate-600 ml-auto flex-shrink-0">
            {new Date(result.utc).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 min-w-0">
          {teamA.logo && <img src={teamA.logo} alt="" className="w-5 h-5 rounded-sm object-contain" loading="lazy" />}
          <span className={`text-xs truncate ${parseInt(teamA.points) > parseInt(teamB.points) ? 'text-white font-semibold' : 'text-slate-400'}`}>
            {teamA.name}
          </span>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0 bg-slate-900/60 rounded px-2 py-1">
          <span className={`text-sm font-bold tabular-nums ${parseInt(teamA.points) > parseInt(teamB.points) ? 'text-green-400' : 'text-slate-500'}`}>
            {teamA.points}
          </span>
          <span className="text-slate-600 text-xs">-</span>
          <span className={`text-sm font-bold tabular-nums ${parseInt(teamB.points) > parseInt(teamA.points) ? 'text-green-400' : 'text-slate-500'}`}>
            {teamB.points}
          </span>
        </div>
        <div className="flex-1 flex items-center justify-end gap-2 min-w-0">
          <span className={`text-xs truncate text-right ${parseInt(teamB.points) > parseInt(teamA.points) ? 'text-white font-semibold' : 'text-slate-400'}`}>
            {teamB.name}
          </span>
          {teamB.logo && <img src={teamB.logo} alt="" className="w-5 h-5 rounded-sm object-contain" loading="lazy" />}
        </div>
      </div>
    </div>
  );
}

function EventRow({ event }) {
  return (
    <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/15">
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-xs text-white font-medium truncate">{event.name}</span>
        <span className="text-[10px] text-slate-600 flex-shrink-0">{event.year}</span>
      </div>
      {event.results && event.results.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {event.results.map((r, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-spectrum-cyan/10 text-spectrum-cyan border border-spectrum-cyan/20">
              {r}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TeamDetailModal({ teamId, onClose }) {
  const { team, cargando, error } = useTeamDetail(teamId);
  const [activeTab, setActiveTab] = useState('roster');
  const [closing, setClosing] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 250);
  };

  const handleBackdropClick = (e) => {
    if (e.target === modalRef.current) handleClose();
  };

  const tabs = [
    { key: 'roster', label: 'Plantilla' },
    { key: 'results', label: 'Resultados' },
    { key: 'events', label: 'Eventos' },
  ];

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-250 ${closing ? 'opacity-0' : 'animate-fade-in'}`}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)' }}
    >
      <div className={`relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl border border-slate-700/40 shadow-2xl bg-spectrum-darker transition-all duration-250 flex flex-col ${closing ? 'scale-95 opacity-0' : 'animate-fade-in-up'}`}>
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-40 w-9 h-9 rounded-full bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/80 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Loading */}
        {cargando && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-10 h-10 border-2 border-slate-700 border-t-spectrum-cyan rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-sm text-slate-400">Cargando equipo...</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-8 text-center">
            <p className="text-red-400 text-sm">Error: {error}</p>
          </div>
        )}

        {/* Content */}
        {team && !cargando && (
          <>
            {/* Header */}
            <div className="p-6 pb-0">
              <div className="flex items-center gap-4 mb-5">
                {team.info?.logo && (
                  <img src={team.info.logo} alt={team.info.name} className="w-16 h-16 object-contain" />
                )}
                <div>
                  <h2 className="text-2xl font-display font-bold text-white tracking-wider uppercase">
                    {team.info?.name}
                  </h2>
                  {team.info?.tag && (
                    <span className="text-xs text-spectrum-cyan font-semibold uppercase tracking-widest">
                      [{team.info.tag}]
                    </span>
                  )}
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-700/30">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`text-xs font-semibold uppercase tracking-wider px-4 py-2.5 border-b-2 transition-all duration-200 ${
                      activeTab === tab.key
                        ? 'text-spectrum-cyan border-spectrum-cyan'
                        : 'text-slate-500 border-transparent hover:text-slate-300'
                    }`}
                  >
                    {tab.label}
                    {tab.key === 'results' && team.results && (
                      <span className="ml-1.5 text-[10px] text-slate-600">({team.results.length})</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6 pt-4 custom-scroll">
              {/* Roster */}
              {activeTab === 'roster' && (
                <div className="space-y-4 animate-fade-in">
                  {/* Players */}
                  {team.players && team.players.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                        Jugadores
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {team.players.map((player) => (
                          <PlayerRow key={player.id} player={player} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Staff */}
                  {team.staff && team.staff.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                        Staff
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {team.staff.map((s) => (
                          <div key={s.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-800/30 border border-slate-700/15">
                            <img
                              src={s.img}
                              alt={s.user}
                              className="w-8 h-8 rounded-lg object-cover bg-slate-700/50"
                              loading="lazy"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-white truncate">{s.user}</p>
                              <p className="text-[10px] text-slate-500 capitalize">{s.tag}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Results */}
              {activeTab === 'results' && (
                <div className="space-y-2 animate-fade-in">
                  {team.results && team.results.length > 0 ? (
                    team.results.slice(0, 20).map((result, i) => (
                      <MatchResultRow key={result.match?.id || i} result={result} />
                    ))
                  ) : (
                    <p className="text-slate-500 text-sm text-center py-8">Sin resultados recientes.</p>
                  )}
                </div>
              )}

              {/* Events */}
              {activeTab === 'events' && (
                <div className="space-y-2 animate-fade-in">
                  {team.events && team.events.length > 0 ? (
                    team.events.slice(0, 15).map((event) => (
                      <EventRow key={event.id} event={event} />
                    ))
                  ) : (
                    <p className="text-slate-500 text-sm text-center py-8">Sin eventos registrados.</p>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
