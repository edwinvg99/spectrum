import React from 'react';
import { useNavigate } from 'react-router-dom';

// Small helper to render a player mini card inside a bracket relation
const PlayerMini = ({ p }) => {
  const name = p?.playerData?.name ?? p?.name ?? '';
  const tag = p?.playerData?.tag ?? p?.tag ?? '';
  const elo = p?.mmrData?.elo ?? 0;
  return (
    <div className="flex flex-col items-center w-28 text-xs">
      <span className="font-semibold truncate w-full text-center" title={`${name}#${tag}`}>
        {name}
        {tag ? `#${tag}` : ''}
      </span>
      <span className="text-slate-400">ELO {elo}</span>
    </div>
  );
};

// A single match block shows two players (seeded)
const MatchCard = ({ a, b, onClick }) => (
  <div className="flex items-center justify-between border border-slate-700/40 rounded-xl p-2 bg-slate-800/40 hover:bg-slate-700/60 cursor-pointer" onClick={() => onClick?.(a)}>
    <PlayerMini p={a} />
    <span className="text-slate-300 mx-2 font-bold">VS</span>
    <PlayerMini p={b} />
  </div>
);

export default function TournamentBracket({ players, onPlayerClick }) {
  // Top 8 players by Elo
  const top8 = (players || []).slice(0, 8);
  // Seed mapping: [1,8], [4,5] on left; [2,7], [3,6] on right
  const seeds = {
    0: top8[0], // seed 1
    1: top8[7], // seed 8
    2: top8[3], // seed 4
    3: top8[4], // seed 5
    4: top8[1], // seed 2
    5: top8[6], // seed 7
    6: top8[2], // seed 3
    7: top8[5], // seed 6
  };

  const a = (idx) => seeds[idx];

  const navigate = useNavigate();
  const handlePlayerClick = (p) => {
    if (!p) return;
    const name = p.playerData?.name ?? p.name ?? 'player';
    const tag = p.playerData?.tag ?? p.tag ?? '';
    if (onPlayerClick) {
      onPlayerClick(p);
    } else {
      // Fallback: navigate to a profile route if exists
      navigate(`/integrantes/profile/${encodeURIComponent(name)}-${encodeURIComponent(tag)}`);
    }
  };

  return (
    <section className="py-8 px-4">
      <h3 className="text-xl font-bold text-white mb-4 text-center">Torneo: Bracket Top 8</h3>
      <div className="flex flex-col md:flex-row md:space-x-6 items-start justify-center gap-6">
        {/* Left column: seed 1 vs seed 8, seed 4 vs seed 5 */}
        <div className="flex-1 w-full max-w-md space-y-4">
          <div onClick={() => handlePlayerClick(a(0))}>
            <MatchCard a={a(0)} b={a(1)} onClick={handlePlayerClick} />
          </div>
          <div onClick={() => handlePlayerClick(a(2))}>
            <MatchCard a={a(2)} b={a(3)} onClick={handlePlayerClick} />
          </div>
        </div>
        {/* Right column: seed 2 vs seed 7, seed 3 vs seed 6 */}
        <div className="flex-1 w-full max-w-md space-y-4">
          <div onClick={() => handlePlayerClick(a(4))}>
            <MatchCard a={a(4)} b={a(5)} onClick={handlePlayerClick} />
          </div>
          <div onClick={() => handlePlayerClick(a(6))}>
            <MatchCard a={a(6)} b={a(7)} onClick={handlePlayerClick} />
          </div>
        </div>
      </div>
      <div className="text-xs text-slate-400 mt-4 text-center">Este bracket es un mockup para visualización; ganadores pueden ser determinados por Elo en rondas futuras.</div>
    </section>
  );
}
