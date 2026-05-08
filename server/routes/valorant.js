const express = require('express');
const fetch   = require('node-fetch');
const router  = express.Router();

const API_KEY  = process.env.API_KEY;
const HENRIK   = 'https://api.henrikdev.xyz';
const PLATFORM = 'pc';

/* ── helpers ──────────────────────────────────────────────────────── */
const hGet = (path) =>
  fetch(`${HENRIK}${path}`, {
    headers: {
      Authorization: API_KEY,
      Accept: '*/*',
      'User-Agent': 'Spectrum-App/2.0',
    },
  });

const safeJson = async (r) => {
  try { return await r.json(); } catch { return {}; }
};

/** Always return an array, even if the API returns null/object/error */
const toArray = (v) => (Array.isArray(v) ? v : []);

/* ── Agent-role lookup ─────────────────────────────────────────────── */
const AGENT_ROLES = {
  Jett:'Duelista', Reyna:'Duelista', Raze:'Duelista', Phoenix:'Duelista',
  Yoru:'Duelista', Neon:'Duelista', Iso:'Duelista', Waylay:'Duelista',
  Sova:'Iniciador', Breach:'Iniciador', Skye:'Iniciador',
  'KAY/O':'Iniciador', Fade:'Iniciador', Gekko:'Iniciador', Tejo:'Iniciador',
  Brimstone:'Controlador', Viper:'Controlador', Omen:'Controlador',
  Astra:'Controlador', Harbor:'Controlador', Clove:'Controlador',
  Killjoy:'Centinela', Cypher:'Centinela', Sage:'Centinela',
  Chamber:'Centinela', Deadlock:'Centinela', Vyse:'Centinela',
};
const agentRole = (n) => {
  if (!n) return 'Duelista';
  if (n.toUpperCase().startsWith('KAY')) return 'Iniciador';
  return AGENT_ROLES[n] || 'Duelista';
};

/* ── Rank image URL from tier name ────────────────────────────────── */
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
const rankImg = (tierName) => {
  const id = TIER_IDS[tierName];
  return id
    ? `https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/${id}/largeicon.png`
    : 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/0/largeicon.png';
};

/* ── Normalise a v4 match object into a consistent internal shape ──── */
function normMatch(m) {
  // v4: players is a flat array; v3 (legacy): players.all_players
  const players = Array.isArray(m.players)
    ? m.players
    : (m.players?.all_players || []);

  // v4: teams keyed by lowercase "blue"/"red"
  const blueTeam = m.teams?.blue || m.teams?.Blue || {};
  const redTeam  = m.teams?.red  || m.teams?.Red  || {};

  // v4: rounds.won; v3: rounds_won
  const blueR = blueTeam.rounds?.won ?? blueTeam.rounds_won ?? 0;
  const redR  = redTeam.rounds?.won  ?? redTeam.rounds_won  ?? 0;
  const blueWon = blueTeam.won ?? false;

  // v4: metadata.map is {id, name}; v3: metadata.map is a string
  const mapName = m.metadata?.map?.name || m.metadata?.map || 'Unknown';

  // v4: started_at is ISO; v3: game_start_patched is already human-readable
  const rawDate   = m.metadata?.started_at || m.metadata?.game_start_patched || '';
  const startedAt = rawDate
    ? (() => {
        try {
          return new Date(rawDate).toLocaleString('es-CO', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
          });
        } catch { return rawDate; }
      })()
    : '';

  // v4: match_id or matchid
  const matchId = m.metadata?.match_id || m.metadata?.matchid || '';

  return { players, blueR, redR, blueWon, mapName, startedAt, matchId };
}

/* ── Find a specific player in the normalised player list ────────────── */
function findMe(players, name, tag) {
  return players.find(
    p => p.name?.toLowerCase() === name.toLowerCase() &&
         p.tag?.toLowerCase()  === tag.toLowerCase()
  ) || players[0];
}

/* ── Resolve agent name and image from either v4 or v3 structure ─────── */
function resolveAgent(me) {
  // v4: me.agent.name + me.agent.assets.display_icon_small / killfeed_portrait
  // v3: me.character + me.assets.agent.small
  const name  = me.agent?.name  || me.character || 'Unknown';
  const image = me.agent?.assets?.display_icon_small  // v4 primary
             || me.agent?.assets?.killfeed_portrait    // v4 alt
             || me.agent?.assets?.small_portrait       // v4 alt2
             || me.agent?.assets?.display_icon         // v4 fallback
             || me.assets?.agent?.small                // v3
             || me.assets?.agent?.killfeed             // v3 alt
             || '';
  return { name, image };
}

