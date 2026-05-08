import React, { useState } from 'react';
import { useEsportsResults } from '../hooks/useEsportsResults';
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

function ResultCard({ match }) {
  const [teamA, teamB] = match.teams;

  return (
    <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/15 hover:border-slate-600/30 transition-all duration-200">
      {/* Tournament & event */}
      <div className="flex items-center gap-2 mb-2.5">
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

      {/* Teams row */}
      <div className="flex items-center gap-2">
        {/* Team A */}
        <div className={`flex-1 flex items-center gap-2 min-w-0 ${teamA.won ? 'opacity-100' : 'opacity-50'}`}>
          <span className="text-xs flex-shrink-0">{countryFlag(teamA.country)}</span>
          <span className={`text-xs truncate ${teamA.won ? 'text-white font-semibold' : 'text-slate-400'}`}>
            {teamA.name}
          </span>
        </div>

        {/* Score */}
        <div className="flex items-center gap-1 flex-shrink-0 bg-slate-900/60 rounded px-2 py-1">
          <span className={`text-sm font-bold tabular-nums ${teamA.won ? 'text-green-400' : 'text-slate-500'}`}>
            {teamA.score}
          </span>
          <span className="text-slate-600 text-xs">-</span>
          <span className={`text-sm font-bold tabular-nums ${teamB.won ? 'text-green-400' : 'text-slate-500'}`}>
            {teamB.score}
          </span>
        </div>

        {/* Team B */}
        <div className={`flex-1 flex items-center justify-end gap-2 min-w-0 ${teamB.won ? 'opacity-100' : 'opacity-50'}`}>
          <span className={`text-xs truncate text-right ${teamB.won ? 'text-white font-semibold' : 'text-slate-400'}`}>
            {teamB.name}
          </span>
          <span className="text-xs flex-shrink-0">{countryFlag(teamB.country)}</span>
        </div>
      </div>

      {/* Event info & time ago */}
      <div className="flex justify-between items-center mt-2 text-[10px]">
        <span className="text-slate-600 truncate mr-2">{match.event}</span>
        <span className="text-slate-500 flex-shrink-0">hace {match.ago}</span>
      </div>
    </div>
  );
}

function ResultadosEsports() {
  const { resultados, cargando, error } = useEsportsResults();
  const [filtro, setFiltro] = useState('');

  if (cargando) {
    return <NewsLoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="p-4 text-center bg-red-900/10 rounded-lg border border-red-700/20">
        <p className="text-red-400 text-sm font-medium">Error al cargar resultados</p>
        <p className="text-red-500/60 text-xs mt-1">{error}</p>
      </div>
    );
  }

  if (resultados.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500 text-sm">No hay resultados recientes.</p>
      </div>
    );
  }

  // Apply filter
  let filtered = resultados;
  if (filtro.trim()) {
    const lower = filtro.toLowerCase();
    filtered = filtered.filter(m =>
      m.teams.some(t => t.name.toLowerCase().includes(lower)) ||
      (m.tournament && m.tournament.toLowerCase().includes(lower)) ||
      (m.event && m.event.toLowerCase().includes(lower))
    );
  }

  return (
    <div className="space-y-3">
      {/* Filter bar */}
      <div className="relative">
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

      {/* Results count */}
      {filtro.trim() && (
        <p className="text-[10px] text-slate-600">
          {filtered.length} resultado{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Result list */}
      {filtered.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-slate-500 text-sm">No se encontraron resultados.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((match) => (
            <ResultCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ResultadosEsports;
