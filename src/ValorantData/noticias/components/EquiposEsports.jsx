import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cacheService } from '../../../services/cacheService';
import { CACHE_CONFIG } from '../../../utils/constants';

// Featured teams with VLR IDs for quick access
const FEATURED_TEAMS = [
  { id: '2', name: 'Sentinels', tag: 'SEN', region: 'na' },
  { id: '120', name: 'Cloud9', tag: 'C9', region: 'na' },
  { id: '2593', name: 'FNATIC', tag: 'FNC', region: 'eu' },
  { id: '6961', name: 'LOUD', tag: 'LOUD', region: 'br' },
  { id: '8599', name: 'Paper Rex', tag: 'PRX', region: 'ap' },
  { id: '5448', name: 'DRX', tag: 'DRX', region: 'kr' },
  { id: '7930', name: 'LEVIATAN', tag: 'LEV', region: 'las' },
  { id: '278', name: 'G2 Esports', tag: 'G2', region: 'na' },
  { id: '7386', name: 'KRU Esports', tag: 'KRU', region: 'las' },
  { id: '8045', name: 'NRG', tag: 'NRG', region: 'na' },
  { id: '2355', name: '100 Thieves', tag: '100T', region: 'na' },
  { id: '8185', name: 'Evil Geniuses', tag: 'EG', region: 'na' },
  { id: '7023', name: 'FURIA', tag: 'FUR', region: 'br' },
  { id: '4004', name: 'MIBR', tag: 'MIBR', region: 'br' },
  { id: '397', name: 'BBL Esports', tag: 'BBL', region: 'eu' },
  { id: '14419', name: 'GIANTX', tag: 'GX', region: 'eu' },
  { id: '11038', name: 'Bilibili Gaming', tag: 'BLG', region: 'ch' },
  { id: '726', name: 'T1', tag: 'T1', region: 'kr' },
  { id: '1001', name: 'Team Heretics', tag: 'TH', region: 'eu' },
  { id: '17297', name: 'Team Liquid', tag: 'TL', region: 'eu' },
];

const REGIONS = [
  { value: 'all', label: 'Todas' },
  { value: 'na', label: 'NA' },
  { value: 'eu', label: 'EU' },
  { value: 'br', label: 'BR' },
  { value: 'ap', label: 'AP' },
  { value: 'kr', label: 'KR' },
  { value: 'las', label: 'LATAM S' },
  { value: 'lan', label: 'LATAM N' },
  { value: 'jp', label: 'JP' },
  { value: 'ch', label: 'CN' },
];

function countryFlag(code) {
  if (!code || code === 'un') return null;
  const c = code.toUpperCase();
  if (c.length !== 2) return null;
  return String.fromCodePoint(...[...c].map(ch => 0x1F1E6 + ch.charCodeAt(0) - 65));
}

function countryToCode(country) {
  const map = {
    'Europe': 'EU', 'Turkey': 'TR', 'United States': 'US', 'Brazil': 'BR',
    'South Korea': 'KR', 'Japan': 'JP', 'Argentina': 'AR', 'Chile': 'CL',
    'Colombia': 'CO', 'Mexico': 'MX', 'Singapore': 'SG', 'Indonesia': 'ID',
    'Philippines': 'PH', 'Thailand': 'TH', 'Vietnam': 'VN', 'China': 'CN',
    'Canada': 'CA', 'Russia': 'RU', 'Ukraine': 'UA', 'Peru': 'PE',
    'Malaysia': 'MY', 'India': 'IN', 'Australia': 'AU', 'Hong Kong': 'HK',
  };
  return map[country] || country?.substring(0, 2)?.toUpperCase();
}

