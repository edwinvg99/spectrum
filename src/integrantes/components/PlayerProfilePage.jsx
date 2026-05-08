import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import anime from 'animejs';
import { valorantAPI } from '../../services/valorantApi';
import { cacheService } from '../../services/cacheService';
import { PLAYERS, DEFAULT_IMAGES, CACHE_CONFIG } from '../../utils/constants';
import SpectrumLogo from '../../assets/images/spectrumLOGO.svg?react';

/* ═══════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════ */
const ROLE_COLORS = {
  'Duelista':    { bg:'bg-red-500/10',    text:'text-red-400',    border:'border-red-500/20',    color:'#f87171' },
  'Iniciador':   { bg:'bg-cyan-500/10',   text:'text-cyan-400',   border:'border-cyan-500/20',   color:'#22d3ee' },
  'Controlador': { bg:'bg-purple-500/10', text:'text-purple-400', border:'border-purple-500/20', color:'#a855f7' },
  'Centinela':   { bg:'bg-green-500/10',  text:'text-green-400',  border:'border-green-500/20',  color:'#4ade80' },
};
const RANK_COLORS = {
  Iron:'#828282', Bronze:'#7c5522', Silver:'#d1d1d1', Gold:'#FFD700',
  Platinum:'#00c7c0', Diamond:'#eb96f2', Ascendant:'#7defb9',
  Immortal:'#ff5551', Radiant:'#ffedaa', Unranked:'#4A5568',
};
const RESULT_STYLES = {
  win:  { bg:'bg-green-500/10',  border:'border-green-500/20',  text:'text-green-400',  label:'Victoria' },
  loss: { bg:'bg-red-500/10',    border:'border-red-500/20',    text:'text-red-400',    label:'Derrota'  },
  draw: { bg:'bg-yellow-500/10', border:'border-yellow-500/20', text:'text-yellow-400', label:'Empate'   },
};

const getRankColor = (name) => {
  if (!name) return RANK_COLORS.Unranked;
  const tier = Object.keys(RANK_COLORS).find(k => name.startsWith(k));
  return RANK_COLORS[tier] || RANK_COLORS.Unranked;
};

const getRankImage = (tierName) => {
  // Map tier name → tier ID for valorant-api.com CDN
  const TIER_IDS = {
    'Iron 1':3,'Iron 2':4,'Iron 3':5,
    'Bronze 1':6,'Bronze 2':7,'Bronze 3':8,
    'Silver 1':9,'Silver 2':10,'Silver 3':11,
    'Gold 1':12,'Gold 2':13,'Gold 3':14,
    'Platinum 1':15,'Platinum 2':16,'Platinum 3':17,
    'Diamond 1':18,'Diamond 2':19,'Diamond 3':20,
    'Ascendant 1':21,'Ascendant 2':22,'Ascendant 3':23,
    'Immortal 1':24,'Immortal 2':25,'Immortal 3':26,
    'Radiant':27,
  };
  const id = TIER_IDS[tierName];
  if (!id) return null;
  return `https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/${id}/largeicon.png`;
};


/* ═══════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════ */

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-spectrum-darker page-pattern animate-pulse">
      <div className="h-64 bg-slate-800/40" />
      <div className="max-w-5xl mx-auto px-4 -mt-24 space-y-5">
        <div className="h-48 bg-slate-800/30 rounded-2xl" />
        <div className="grid grid-cols-6 gap-3">
          {[...Array(6)].map((_, i) => <div key={i} className="h-24 bg-slate-800/30 rounded-xl" />)}
        </div>
        <div className="h-64 bg-slate-800/30 rounded-xl" />
        {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-slate-800/20 rounded-lg" />)}
      </div>
    </div>
  );
}

function StatBox({ label, value, color, subtext }) {
  const numRef = useRef(null);
  const boxRef = useRef(null);
  const isNumeric = !isNaN(parseFloat(value)) && !String(value).includes('/');

  useEffect(() => {
    if (!boxRef.current) return;
    anime({ targets: boxRef.current, opacity:[0,1], translateY:[16,0], duration:600, easing:'easeOutExpo' });
    if (isNumeric && numRef.current) {
      const obj = { val: 0 };
      anime({
        targets: obj, val: parseFloat(value), duration: 1200, easing: 'easeOutExpo', delay: 200,
        update: () => {
          if (!numRef.current) return;
          const sv = String(value);
          const display = sv.includes('%')
            ? `${obj.val.toFixed(0)}%`
            : obj.val >= 100 ? Math.round(obj.val) : obj.val.toFixed(2);
          numRef.current.textContent = display;
        },
      });
    }
  }, [value]);

  return (
    <div ref={boxRef}
      className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-4 text-center
                 hover:border-slate-600/50 transition-colors duration-200"
      style={{ opacity: 0 }}>
      <span className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">{label}</span>
      <span ref={numRef} className="block text-2xl font-black tabular-nums" style={{ color }}>{value}</span>
      {subtext && <span className="block text-[10px] text-slate-600 mt-0.5">{subtext}</span>}
    </div>
  );
}

