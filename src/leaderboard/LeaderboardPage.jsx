import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { valorantAPI } from '../services/valorantApi';
import { DEFAULT_IMAGES } from '../utils/constants';
import SpectrumLogo from '../assets/images/spectrumLOGO.svg?react';

// ───────────────────────────────────────
// Constants
// ───────────────────────────────────────
const SORT_CRITERIA = [
  { key: 'elo', label: 'ELO', icon: '🏅' },
  { key: 'kda', label: 'KDA', icon: '⚔️' },
  { key: 'hsPercent', label: 'HS%', icon: '🎯' },
  { key: 'avgScore', label: 'ACS', icon: '📊' },
  { key: 'matchesPlayed', label: 'Partidas', icon: '🎮' },
];

const RANK_COLORS = {
  'Iron': '#828282', 'Bronze': '#7c5522', 'Silver': '#d1d1d1',
  'Gold': '#FFD700', 'Platinum': '#00c7c0', 'Diamond': '#eb96f2',
  'Ascendant': '#7defb9', 'Immortal': '#ff5551', 'Radiant': '#ffedaa',
  'Unranked': '#4A5568',
};

const ROLE_COLORS = {
  'Duelista': { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
  'Iniciador': { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
  'Controlador': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  'Centinela': { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
};

const getRankColor = (rankName) => {
  if (!rankName) return RANK_COLORS['Unranked'];
  const tier = Object.keys(RANK_COLORS).find(k => rankName.startsWith(k));
  return RANK_COLORS[tier] || RANK_COLORS['Unranked'];
};

const CROWNS = ['👑', '🥈', '🥉'];

// Category medals - awarded to the top player per stat
const CATEGORY_MEDALS = [
  { key: 'kda', label: 'Mejor KDA', icon: '⚔️' },
  { key: 'hsPercent', label: 'Mejor Punteria', icon: '🎯' },
  { key: 'avgScore', label: 'Mejor ACS', icon: '⭐' },
  { key: 'winRate', label: 'Mas Victorias', icon: '🏆' },
  { key: 'matchesPlayed', label: 'Mas Activo', icon: '🎮' },
];

function computeCategoryMedals(players) {
  const medals = {}; // playerKey -> [{ label, icon }]
  const validPlayers = players.filter(p => p.stats && p.stats.matchesPlayed >= 3);

  CATEGORY_MEDALS.forEach(({ key, label, icon }) => {
    if (validPlayers.length === 0) return;
    const sorted = [...validPlayers].sort((a, b) => {
      const va = key === 'winRate' ? (a.stats?.winRate || 0) : (a.stats?.[key] || 0);
      const vb = key === 'winRate' ? (b.stats?.winRate || 0) : (b.stats?.[key] || 0);
      return vb - va;
    });
    const winner = sorted[0];
    const pKey = `${winner.name}#${winner.tag}`;
    if (!medals[pKey]) medals[pKey] = [];
    medals[pKey].push({ label, icon });
  });

  return medals;
}

// ───────────────────────────────────────
// Loading skeleton
// ───────────────────────────────────────
function LeaderboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-spectrum-darker via-slate-900 to-spectrum-darker page-pattern">
      <div className="max-w-5xl mx-auto px-4 pt-24 pb-12 animate-pulse">
        <div className="h-10 w-64 bg-slate-800/40 rounded-lg mb-2" />
        <div className="h-4 w-48 bg-slate-800/20 rounded mb-8" />
        <div className="flex gap-2 mb-6">
          {[...Array(5)].map((_, i) => <div key={i} className="h-9 w-20 bg-slate-800/30 rounded-lg" />)}
        </div>
        <div className="space-y-3">
          {[...Array(12)].map((_, i) => <div key={i} className="h-20 bg-slate-800/20 rounded-xl" />)}
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────
// Leaderboard Row Component
// ───────────────────────────────────────
function LeaderboardRow({ player, position, sortKey, previousPosition, medals, onClick, animDelay }) {
  const rankName = player.mmrData?.currenttierpatched || 'Unranked';
  const rankColor = getRankColor(rankName);
  const rankImage = player.mmrData?.images?.large || DEFAULT_IMAGES.UNRANKED_ICON;
  const avatar = player.playerData?.card?.small || DEFAULT_IMAGES.DEFAULT_AVATAR;
  const elo = player.mmrData?.elo || 0;
  const stats = player.stats;
  const roleStyle = stats?.primaryRole ? (ROLE_COLORS[stats.primaryRole] || ROLE_COLORS['Duelista']) : null;
  const streak = stats?.streak;
  const playerMedals = medals || [];

  // Position change
  const posChange = previousPosition !== undefined ? previousPosition - position : 0;

  // Highlight value for current sort criteria
  const getSortValue = () => {
    if (!stats) return 'N/A';
    switch (sortKey) {
      case 'elo': return elo;
      case 'kda': return stats.kda;
      case 'hsPercent': return `${stats.hsPercent}%`;
      case 'avgScore': return stats.avgScore;
      case 'matchesPlayed': return stats.matchesPlayed;
      default: return elo;
    }
  };

  // Top 3 styling
  const isTop3 = position <= 3;
  const borderHighlight = isTop3
    ? position === 1 ? 'border-yellow-500/40 bg-yellow-500/[0.03]'
    : position === 2 ? 'border-slate-300/30 bg-slate-300/[0.02]'
    : 'border-amber-700/30 bg-amber-700/[0.02]'
    : 'border-slate-700/30';

  return (
    <div
      className={`flex items-center gap-3 border rounded-xl p-3 sm:p-4 hover:bg-slate-800/30 transition-all duration-200 cursor-pointer group animate-fade-in-up ${borderHighlight}`}
      style={{ animationDelay: `${animDelay}ms` }}
      onClick={onClick}
    >
      {/* Position */}
      <div className="w-10 flex-shrink-0 text-center">
        {isTop3 ? (
          <span className="text-2xl">{CROWNS[position - 1]}</span>
        ) : (
          <span className="text-lg font-bold text-slate-500">#{position}</span>
        )}
      </div>

      {/* Position change arrow */}
      <div className="w-5 flex-shrink-0 text-center">
        {posChange > 0 && (
          <span className="text-green-400 text-xs font-bold" title={`Subio ${posChange} posicion(es)`}>
            <svg className="w-3.5 h-3.5 inline" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </span>
        )}
        {posChange < 0 && (
          <span className="text-red-400 text-xs font-bold" title={`Bajo ${Math.abs(posChange)} posicion(es)`}>
            <svg className="w-3.5 h-3.5 inline" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </span>
        )}
      </div>

      {/* Avatar + Rank icon */}
      <div className="relative flex-shrink-0">
        <img
          src={avatar}
          alt={player.name}
          className="w-12 h-12 rounded-lg object-cover border-2 group-hover:scale-105 transition-transform duration-200"
          style={{ borderColor: `${rankColor}50` }}
          onError={(e) => { e.target.src = DEFAULT_IMAGES.DEFAULT_AVATAR; }}
        />
        <img
          src={rankImage}
          alt={rankName}
          className="absolute -bottom-1 -right-1 w-5 h-5 object-contain"
          onError={(e) => { e.target.src = DEFAULT_IMAGES.UNRANKED_ICON; }}
        />
      </div>

      {/* Name + Role + Medals */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-bold text-white truncate">{player.name}</span>
          <span className="text-xs font-semibold" style={{ color: `${rankColor}90` }}>#{player.tag}</span>
          {roleStyle && (
            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full border hidden sm:inline ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}`}>
              {stats.primaryRole}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[10px] uppercase tracking-wider font-medium" style={{ color: rankColor }}>{rankName}</span>
          {/* Category medals */}
          {playerMedals.length > 0 && (
            <div className="flex gap-0.5 ml-1">
              {playerMedals.map((m, i) => (
                <span key={i} className="text-xs" title={m.label}>{m.icon}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Streak badge */}
      {streak && streak.count >= 2 && (
        <div className="flex-shrink-0 hidden sm:block">
          {streak.type === 'win' ? (
            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
              🔥 {streak.count}W
            </span>
          ) : (
            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
              💀 {streak.count}L
            </span>
          )}
        </div>
      )}

      {/* Stats columns */}
      <div className="hidden sm:flex items-center gap-4">
        {stats ? (
          <>
            <div className="text-center w-12">
              <span className="block text-[9px] text-slate-500 uppercase">ELO</span>
              <span className="text-sm font-bold" style={{ color: rankColor }}>{elo || 'N/A'}</span>
            </div>
            <div className="text-center w-12">
              <span className="block text-[9px] text-slate-500 uppercase">K/D</span>
              <span className={`text-sm font-bold ${stats.kd >= 1 ? 'text-green-400' : 'text-red-400'}`}>{stats.kd}</span>
            </div>
            <div className="text-center w-12">
              <span className="block text-[9px] text-slate-500 uppercase">Win%</span>
              <span className={`text-sm font-bold ${stats.winRate >= 50 ? 'text-green-400' : 'text-red-400'}`}>{stats.winRate}%</span>
            </div>
            <div className="text-center w-12">
              <span className="block text-[9px] text-slate-500 uppercase">HS%</span>
              <span className={`text-sm font-bold ${stats.hsPercent >= 25 ? 'text-cyan-400' : 'text-slate-400'}`}>{stats.hsPercent}%</span>
            </div>
          </>
        ) : (
          <span className="text-xs text-slate-600 italic">Sin datos</span>
        )}
      </div>

      {/* Highlighted sort value (mobile-friendly) */}
      <div className="sm:hidden text-right flex-shrink-0 min-w-[50px]">
        <span className="block text-[9px] text-slate-500 uppercase">{SORT_CRITERIA.find(c => c.key === sortKey)?.label}</span>
        <span className="text-base font-bold" style={{ color: rankColor }}>{getSortValue()}</span>
      </div>

      {/* Arrow */}
      <div className="flex-shrink-0 text-slate-700 group-hover:text-slate-400 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}

// ───────────────────────────────────────
// Clan Stats Summary (top bar)
// ───────────────────────────────────────
function ClanSummary({ players }) {
  const validPlayers = players.filter(p => p.stats);
  if (validPlayers.length === 0) return null;

  const avgKda = (validPlayers.reduce((s, p) => s + (p.stats.kda || 0), 0) / validPlayers.length).toFixed(2);
  const avgWr = Math.round(validPlayers.reduce((s, p) => s + (p.stats.winRate || 0), 0) / validPlayers.length);
  const avgHs = Math.round(validPlayers.reduce((s, p) => s + (p.stats.hsPercent || 0), 0) / validPlayers.length);
  const totalMatches = validPlayers.reduce((s, p) => s + (p.stats.matchesPlayed || 0), 0);
  const totalWins = validPlayers.reduce((s, p) => s + (p.stats.wins || 0), 0);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6 animate-fade-in-up" style={{ animationDelay: '50ms' }}>
      {[
        { label: 'KDA Promedio', value: avgKda, color: avgKda >= 1.5 ? '#4ade80' : '#fbbf24' },
        { label: 'Win Rate', value: `${avgWr}%`, color: avgWr >= 50 ? '#4ade80' : '#f87171' },
        { label: 'HS% Promedio', value: `${avgHs}%`, color: avgHs >= 20 ? '#22d3ee' : '#fbbf24' },
        { label: 'Total Partidas', value: totalMatches, color: '#00f7ff' },
        { label: 'Total Victorias', value: totalWins, color: '#4ade80' },
      ].map(stat => (
        <div key={stat.label} className="bg-slate-800/30 border border-slate-700/20 rounded-xl p-3 text-center">
          <span className="block text-[9px] text-slate-500 uppercase tracking-wider mb-0.5">{stat.label}</span>
          <span className="text-lg font-bold" style={{ color: stat.color }}>{stat.value}</span>
        </div>
      ))}
    </div>
  );
}

// ───────────────────────────────────────
// Main Page Component
// ───────────────────────────────────────
export default function LeaderboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [players, setPlayers] = useState([]);
  const [sortKey, setSortKey] = useState('elo');
  const [previousRanking, setPreviousRanking] = useState({}); // name#tag -> previous position

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await valorantAPI.getLeaderboard();
        if (data.status === 'success') {
          setPlayers(data.players || []);
          // Store initial ELO ranking as baseline for position changes
          const eloSorted = [...(data.players || [])].sort((a, b) => (b.mmrData?.elo || 0) - (a.mmrData?.elo || 0));
          const initialRanking = {};
          eloSorted.forEach((p, i) => { initialRanking[`${p.name}#${p.tag}`] = i + 1; });
          setPreviousRanking(initialRanking);
        } else {
          setError('No se pudo cargar el leaderboard');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  // Sort players based on current criteria
  const sortedPlayers = useMemo(() => {
    const sorted = [...players].sort((a, b) => {
      switch (sortKey) {
        case 'elo':
          return (b.mmrData?.elo || 0) - (a.mmrData?.elo || 0);
        case 'kda':
          return (b.stats?.kda || 0) - (a.stats?.kda || 0);
        case 'hsPercent':
          return (b.stats?.hsPercent || 0) - (a.stats?.hsPercent || 0);
        case 'avgScore':
          return (b.stats?.avgScore || 0) - (a.stats?.avgScore || 0);
        case 'matchesPlayed':
          return (b.stats?.matchesPlayed || 0) - (a.stats?.matchesPlayed || 0);
        default:
          return (b.mmrData?.elo || 0) - (a.mmrData?.elo || 0);
      }
    });
    return sorted;
  }, [players, sortKey]);

  // Category medals
  const categoryMedals = useMemo(() => computeCategoryMedals(players), [players]);

  if (loading) return <LeaderboardSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-spectrum-darker via-slate-900 to-spectrum-darker page-pattern flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-xl font-bold text-red-300 mb-2">Error cargando leaderboard</h2>
          <p className="text-sm text-red-400/80 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg border border-slate-700 hover:border-spectrum-cyan/30 transition-all"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-spectrum-darker via-slate-900 to-spectrum-darker page-pattern">
      <div className="max-w-5xl mx-auto px-4 pt-24 pb-12">
        {/* ── Header ── */}
        <div className="relative mb-8 animate-fade-in-up">
          <div className="absolute -top-8 -right-8 opacity-[0.03]">
            <SpectrumLogo className="w-48 h-48" fill="#00f7ff" stroke="#00f7ff" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-white">
            Leaderboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Clasificacion interna del clan Spectrum &middot; {players.length} integrantes
          </p>
        </div>

        {/* ── Clan Summary ── */}
        <ClanSummary players={players} />

        {/* ── Sort Criteria ── */}
        <div className="flex flex-wrap gap-2 mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          {SORT_CRITERIA.map(c => (
            <button
              key={c.key}
              onClick={() => setSortKey(c.key)}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all duration-200 border ${
                sortKey === c.key
                  ? 'bg-spectrum-cyan/10 text-spectrum-cyan border-spectrum-cyan/30 shadow-glow-cyan'
                  : 'text-slate-500 hover:text-slate-300 border-slate-700/30 hover:border-slate-600/40 bg-slate-800/20'
              }`}
            >
              <span>{c.icon}</span>
              {c.label}
            </button>
          ))}
        </div>

        {/* ── Table header (desktop) ── */}
        <div className="hidden sm:flex items-center gap-3 px-4 py-2 text-[9px] text-slate-600 uppercase tracking-widest mb-2">
          <div className="w-10 text-center">#</div>
          <div className="w-5" />
          <div className="w-12" />
          <div className="flex-1">Jugador</div>
          <div className="w-auto" />
          <div className="flex items-center gap-4">
            <div className="w-12 text-center">ELO</div>
            <div className="w-12 text-center">K/D</div>
            <div className="w-12 text-center">Win%</div>
            <div className="w-12 text-center">HS%</div>
          </div>
          <div className="w-4" />
        </div>

        {/* ── Player Rows ── */}
        <div className="space-y-2">
          {sortedPlayers.map((player, i) => {
            const pKey = `${player.name}#${player.tag}`;
            return (
              <LeaderboardRow
                key={pKey}
                player={player}
                position={i + 1}
                sortKey={sortKey}
                previousPosition={previousRanking[pKey]}
                medals={categoryMedals[pKey]}
                animDelay={150 + i * 40}
                onClick={() => navigate(`/integrantes/${encodeURIComponent(player.name)}/${encodeURIComponent(player.tag)}`)}
              />
            );
          })}
        </div>

        {/* ── Footer ── */}
        <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '800ms' }}>
          <p className="text-[10px] text-slate-700">
            Datos basados en las ultimas 10 partidas competitivas de cada integrante &middot; Actualizado cada 10 minutos
          </p>
        </div>
      </div>
    </div>
  );
}
