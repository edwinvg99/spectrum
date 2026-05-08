import React, { useState } from 'react';
import { useEsportsMatches } from '../hooks/useEsportsMatches';
import { NewsLoadingSkeleton } from '../../../shared/loadingSkeletons';

// Country code to flag emoji helper
function countryFlag(code) {
  if (!code || code === 'un') return null;
  const mapped = {
    eu: 'EU', us: 'US', br: 'BR', kr: 'KR', jp: 'JP',
    de: 'DE', tr: 'TR', ar: 'AR', cl: 'CL', co: 'CO',
    mx: 'MX', sg: 'SG', id: 'ID', ph: 'PH', th: 'TH',
    vn: 'VN', sa: 'SA', cz: 'CZ', ve: 'VE', cr: 'CR',
    my: 'MY', kh: 'KH', pe: 'PE',
  };
  const c = (mapped[code] || code).toUpperCase();
  if (c.length !== 2) return null;
  return String.fromCodePoint(...[...c].map(ch => 0x1F1E6 + ch.charCodeAt(0) - 65));
}

function MatchCard({ match }) {
  const [teamA, teamB] = match.teams;
  const isLive = match.status === 'Live';
  const isTBD = teamA.name === 'TBD' && teamB.name === 'TBD';

  return (
    <div className={`bg-slate-800/40 rounded-lg p-3 border transition-all duration-200 ${
      isLive
        ? 'border-green-500/30 hover:border-green-500/50'
        : 'border-slate-700/15 hover:border-slate-600/30'
    }`}>
      {/* Tournament & status */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          {match.img && (
            <img
              src={match.img}
              alt=""
              className="w-4 h-4 rounded-sm object-cover flex-shrink-0"
              loading="lazy"
            />
          )}
          <span className="text-[10px] text-slate-500 truncate leading-tight">
            {match.tournament}
          </span>
        </div>
        {isLive ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            EN VIVO
          </span>
        ) : match.in ? (
          <span className="text-[10px] text-spectrum-cyan flex-shrink-0">
            en {match.in}
          </span>
        ) : null}
      </div>

      {/* Teams row */}
      <div className="flex items-center gap-2">
        {/* Team A */}
        <div className={`flex-1 flex items-center gap-2 min-w-0 ${isTBD ? 'opacity-40' : ''}`}>
          <span className="text-xs flex-shrink-0">{countryFlag(teamA.country)}</span>
          <span className="text-xs text-white truncate font-medium">
            {teamA.name}
          </span>
        </div>

        {/* VS indicator */}
        <div className="flex-shrink-0 bg-slate-900/60 rounded px-2 py-1">
          {isLive && teamA.score != null ? (
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold tabular-nums text-white">{teamA.score}</span>
              <span className="text-slate-600 text-xs">-</span>
              <span className="text-sm font-bold tabular-nums text-white">{teamB.score}</span>
            </div>
          ) : (
            <span className="text-[10px] font-semibold text-slate-500">VS</span>
          )}
        </div>

        {/* Team B */}
        <div className={`flex-1 flex items-center justify-end gap-2 min-w-0 ${isTBD ? 'opacity-40' : ''}`}>
          <span className="text-xs text-white truncate text-right font-medium">
            {teamB.name}
          </span>
          <span className="text-xs flex-shrink-0">{countryFlag(teamB.country)}</span>
        </div>
      </div>

      {/* Event info */}
      <div className="mt-2 text-[10px] text-slate-600 truncate">
        {match.event}
      </div>
    </div>
  );
}

function PartidasEsports() {
  const { partidas, cargando, error } = useEsportsMatches();
  const [filtro, setFiltro] = useState('');
  const [soloLive, setSoloLive] = useState(false);

  if (cargando) {
    return <NewsLoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="p-4 text-center bg-red-900/10 rounded-lg border border-red-700/20">
        <p className="text-red-400 text-sm font-medium">Error al cargar partidas</p>
        <p className="text-red-500/60 text-xs mt-1">{error}</p>
      </div>
    );
  }

  if (partidas.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500 text-sm">No hay partidas programadas.</p>
      </div>
    );
  }

  // Apply filters
  let filtered = partidas;
  if (filtro.trim()) {
    const lower = filtro.toLowerCase();
    filtered = filtered.filter(m =>
      m.teams.some(t => t.name.toLowerCase().includes(lower)) ||
      (m.tournament && m.tournament.toLowerCase().includes(lower)) ||
      (m.event && m.event.toLowerCase().includes(lower))
    );
  }
  if (soloLive) {
    filtered = filtered.filter(m => m.status === 'Live');
  }

  // Separate live from upcoming
  const live = filtered.filter(m => m.status === 'Live');
  const upcoming = filtered.filter(m => m.status !== 'Live');

  const liveCount = partidas.filter(m => m.status === 'Live').length;

  return (
    <div className="space-y-3">
      {/* Filter bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            placeholder="Filtrar por equipo o torneo..."
            className="w-full pl-8 pr-3 py-2 bg-slate-800/50 border border-slate-700/25 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-spectrum-cyan/30 transition-colors duration-200"
          />
        </div>
        {liveCount > 0 && (
          <button
            onClick={() => setSoloLive(!soloLive)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-[10px] font-semibold uppercase tracking-wider transition-all duration-200 flex-shrink-0 ${
              soloLive
                ? 'bg-green-500/10 text-green-400 border-green-500/30'
                : 'bg-slate-800/40 text-slate-500 border-slate-700/20 hover:text-slate-300'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${soloLive ? 'bg-green-400 animate-pulse' : 'bg-slate-600'}`} />
            Live ({liveCount})
          </button>
        )}
      </div>

      {/* Results count */}
      {filtro.trim() && (
        <p className="text-[10px] text-slate-600">
          {filtered.length} partida{filtered.length !== 1 ? 's' : ''} encontrada{filtered.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Match list */}
      {filtered.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-slate-500 text-sm">No se encontraron partidas.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {live.length > 0 && (
            <>
              {live.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
              {upcoming.length > 0 && (
                <div className="h-px bg-slate-700/30 my-1" />
              )}
            </>
          )}
          {upcoming.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}

export default PartidasEsports;