/* ── Process raw v4/v3 matches into our schema ───────────────────────── */
function processMatches(rawMatches, name, tag) {
  return rawMatches.map((m) => {
    const { players, blueR, redR, blueWon, mapName, startedAt, matchId } = normMatch(m);
    const me = findMe(players, name, tag);
    if (!me) return null;

    // v4: team_id = "Blue"/"Red"; v3: team = "blue"/"red"
    const myTeam = (me.team_id || me.team || '').toLowerCase();
    const myWin  = myTeam === 'blue' ? blueWon : !blueWon;
    const score  = myTeam === 'blue' ? `${blueR}-${redR}` : `${redR}-${blueR}`;

    const kills   = me.stats?.kills   ?? 0;
    const deaths  = me.stats?.deaths  ?? 1;
    const assists = me.stats?.assists ?? 0;
    const rounds  = blueR + redR;

    // v4: no average_combat_score — derive from stats.score / rounds
    const acs = me.average_combat_score
      ?? (rounds > 0 ? Math.round((me.stats?.score ?? 0) / rounds) : 0);

    const { name: agentName, image: agentImage } = resolveAgent(me);

    return {
      matchId,
      map:            mapName,
      agent:          agentName,
      agentImage,
      role:           agentRole(agentName),
      result:         myWin ? 'win' : 'loss',
      score,
      kills,
      deaths,
      assists,
      headshots:      me.stats?.headshots ?? 0,
      bodyshots:      me.stats?.bodyshots ?? 0,
      legshots:       me.stats?.legshots  ?? 0,
      avgCombatScore: acs,
      kdRatio:        deaths > 0 ? (kills / deaths).toFixed(2) : kills.toFixed(2),
      startedAt,
      roundsPlayed:   rounds,
      damagePerRound: rounds > 0 ? Math.round((me.damage_made ?? 0) / rounds) : 0,
      damageMade:     me.damage_made     ?? 0,
      damageReceived: me.damage_received ?? 0,
    };
  }).filter(Boolean);
}

/* ── Aggregate stats from processed matches ─────────────────────────── */
function aggregateStats(rawMatches, name, tag) {
  let totalKills = 0, totalDeaths = 0, totalAssists = 0;
  let totalHS = 0, totalBS = 0, totalLS = 0;
  let totalScore = 0, totalDamage = 0, totalRounds = 0, wins = 0;
  const agentMap = {}, roleCount = {}, mapStats = {};
  let valid = 0;

  rawMatches.forEach((m) => {
    const { players, blueR, redR, blueWon, mapName } = normMatch(m);
    const me = findMe(players, name, tag);
    if (!me) return;

    valid++;
    const myTeam = (me.team_id || me.team || '').toLowerCase();
    const isWin  = myTeam === 'blue' ? blueWon : !blueWon;
    if (isWin) wins++;

    const k = me.stats?.kills   ?? 0;
    const d = me.stats?.deaths  ?? 0;
    const a = me.stats?.assists ?? 0;
    totalKills   += k;
    totalDeaths  += d;
    totalAssists += a;
    totalHS      += me.stats?.headshots ?? 0;
    totalBS      += me.stats?.bodyshots ?? 0;
    totalLS      += me.stats?.legshots  ?? 0;
    totalDamage  += me.damage_made ?? 0;

    const rounds = blueR + redR;
    totalRounds += rounds;
    // v4: compute ACS from stats.score / rounds; v3: average_combat_score
    totalScore += me.average_combat_score
      ?? (rounds > 0 ? Math.round((me.stats?.score ?? 0) / rounds) : 0);

    const { name: agentName, image: agentImage } = resolveAgent(me);
    const role = agentRole(agentName);

    if (!agentMap[agentName]) {
      agentMap[agentName] = { name: agentName, role, games: 0, wins: 0, kills: 0, deaths: 0, assists: 0, image: agentImage };
    } else if (!agentMap[agentName].image && agentImage) {
      agentMap[agentName].image = agentImage;
    }
    agentMap[agentName].games++;
    if (isWin) agentMap[agentName].wins++;
    agentMap[agentName].kills   += k;
    agentMap[agentName].deaths  += d;
    agentMap[agentName].assists += a;
    roleCount[role] = (roleCount[role] || 0) + 1;

    if (!mapStats[mapName]) mapStats[mapName] = { map: mapName, games: 0, wins: 0, kills: 0, deaths: 0 };
    mapStats[mapName].games++;
    if (isWin) mapStats[mapName].wins++;
    mapStats[mapName].kills  += k;
    mapStats[mapName].deaths += d;
  });

  if (!valid) return null;

  const totalShots = totalHS + totalBS + totalLS;
  const hsPercent  = totalShots > 0 ? Math.round((totalHS / totalShots) * 100) : 0;
  const kd  = totalDeaths > 0 ? parseFloat((totalKills / totalDeaths).toFixed(2)) : totalKills;
  const kda = totalDeaths > 0 ? parseFloat(((totalKills + totalAssists / 3) / totalDeaths).toFixed(2)) : totalKills;

  const topAgents = Object.values(agentMap)
    .map(a => ({
      ...a,
      kda:     a.deaths > 0 ? parseFloat(((a.kills + a.assists / 3) / a.deaths).toFixed(2)) : a.kills,
      winRate: a.games  > 0 ? Math.round((a.wins / a.games) * 100) : 0,
    }))
    .sort((a, b) => b.games - a.games)
    .slice(0, 5);

  const topMaps = Object.values(mapStats)
    .map(m => ({
      ...m,
      winRate: m.games  > 0 ? Math.round((m.wins  / m.games)  * 100) : 0,
      kd:      m.deaths > 0 ? parseFloat((m.kills / m.deaths).toFixed(2)) : m.kills,
    }))
    .sort((a, b) => b.games - a.games)
    .slice(0, 5);

  return {
    matchesPlayed:      valid,
    wins,
    winRate:            Math.round((wins / valid) * 100),
    kd, kda, hsPercent,
    avgScore:           Math.round(totalScore / valid),
    avgKillsPerMatch:   (totalKills   / valid).toFixed(1),
    avgDeathsPerMatch:  (totalDeaths  / valid).toFixed(1),
    avgAssistsPerMatch: (totalAssists / valid).toFixed(1),
    avgDamagePerRound:  totalRounds > 0 ? Math.round(totalDamage / totalRounds) : 0,
    topAgents, topMaps,
    roleCounts: roleCount,
    primaryRole: Object.entries(roleCount).sort(([,a],[,b]) => b - a)[0]?.[0] || null,
  };
}