/* ── Peak Rank Card ── */
function PeakRankCard({ peakData, mmrDetailed }) {
  const peak = mmrDetailed || peakData;
  if (!peak?.peakTier) return null;

  const peakColor  = getRankColor(peak.peakTier);
  const peakImg    = getRankImage(peak.peakTier);

  return (
    <div className="bg-slate-800/30 border border-slate-700/20 rounded-xl p-5">
      <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Rango Máximo</h3>
      <div className="flex items-center gap-4">
        {peakImg && (
          <img src={peakImg} alt={peak.peakTier} className="w-16 h-16 object-contain drop-shadow-lg" />
        )}
        <div>
          <span className="block text-xl font-black" style={{ color: peakColor }}>
            {peak.peakTier}
          </span>
          {peak.peakSeason && (
            <span className="block text-xs text-slate-500 mt-0.5">
              Temporada {peak.peakSeason}
              {peak.peakRR > 0 && <span className="ml-2 text-slate-400 font-bold">{peak.peakRR} RR</span>}
            </span>
          )}
        </div>
      </div>
      {/* Current RR + Shields */}
      {(peak.currentRR !== undefined || peak.shields > 0) && (
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-700/20">
          {peak.currentRR !== undefined && (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-500 uppercase">RR actual</span>
              <span className="text-sm font-black text-white">{peak.currentRR}</span>
            </div>
          )}
          {peak.shields > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-500 uppercase">Escudos</span>
              <span className="text-sm font-black text-amber-400">🛡️ {peak.shields}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Seasonal Breakdown ── */
function SeasonalHistory({ peakData, mmrDetailed }) {
  const seasonal = mmrDetailed?.seasonal || peakData?.seasonal;
  if (!seasonal?.length) return null;

  return (
    <div className="bg-slate-800/30 border border-slate-700/20 rounded-xl p-5">
      <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Historial por Temporada</h3>
      <div className="space-y-2">
        {seasonal.map((s, i) => {
          const c = getRankColor(s.endTier);
          return (
            <div key={i} className="flex items-center justify-between bg-slate-800/40 border border-slate-700/20 rounded-lg p-3
                                     hover:border-slate-600/40 transition-colors animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-slate-400 w-10">{s.season}</span>
                <span className="text-sm font-bold" style={{ color: c }}>{s.endTier}</span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-slate-500">
                  {s.wins}/{s.games}
                  <span className={`ml-1 font-bold ${s.winRate >= 50 ? 'text-green-400' : 'text-red-400'}`}>
                    ({s.winRate}%)
                  </span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── ELO chart ── */
function EloChart({ mmrHistory, rankColor }) {
  if (!mmrHistory?.length || mmrHistory.length < 2) {
    return (
      <div className="bg-slate-800/30 border border-slate-700/20 rounded-xl p-8 text-center">
        <p className="text-sm text-slate-500">No hay suficientes datos de ELO para graficar.</p>
      </div>
    );
  }
  const avg    = Math.round(mmrHistory.reduce((s, e) => s + e.elo, 0) / mmrHistory.length);
  const minElo = Math.min(...mmrHistory.map(e => e.elo));
  const maxElo = Math.max(...mmrHistory.map(e => e.elo));
  const delta  = mmrHistory[mmrHistory.length-1].elo - mmrHistory[0].elo;
  const data   = mmrHistory.map((e, i) => ({ idx: i+1, elo: e.elo, rank: e.rank, change: e.change }));

  return (
    <div className="bg-slate-800/30 border border-slate-700/20 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black text-white uppercase tracking-widest">Progreso de ELO</h3>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-500">Min: <span className="text-slate-400 font-semibold">{minElo}</span></span>
          <span className="text-slate-500">Max: <span className="text-slate-400 font-semibold">{maxElo}</span></span>
          <span className={`font-black text-sm ${delta >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {delta >= 0 ? '+' : ''}{delta}
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top:5, right:10, left:-20, bottom:5 }}>
          <XAxis dataKey="idx" tick={{ fill:'#64748b', fontSize:10 }} axisLine={{ stroke:'#334155' }} tickLine={false} />
          <YAxis domain={[minElo-30, maxElo+30]} tick={{ fill:'#64748b', fontSize:10 }} axisLine={{ stroke:'#334155' }} tickLine={false} />
          <ReferenceLine y={avg} stroke="#334155" strokeDasharray="3 3" />
          <Tooltip
            contentStyle={{ backgroundColor:'#1e293b', border:'1px solid #334155', borderRadius:'8px', fontSize:'12px' }}
            formatter={(val, _name, props) => {
              const e = props.payload;
              return [
                <span key="v">
                  <span style={{ color: rankColor, fontWeight:'bold' }}>{val}</span>
                  {e.change !== undefined && (
                    <span style={{ color: e.change >= 0 ? '#4ade80' : '#f87171', marginLeft:6 }}>
                      ({e.change >= 0 ? '+' : ''}{e.change})
                    </span>
                  )}
                </span>,
                'ELO',
              ];
            }}
            labelFormatter={(idx) => data[idx-1]?.rank || `Partida ${idx}`}
          />
          <Line type="monotone" dataKey="elo" stroke={rankColor} strokeWidth={2.5}
            dot={{ fill:rankColor, r:3, strokeWidth:0 }}
            activeDot={{ r:6, fill:rankColor, stroke:'#0f172a', strokeWidth:2 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ── Role distribution ── */
function RoleAnalysis({ stats }) {
  if (!stats?.roleCounts) return null;
  const total = Object.values(stats.roleCounts).reduce((s, c) => s + c, 0);
  const roles = Object.entries(stats.roleCounts)
    .sort(([,a],[,b]) => b - a)
    .map(([role, count]) => ({ role, count, pct: total > 0 ? Math.round((count/total)*100) : 0 }));

  return (
    <div className="bg-slate-800/30 border border-slate-700/20 rounded-xl p-5">
      <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Distribución de Roles</h3>
      <div className="space-y-3">
        {roles.map(({ role, count, pct }) => {
          const s = ROLE_COLORS[role] || ROLE_COLORS.Duelista;
          return (
            <div key={role}>
              <div className="flex justify-between mb-1">
                <span className={`text-xs font-bold ${s.text}`}>{role}</span>
                <span className="text-xs text-slate-500">{count} partidas ({pct}%)</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full rounded-full animate-fade-in"
                  style={{
                    width: `${pct}%`, backgroundColor: s.color,
                    transition: 'width 1s cubic-bezier(.22,1,.36,1)',
                    animation: 'progress-fill 1.2s cubic-bezier(.22,1,.36,1) both',
                    '--target-width': `${pct}%`,
                  }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Top agents ── */
function TopAgentsSection({ topAgents }) {
  if (!topAgents?.length) return null;
  return (
    <div className="bg-slate-800/30 border border-slate-700/20 rounded-xl p-5">
      <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Agentes Principales</h3>
      <div className="space-y-2">
        {topAgents.map((agent, i) => {
          const rs = ROLE_COLORS[agent.role] || ROLE_COLORS.Duelista;
          return (
            <div key={agent.name}
              className="flex items-center gap-3 bg-slate-800/40 border border-slate-700/20
                         rounded-xl p-3 hover:border-slate-600/40 transition-colors animate-fade-in-up"
              style={{ animationDelay: `${i*80}ms` }}>
              <div className="relative flex-shrink-0">
                {agent.image
                  ? <img src={agent.image} alt={agent.name} className="w-12 h-12 rounded-lg object-cover bg-slate-700/30" />
                  : <div className="w-12 h-12 rounded-lg bg-slate-700/30" />}
                <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-slate-800 border border-slate-600
                                 flex items-center justify-center text-[9px] font-black text-slate-300">{i+1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white">{agent.name}</span>
                  <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full border ${rs.bg} ${rs.text} ${rs.border}`}>
                    {agent.role}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-[10px] text-slate-500">{agent.games} partidas</span>
                  <span className="text-[10px] text-slate-400">KDA: <span className="font-bold text-slate-300">{agent.kda}</span></span>
                  {agent.winRate !== undefined && (
                    <span className={`text-[10px] font-bold ${agent.winRate >= 50 ? 'text-green-400' : 'text-red-400'}`}>
                      {agent.winRate}% WR
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Map stats ── */
function MapStatsSection({ topMaps }) {
  if (!topMaps?.length) return null;
  return (
    <div className="bg-slate-800/30 border border-slate-700/20 rounded-xl p-5">
      <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Rendimiento por Mapa</h3>
      <div className="space-y-2">
        {topMaps.map((m, i) => (
          <div key={m.map}
            className="flex items-center justify-between bg-slate-800/40 border border-slate-700/20
                       rounded-lg p-3 hover:border-slate-600/40 transition-colors animate-fade-in-up"
            style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-white">{m.map}</span>
              <span className="text-[10px] text-slate-500">{m.games} partidas</span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className={`font-bold ${m.winRate >= 50 ? 'text-green-400' : 'text-red-400'}`}>
                {m.winRate}% WR
              </span>
              <span className={`font-bold ${m.kd >= 1 ? 'text-green-400' : 'text-red-400'}`}>
                {m.kd} K/D
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Match row ── */
function MatchRow({ match, index, mapImage }) {
  const s  = RESULT_STYLES[match.result] || RESULT_STYLES.loss;
  const rs = ROLE_COLORS[match.role] || ROLE_COLORS.Duelista;
  const totalShots = (match.headshots||0) + (match.bodyshots||0) + (match.legshots||0);
  const hsPct = totalShots > 0 ? Math.round((match.headshots/totalShots)*100) : 0;

  return (
    <div
      className={`flex items-center gap-3 ${s.bg} border ${s.border} rounded-xl p-3
                  hover:bg-slate-800/50 transition-all duration-200 animate-fade-in-up group`}
      style={{ animationDelay: `${index*25}ms` }}>
      {/* result stripe */}
      <div className={`w-1 self-stretch rounded-full flex-shrink-0
        ${match.result==='win' ? 'bg-green-500' : match.result==='loss' ? 'bg-red-500' : 'bg-yellow-500'}`} />

      {/* agent */}
      <div className="flex-shrink-0">
        {match.agentImage
          ? <img src={match.agentImage} alt={match.agent} className="w-10 h-10 rounded-lg object-cover bg-slate-700/30" />
          : <div className="w-10 h-10 rounded-lg bg-slate-700/30 flex items-center justify-center text-xs text-slate-500">?</div>}
      </div>

      {/* info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          {mapImage && (
            <img src={mapImage} alt={match.map}
              className="w-12 h-7 rounded object-cover opacity-60 flex-shrink-0 hidden sm:block" />
          )}
          <span className="text-sm font-bold text-white">{match.map}</span>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${rs.bg} ${rs.text} ${rs.border}`}>
            {match.agent}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-0.5 text-xs flex-wrap">
          <span className={`font-semibold ${s.text}`}>{s.label}</span>
          <span className="text-slate-500">{match.score}</span>
          {match.startedAt && <span className="text-slate-600 text-[10px]">{match.startedAt}</span>}
        </div>
      </div>

      {/* KDA */}
      <div className="text-center px-2 flex-shrink-0">
        <div className="text-sm font-bold">
          <span className="text-green-400">{match.kills}</span>
          <span className="text-slate-600">/</span>
          <span className="text-red-400">{match.deaths}</span>
          <span className="text-slate-600">/</span>
          <span className="text-cyan-400">{match.assists}</span>
        </div>
        <span className="text-[9px] text-slate-500">KDA</span>
      </div>

      {/* extra stats */}
      <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
        <div className="text-center">
          <span className={`block text-sm font-bold ${parseFloat(match.kdRatio)>=1?'text-green-400':'text-red-400'}`}>
            {match.kdRatio}
          </span>
          <span className="text-[9px] text-slate-500">K/D</span>
        </div>
        <div className="text-center">
          <span className={`block text-sm font-bold ${hsPct>=25?'text-cyan-400':'text-slate-400'}`}>{hsPct}%</span>
          <span className="text-[9px] text-slate-500">HS</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   PROFILE FETCH + CACHE HELPER
   Single server call → /profile/ endpoint (3 Henrik API calls total)
═══════════════════════════════════════ */
async function fetchFresh(cacheKey, ttl, name, tag, region) {
  const res = await valorantAPI.getPlayerProfile(name, tag, region);

  if (res?.status !== 'success') {
    throw new Error(res?.message || 'No se pudieron cargar los datos del jugador');
  }

  const mmr = res.mmr;  // { currentTier, currentRR, elo, peakTier, peakSeason, seasonal, rankImageUrl, ... }

  const profile = {
    playerData:  res.playerData,
    /* mmrData shape kept compatible with PlayerCard */
    mmrData: {
      currenttierpatched: mmr.currentTier,
      elo:   mmr.elo,
      rr:    mmr.currentRR,
      images: { large: mmr.rankImageUrl },
    },
    peakData: {
      peakTier:   mmr.peakTier,
      peakSeason: mmr.peakSeason,
      peakRR:     mmr.peakRR,
      currentRR:  mmr.currentRR,
      shields:    mmr.shields,
    },
    mmrDetailed: mmr,   // full object with seasonal[], leaderboardPos, etc.
    stats:       res.stats,
    matches:     res.matches   || [],
    mmrHistory:  res.mmrHistory || [],
  };

  cacheService.set(cacheKey, profile, ttl);
  return profile;
}

/* ═══════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════ */
export default function PlayerProfilePage() {
  const { name, tag } = useParams();
  const navigate      = useNavigate();
  const headerRef     = useRef(null);

  const [loading,      setLoading]      = useState(true);
  const [fromCache,    setFromCache]    = useState(false);
  const [error,        setError]        = useState(null);
  const [playerData,   setPlayerData]   = useState(null);
  const [mmrData,      setMmrData]      = useState(null);
  const [peakData,     setPeakData]     = useState(null);
  const [mmrDetailed,  setMmrDetailed]  = useState(null);
  const [playerStats,  setPlayerStats]  = useState(null);
  const [matches,      setMatches]      = useState([]);
  const [mmrHistory,   setMmrHistory]   = useState([]);
  const [matchFilter,  setMatchFilter]  = useState('all');
  const [mapImages,    setMapImages]    = useState({});

  const playerInfo = useMemo(() =>
    PLAYERS.find(p =>
      p.name.toLowerCase() === decodeURIComponent(name||'').toLowerCase() &&
      p.tag.toLowerCase()  === decodeURIComponent(tag||'').toLowerCase()
    ),
  [name, tag]);

  useEffect(() => {
    if (!name || !tag) return;
    const dName  = decodeURIComponent(name);
    const dTag   = decodeURIComponent(tag);
    const region = playerInfo?.region || 'latam';

    const PROFILE_CACHE_KEY = `profile_${dName}_${dTag}_${region}`;
    const PROFILE_TTL       = 10 * 60 * 1000; // 10 min

    const applyProfile = (p) => {
      setPlayerData(p.playerData);
      setMmrData(p.mmrData);
      setPeakData(p.peakData);
      setMmrDetailed(p.mmrDetailed);
      setPlayerStats(p.stats);
      setMatches(p.matches);
      setMmrHistory(p.mmrHistory);
    };

    const load = async () => {
      setLoading(true);
      setError(null);

      /* ── 1. Try cache first ── */
      const cached = cacheService.get(PROFILE_CACHE_KEY);
      if (cached) {
        console.log(`⚡ Profile from cache (${Math.round(cached.age / 1000)}s old)`);
        applyProfile(cached.data);
        setFromCache(true);
        setLoading(false);

        /* If stale, silently refresh in background */
        if (cached.isStale) {
          fetchFresh(PROFILE_CACHE_KEY, PROFILE_TTL, dName, dTag, region)
            .then(fresh => { applyProfile(fresh); setFromCache(false); })
            .catch(() => {});
        }
        return;
      }

      /* ── 2. Full fetch ── */
      try {
        const fresh = await fetchFresh(PROFILE_CACHE_KEY, PROFILE_TTL, dName, dTag, region);
        applyProfile(fresh);
        setFromCache(false);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [name, tag, playerInfo]);

  /* fetch map images once */
  useEffect(() => {
    fetch('https://valorant-api.com/v1/maps')
      .then(r => r.json())
      .then(({ data }) => {
        const lookup = {};
        (data || []).forEach(m => { if (m.displayName) lookup[m.displayName] = m.listViewIcon; });
        setMapImages(lookup);
      })
      .catch(() => {});
  }, []);

  /* header entrance animation */
  useEffect(() => {
    if (loading || !headerRef.current) return;
    anime({
      targets:    headerRef.current.querySelectorAll('.profile-part'),
      translateY: [20, 0],
      opacity:    [0, 1],
      duration:   600,
      delay:      anime.stagger(80, { start: 200 }),
      easing:     'easeOutExpo',
    });
  }, [loading]);

  const filteredMatches = useMemo(() => {
    if (matchFilter === 'all') return matches;
    return matches.filter(m => m.result === matchFilter);
  }, [matches, matchFilter]);

  if (loading) return <ProfileSkeleton />;

  if (error || !playerData) {
    return (
      <div className="min-h-screen bg-spectrum-darker page-pattern flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😵</div>
          <h2 className="text-xl font-bold text-red-300 mb-2">Error cargando perfil</h2>
          <p className="text-sm text-red-400/80 mb-6">{error || 'No se encontraron datos.'}</p>
          <button onClick={() => navigate('/integrantes')}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium
                       rounded-lg border border-slate-700 hover:border-spectrum-cyan/30 transition-all">
            ← Volver a Integrantes
          </button>
        </div>
      </div>
    );
  }

  const cardImage   = playerData.card?.wide    || playerData.card?.large || DEFAULT_IMAGES.ERROR_CARD;
  const playerAvatar= playerData.card?.small   || DEFAULT_IMAGES.DEFAULT_AVATAR;
  const currentTier = mmrDetailed?.currentTier || mmrData?.currenttierpatched || 'Unranked';
  const rankColor   = getRankColor(currentTier);
  const rankImage   = mmrDetailed?.rankImageUrl || mmrData?.images?.large || DEFAULT_IMAGES.UNRANKED_ICON;
  const elo         = mmrDetailed?.elo  || mmrData?.elo  || 'N/A';
  const currentRR   = mmrDetailed?.currentRR ?? peakData?.currentRR ?? null;
  const primaryRole = playerStats?.primaryRole;
  const roleStyle   = primaryRole ? (ROLE_COLORS[primaryRole] || ROLE_COLORS.Duelista) : null;

  return (
    <div className="min-h-screen bg-spectrum-darker page-pattern">

      {/* ── Banner ── */}
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage:`url(${cardImage})`, filter:'blur(1px)', opacity: 0.3 }} />
        <div className="absolute inset-0 bg-gradient-to-t from-spectrum-darker via-spectrum-darker/85 to-spectrum-darker/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-spectrum-darker/70 to-transparent" />

        <div className="absolute top-20 left-4 z-10 flex items-center gap-2">
          <button onClick={() => navigate('/integrantes')}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900/70 hover:bg-slate-800/80
                       text-slate-300 hover:text-white text-sm rounded-xl border border-slate-700/50
                       backdrop-blur-sm transition-all duration-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Integrantes
          </button>
          {fromCache && (
            <button
              onClick={() => {
                const dName  = decodeURIComponent(name);
                const dTag   = decodeURIComponent(tag);
                const region = playerInfo?.region || 'latam';
                const key    = `profile_${dName}_${dTag}_${region}`;
                cacheService.remove(key);
                window.location.reload();
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20
                         text-amber-400 text-xs font-semibold rounded-xl border border-amber-500/20
                         backdrop-blur-sm transition-all duration-200"
              title="Datos desde caché — clic para actualizar"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Caché
            </button>
          )}
        </div>

      </div>

      {/* ── Profile block ── */}
      <div className="max-w-5xl mx-auto px-4 -mt-28 relative z-10 pb-16">

        {/* Header info */}
        <div ref={headerRef} className="flex flex-col sm:flex-row items-start gap-6 mb-8">
          <div className="profile-part opacity-0 relative flex-shrink-0">
            <img src={playerAvatar} alt={`${playerData.name} avatar`}
              className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl border-4 object-cover shadow-2xl"
              style={{ borderColor:`${rankColor}70`, boxShadow:`0 16px 48px -8px ${rankColor}40` }} />
            <div className="absolute -bottom-3 -right-3">
              <img src={rankImage} alt={currentTier} className="w-12 h-12 object-contain drop-shadow-gold" />
            </div>
          </div>

          <div className="flex-1 pt-3">
            <div className="profile-part opacity-0">
              <h1 className="text-4xl sm:text-5xl font-display font-black text-white">
                {playerData.name}
                <span className="ml-2 text-2xl font-bold" style={{ color: rankColor }}>
                  #{playerData.tag}
                </span>
              </h1>
            </div>
            <div className="profile-part opacity-0 flex flex-wrap items-center gap-2 mt-2">
              <span className="text-base font-black uppercase tracking-widest" style={{ color: rankColor }}>
                {currentTier}
              </span>
              {currentRR !== null && (
                <>
                  <span className="text-slate-700">·</span>
                  <span className="text-sm text-slate-400">
                    <span className="font-black" style={{ color: rankColor }}>{currentRR}</span> RR
                  </span>
                </>
              )}
              <span className="text-slate-700">·</span>
              <span className="text-sm text-slate-400">ELO: <span className="font-black" style={{ color: rankColor }}>{elo}</span></span>
              <span className="text-slate-700">·</span>
              <span className="text-sm text-slate-400">Nivel {playerData.account_level || 0}</span>
              {roleStyle && (
                <>
                  <span className="text-slate-700">·</span>
                  <span className={`text-xs font-black px-2 py-0.5 rounded-full border ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}`}>
                    {primaryRole}
                  </span>
                </>
              )}
              {/* Peak rank badge inline */}
              {(mmrDetailed?.peakTier || peakData?.peakTier) && (
                <>
                  <span className="text-slate-700">·</span>
                  <span className="text-xs text-slate-500">
                    Peak: <span className="font-black" style={{ color: getRankColor(mmrDetailed?.peakTier || peakData?.peakTier) }}>
                      {mmrDetailed?.peakTier || peakData?.peakTier}
                    </span>
                  </span>
                </>
              )}
            </div>
            {playerStats && (
              <p className="profile-part opacity-0 text-xs text-sky-600 ">
                {playerStats.matchesPlayed} partidas competitivas analizadas
              </p>
            )}
          </div>
        </div>

        {/* ── Stats grid ── */}
        {playerStats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
            <StatBox label="K/D"      value={playerStats.kd}               color={playerStats.kd >= 1 ? '#4ade80' : '#f87171'} />
            <StatBox label="KDA"      value={playerStats.kda}              color={playerStats.kda >= 1.5 ? '#4ade80' : playerStats.kda >= 1 ? '#fbbf24' : '#f87171'} />
            <StatBox label="Win Rate" value={`${playerStats.winRate}%`}    color={playerStats.winRate >= 50 ? '#4ade80' : '#f87171'}
              subtext={`${playerStats.wins}V · ${playerStats.matchesPlayed - playerStats.wins}D`} />
            <StatBox label="HS%"      value={`${playerStats.hsPercent}%`}  color={playerStats.hsPercent >= 25 ? '#22d3ee' : '#fbbf24'} />
         
          </div>
        )}

        {/* ── Chart + Peak + Seasonal ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="space-y-4">
            <EloChart mmrHistory={mmrHistory} rankColor={rankColor} />
            <PeakRankCard peakData={peakData} mmrDetailed={mmrDetailed} />
          </div>
          <div className="space-y-4">
            <SeasonalHistory peakData={peakData} mmrDetailed={mmrDetailed} />
            <RoleAnalysis stats={playerStats} />
          </div>
        </div>

        {/* ── Agents + Maps ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <TopAgentsSection topAgents={playerStats?.topAgents} />
          <MapStatsSection topMaps={playerStats?.topMaps} />
        </div>

        {/* ── Match history ── */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Historial de Partidas</h3>
            <div className="flex gap-1">
              {[
                { key:'all',  label:'Todas'     },
                { key:'win',  label:'Victorias' },
                { key:'loss', label:'Derrotas'  },
              ].map(f => (
                <button key={f.key} onClick={() => setMatchFilter(f.key)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors
                    ${matchFilter === f.key
                      ? 'bg-spectrum-cyan/10 text-spectrum-cyan border border-spectrum-cyan/30'
                      : 'text-slate-500 hover:text-slate-300 border border-transparent'}`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {filteredMatches.length === 0 ? (
            <div className="bg-slate-800/20 border border-slate-700/20 rounded-xl p-10 text-center">
              <p className="text-sm text-slate-500">
                {matches.length === 0 ? 'No se encontraron partidas recientes.' : 'No hay partidas con este filtro.'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredMatches.map((match, i) => (
                <MatchRow key={match.matchId || i} match={match} index={i} mapImage={mapImages[match.map]} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