export default function EquiposEsports({ onSelectTeam }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [region, setRegion] = useState('all');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const searchTimeoutRef = useRef(null);

  // Filter featured teams by region
  const filteredFeatured = region === 'all'
    ? FEATURED_TEAMS
    : FEATURED_TEAMS.filter(t => t.region === region);

  // Search teams via API
  const searchTeams = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    const cacheKey = `teams-search-${region}-${query.toLowerCase()}`;
    const cached = cacheService.get(cacheKey);
    if (cached) {
      setSearchResults(cached.data);
      setHasSearched(true);
      setSearching(false);
      return;
    }

    setSearching(true);
    try {
      const params = new URLSearchParams({ limit: 'all', region });
      const url = `/api-orlandomm/v1/teams?${params}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      if (!json.data || !Array.isArray(json.data)) {
        setSearchResults([]);
        setHasSearched(true);
        return;
      }

      // Filter client-side by name
      const lowerQuery = query.toLowerCase();
      const filtered = json.data.filter(t =>
        t.name.toLowerCase().includes(lowerQuery)
      ).slice(0, 20);

      cacheService.set(cacheKey, filtered, CACHE_CONFIG.TEAMS_TTL);
      setSearchResults(filtered);
      setHasSearched(true);
    } catch (err) {
      console.error('Error buscando equipos:', err);
      setSearchResults([]);
      setHasSearched(true);
    } finally {
      setSearching(false);
    }
  }, [region]);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (!searchQuery || searchQuery.length < 2) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }
    searchTimeoutRef.current = setTimeout(() => searchTeams(searchQuery), 400);
    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchQuery, searchTeams]);

  const displayTeams = searchQuery.length >= 2 ? searchResults : filteredFeatured;
  const showingSearch = searchQuery.length >= 2;

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar equipo..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-800/60 border border-slate-700/30 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-spectrum-cyan/40 transition-colors duration-200"
        />
        {searching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-slate-600 border-t-spectrum-cyan rounded-full animate-spin"></div>
        )}
      </div>

      {/* Region filter */}
      <div className="flex flex-wrap gap-1.5">
        {REGIONS.map((r) => (
          <button
            key={r.value}
            onClick={() => setRegion(r.value)}
            className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border transition-all duration-200 ${
              region === r.value
                ? 'bg-spectrum-cyan/10 text-spectrum-cyan border-spectrum-cyan/30'
                : 'bg-slate-800/40 text-slate-500 border-slate-700/20 hover:text-slate-300 hover:border-slate-600/40'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Section label */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
          {showingSearch ? `Resultados de busqueda` : 'Equipos destacados'}
        </span>
        <span className="text-[10px] text-slate-600">({displayTeams.length})</span>
      </div>

      {/* Teams grid */}
      {displayTeams.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {displayTeams.map((team, idx) => {
            const id = team.id;
            const name = team.name;
            const tag = team.tag || '';
            const country = showingSearch ? countryToCode(team.country) : null;
            const img = team.img || null;

            return (
              <button
                key={id}
                onClick={() => onSelectTeam(id)}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/20 hover:border-spectrum-cyan/30 hover:bg-slate-800/60 transition-all duration-200 text-left group animate-fade-in"
                style={{ animationDelay: `${Math.min(idx * 30, 300)}ms`, animationFillMode: 'both' }}
              >
                {img ? (
                  <img src={img} alt={name} className="w-8 h-8 object-contain flex-shrink-0" loading="lazy" />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-bold text-slate-400">{(tag || name).substring(0, 3)}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate group-hover:text-spectrum-cyan transition-colors duration-200">
                    {name}
                  </p>
                  {tag && (
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">{tag}</p>
                  )}
                </div>
                {country && (
                  <span className="text-xs flex-shrink-0">{countryFlag(country)}</span>
                )}
                <svg className="w-4 h-4 text-slate-600 group-hover:text-spectrum-cyan transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-slate-500 text-sm">
            {showingSearch && hasSearched ? 'No se encontraron equipos.' : 'No hay equipos para esta region.'}
          </p>
        </div>
      )}
    </div>
  );
}