/* ══════════════════════════════════════════════════════════════════════
   ★ GET /profile/:region/:name/:tag
   CONSOLIDATED endpoint — 3 Henrik calls, returns everything the
   PlayerProfilePage needs in ONE server round-trip.

   Eliminates duplicated MMR calls and parallel rate-limit spikes.
══════════════════════════════════════════════════════════════════════ */
router.get('/profile/:region/:name/:tag', async (req, res) => {
  const { region, name, tag } = req.params;
  const enc = encodeURIComponent;

  console.log(`🔎 [profile] ${name}#${tag} (${region})`);

  try {
    /* ── 3 parallel calls — account + mmr-v3 + matches-v4 ── */
    const [acctRes, mmrRes, matchRes] = await Promise.all([
      hGet(`/valorant/v1/account/${enc(name)}/${enc(tag)}`),
      hGet(`/valorant/v3/mmr/${region}/${PLATFORM}/${enc(name)}/${enc(tag)}`),
      hGet(`/valorant/v4/matches/${region}/${PLATFORM}/${enc(name)}/${enc(tag)}?mode=competitive&size=15`),
    ]);

    const [acctRaw, mmrRaw, matchRaw] = await Promise.all([
      safeJson(acctRes),
      safeJson(mmrRes),
      safeJson(matchRes),
    ]);

    /* ── Account data ── */
    const playerData = acctRaw?.data || null;
    if (!playerData) throw new Error('Jugador no encontrado (account API falló)');

    /* ── MMR v3 ── */
    const mmrD = mmrRaw?.data;
    const tierId     = mmrD?.current?.tier?.id || 0;
    const currentTier = mmrD?.current?.tier?.name || 'Unranked';
    const mmrInfo = {
      currentTier,
      currentTierId: tierId,
      currentRR:   mmrD?.current?.rr         ?? 0,
      elo:         mmrD?.current?.elo        ?? 0,
      lastChange:  mmrD?.current?.last_change ?? 0,
      leaderboardPos: mmrD?.current?.leaderboard_placement || null,
      shields:     mmrD?.current?.rank_protection_shields ?? 0,
      peakTier:    mmrD?.peak?.tier?.name  || null,
      peakTierId:  mmrD?.peak?.tier?.id    || 0,
      peakRR:      mmrD?.peak?.rr          ?? 0,
      peakSeason:  mmrD?.peak?.season?.short || null,
      /* Derive rank image from tier ID */
      rankImageUrl: rankImg(currentTier),
      seasonal: toArray(mmrD?.seasonal)
        .filter(s => s.games > 0)
        .slice(-6)
        .reverse()
        .map(s => ({
          season:  s.season?.short || '??',
          wins:    s.wins,
          games:   s.games,
          winRate: s.games > 0 ? Math.round((s.wins / s.games) * 100) : 0,
          endTier: s.end_tier?.name || 'Unranked',
          endRR:   s.end_rr ?? 0,
        })),
    };

    /* ── Match data ── */
    const rawMatches = toArray(matchRaw?.data);
    const matches    = processMatches(rawMatches, name, tag);
    const stats      = aggregateStats(rawMatches, name, tag);

    /* ── MMR progression for chart (use match start dates + computed elo per match)
       v3/mmr doesn't return history. Use stored-mmr if available, else skip chart. ── */
    let mmrHistory = [];
    try {
      const storedRes = await hGet(
        `/valorant/v2/stored-mmr-history/${region}/${PLATFORM}/${enc(name)}/${enc(tag)}`
      );
      const storedRaw = await safeJson(storedRes);
      const stored = toArray(storedRaw?.data);
      mmrHistory = [...stored].reverse().slice(0, 30).map(e => ({
        elo:    e.elo ?? e.ranking_in_tier ?? 0,
        rank:   e.tier?.name || e.currenttierpatched || 'Unranked',
        change: e.last_change ?? e.mmr_change_to_last_game ?? 0,
      }));
    } catch {
      /* stored MMR optional — not fatal */
    }

    console.log(`✅ [profile] ${name}#${tag}: ${currentTier} | ${matches.length} matches | ${stats?.matchesPlayed ?? 0} stats`);

    res.json({
      status: 'success',
      playerData,
      mmr: mmrInfo,
      matches,
      mmrHistory,
      stats,
    });
  } catch (error) {
    console.error(`❌ [profile] ${name}#${tag}:`, error.message);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

/* ══════════════════════════════════════════════════════════════════
   GET /complete/:region/:name/:tag
   Used by PlayerGrid (integrantes) — lightweight: account + mmr only
══════════════════════════════════════════════════════════════════ */
router.get('/complete/:region/:name/:tag', async (req, res) => {
  try {
    const { region, name, tag } = req.params;
    const enc = encodeURIComponent;

    console.log(`🔄 [complete] ${name}#${tag} (${region})`);

    const [acctRes, mmrRes] = await Promise.all([
      hGet(`/valorant/v1/account/${enc(name)}/${enc(tag)}`),
      hGet(`/valorant/v3/mmr/${region}/${PLATFORM}/${enc(name)}/${enc(tag)}`),
    ]);

    /* If the account lookup failed, bail out with a meaningful error */
    if (!acctRes.ok) {
      const errBody = await safeJson(acctRes);
      const errMsg  = errBody?.errors?.[0]?.message || `HTTP ${acctRes.status}`;
      console.warn(`⚠️  [complete] account ${acctRes.status} for ${name}#${tag}: ${errMsg}`);
      return res.status(acctRes.status === 429 ? 429 : 404).json({
        success: false,
        error: acctRes.status === 429
          ? 'Rate limit alcanzado — intenta en un momento'
          : `Jugador no encontrado: ${errMsg}`,
      });
    }

    const [acctData, mmrRaw] = await Promise.all([
      safeJson(acctRes),
      safeJson(mmrRes),
    ]);

    /* MMR may legitimately be absent (unranked / no data) — treat as null */
    const mmrD = mmrRes.ok ? mmrRaw?.data : null;
    const peak = mmrD ? {
      currentTier: mmrD.current?.tier?.name || 'Unranked',
      currentRR:   mmrD.current?.rr         ?? 0,
      elo:         mmrD.current?.elo        ?? 0,
      peakTier:    mmrD.peak?.tier?.name    || null,
      peakSeason:  mmrD.peak?.season?.short || null,
      shields:     mmrD.current?.rank_protection_shields ?? 0,
    } : null;

    /* Build a mmr.data[0]-compatible object for PlayerCard backward-compat */
    const mmrCompat = mmrD ? [{
      currenttierpatched: mmrD.current?.tier?.name || 'Unranked',
      elo:     mmrD.current?.elo ?? 0,
      images:  { large: rankImg(mmrD.current?.tier?.name || '') },
    }] : [];

    console.log(`✅ [complete] ${name}#${tag}`);
    res.json({
      success: true,
      player:  acctData,
      mmr:     { data: mmrCompat },
      peak,
    });
  } catch (error) {
    console.error(`❌ [complete] ${req.params.name}#${req.params.tag}:`, error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

/* ══════════════════════════════════════════════════════════════════
   GET /player/:name/:tag  (basic account)
══════════════════════════════════════════════════════════════════ */
router.get('/player/:name/:tag', async (req, res) => {
  try {
    const { name, tag } = req.params;
    const r = await hGet(`/valorant/v1/account/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    res.json(await r.json());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ══════════════════════════════════════════════════════════════════
   GET /store-products
══════════════════════════════════════════════════════════════════ */
router.get('/store-products', async (req, res) => {
  try {
    const r = await hGet(`/valorant/v2/store-featured?force=true`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    res.json(await r.json());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ══════════════════════════════════════════════════════════════════
   GET /agent-composition/:region/:name/:tag
══════════════════════════════════════════════════════════════════ */
router.get('/agent-composition/:region/:name/:tag', async (req, res) => {
  try {
    const { region, name, tag } = req.params;
    const { map } = req.query;
    const enc = encodeURIComponent;

    const r = await hGet(
      `/valorant/v4/matches/${region}/${PLATFORM}/${enc(name)}/${enc(tag)}?mode=competitive&map=${enc(map || '')}&size=1`
    );
    const data = await safeJson(r);
    const latest = toArray(data?.data)[0];

    if (!latest) return res.json({ status: 'no_data', data: [] });

    const { players: allPlayers, mapName } = normMatch(latest);
    const teamAgents = {};
    allPlayers.forEach(p => {
      const { name: n, image: img } = resolveAgent(p);
      const team = (p.team_id || p.team || '').toLowerCase();
      if (!n || !img) return;
      if (!teamAgents[team]) teamAgents[team] = [];
      if (!teamAgents[team].some(a => a.name === n)) teamAgents[team].push({ name: n, image: img });
    });

    const combined = [...(teamAgents.blue || teamAgents.Blue || [])];
    const unique = Array.from(new Set(combined.map(a => a.name))).map(n => combined.find(a => a.name === n));

    res.json({ status: 'success', data: unique, match_info: { map: mapName, started_at: latest.metadata?.started_at } });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

/* ══════════════════════════════════════════════════════════════════
   GET /leaderboard — clan leaderboard using v3 MMR
══════════════════════════════════════════════════════════════════ */
router.get('/leaderboard', async (req, res) => {
  try {
    const PLAYERS_LIST = [
      { name: "Edwin灵DVS",    tag: "COL",   region: "latam" },
      { name: "Pinunaaa",      tag: "Pau",   region: "latam" },
      { name: "MPX",     tag: "666",  region: "latam" },
      { name: "navidarx",      tag: "LAN",   region: "latam" },
      { name: "Lurasaga",      tag: "peru",  region: "latam" },
      { name: "21savage",      tag: "2908",  region: "latam" },
      { name: "COL Barrilete", tag: "COL",   region: "latam" },
      { name: "stargil",        tag: "743",  region: "latam" },
      { name: "Santi Arias",   tag: "004",   region: "latam" },
      { name: "Parca",         tag: "ARQ22", region: "latam" },
      { name: "COL EL Diablo", tag: "CLDAS", region: "latam" },
      { name: "VeIox",         tag: "Rolo",  region: "latam" },
    ];

    /* Sequential to stay within the 30 req/min rate limit */
    const results = [];
    for (const p of PLAYERS_LIST) {
      try {
        const r   = await hGet(`/valorant/v3/mmr/${p.region}/${PLATFORM}/${encodeURIComponent(p.name)}/${encodeURIComponent(p.tag)}`);
        const raw = await safeJson(r);
        const d   = r.ok ? raw?.data : null;
        if (!d) { results.push({ ...p, elo: 0, rank: 'Unranked', rankImage: '', peakTier: null, currentRR: 0 }); continue; }
        const tier = d.current?.tier?.name || 'Unranked';
        results.push({
          ...p,
          elo:        d.current?.elo ?? 0,
          rank:       tier,
          currentRR:  d.current?.rr  ?? 0,
          rankImage:  rankImg(tier),
          shields:    d.current?.rank_protection_shields ?? 0,
          peakTier:   d.peak?.tier?.name    || null,
          peakSeason: d.peak?.season?.short || null,
        });
      } catch {
        results.push({ ...p, elo: 0, rank: 'Unranked', rankImage: '', peakTier: null, currentRR: 0 });
      }
    }

    results.sort((a, b) => b.elo - a.elo);
    res.json({ status: 'success', players: results });
  } catch (error) {
    res.status(500).json({ status: 'error', players: [], message: error.message });
  }
});

module.exports = router;
