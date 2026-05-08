const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

const API_KEY = process.env.API_KEY

// Obtener datos básicos del jugador
router.get('/player/:name/:tag', async (req, res) => {
  try {
    const { name, tag } = req.params;

    console.log(`📡 Fetching player data for ${name}#${tag}`);

    const response = await fetch(`https://api.henrikdev.xyz/valorant/v1/account/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`, {
      method: 'GET',
      headers: {
        "Authorization": API_KEY,
        "Accept": "*/*"
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Player data fetched for ${name}#${tag}`);
    res.json(data);
  } catch (error) {
    console.error(`❌ Error fetching player data for ${req.params.name}#${req.params.tag}:`, error);
    res.status(500).json({ error: 'Error fetching player data', details: error.message });
  }
});

// Obtener datos de MMR del jugador
router.get('/mmr/:region/:name/:tag', async (req, res) => {
  try {
    const { region, name, tag } = req.params;

    console.log(`🏆 Fetching MMR data for ${name}#${tag} in ${region}`);

    const response = await fetch(`https://api.henrikdev.xyz/valorant/v1/mmr-history/${region}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`, {
      method: 'GET',
      headers: {
        "Authorization": API_KEY,
        "Accept": "*/*"
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ MMR data fetched for ${name}#${tag}`);
    res.json(data);
  } catch (error) {
    console.error(`❌ Error fetching MMR data for ${req.params.name}#${req.params.tag}:`, error);
    res.status(500).json({ error: 'Error fetching MMR data', details: error.message });
  }
});

// Endpoint combinado para obtener todos los datos
router.get('/complete/:region/:name/:tag', async (req, res) => {
  try {
    const { region, name, tag } = req.params;

    console.log(`🔄 Fetching complete data for ${name}#${tag} in ${region}`);

    const [playerResponse, mmrResponse] = await Promise.all([
      fetch(`https://api.henrikdev.xyz/valorant/v1/account/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`, {
        method: 'GET',
        headers: {
          "Authorization": API_KEY,
          "Accept": "*/*"
        },
      }),
      fetch(`https://api.henrikdev.xyz/valorant/v1/mmr-history/${region}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`, {
        method: 'GET',
        headers: {
          "Authorization": API_KEY,
          "Accept": "*/*"
        },
      })
    ]);

    if (!playerResponse.ok || !mmrResponse.ok) {
      throw new Error(`HTTP error! Player: ${playerResponse.status}, MMR: ${mmrResponse.status}`);
    }

    const [playerData, mmrData] = await Promise.all([
      playerResponse.json(),
      mmrResponse.json()
    ]);

    console.log(`✅ Complete data fetched for ${name}#${tag}`);

    res.json({
      success: true,
      player: playerData,
      mmr: mmrData
    });
  } catch (error) {
    console.error(`❌ Error fetching complete data for ${req.params.name}#${req.params.tag}:`, error);
    res.status(500).json({
      success: false,
      error: 'Error fetching complete player data',
      details: error.message
    });
  }
});

// Nueva ruta para obtener los productos de la tienda de Valorant
router.get('/store-products', async (req, res) => {
  try {
    console.log(`🛒 Fetching Valorant store products`);

    const response = await fetch(`https://api.henrikdev.xyz/valorant/v2/store-featured?force=true`, {
      method: 'GET',
      headers: {
        "Authorization": API_KEY,
        "Accept": "*/*"
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Valorant store products fetched`);
    res.json(data);
  } catch (error) {
    console.error(`❌ Error fetching Valorant store products:`, error);
    res.status(500).json({ error: 'Error fetching Valorant store products', details: error.message });
  }
});

// tienda.Valorant.jsx - Cambiar la URL
const fetchStoreProducts = async () => {
  try {
    // ✅ Cambiar de /api-local/store-products a /api-local/api/valorant/store-products
    const response = await fetch('/api-local/api/valorant/store-products');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('📦 Datos de tienda recibidos:', data);
    
    // La API de henrikdev.xyz devuelve una estructura diferente
    if (data && data.data && data.data.FeaturedBundle) {
      const bundle = data.data.FeaturedBundle.Bundle;
      setProducts([{
        uuid: bundle.ID,
        name: bundle.DataAssetID,
        description: 'Bundle destacado de la tienda',
        image: bundle.DisplayIcon,
        items: bundle.Items || []
      }]);
    } else {
      setProducts([]);
    }
    
  } catch (err) {
    console.error("❌ Error fetching store products:", err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

// server/routes/valorant.js - Agregar esta ruta si no existe
router.get('/agent-composition/:region/:name/:tag', async (req, res) => {
  try {
    const { region, name, tag } = req.params;
    const { map } = req.query;
    
    console.log(`🎯 Obteniendo composición de agentes para ${name}#${tag} en ${map}`);
    
    if (!API_KEY) {
      return res.status(500).json({ 
        status: 'error',
        error: 'API Key no configurada' 
      });
    }
    
    const url = `https://api.henrikdev.xyz/valorant/v3/matches/${region}/${name}/${tag}?mode=competitive&map=${encodeURIComponent(map)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': API_KEY,
        'User-Agent': 'Valorant-Stats-App/1.0'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`API Error: ${response.status} - ${errorData.errors ? errorData.errors[0].message : 'Error desconocido'}`);
    }
    
    const data = await response.json();
    
    // Procesar datos de composición
    if (data.status === 200 && data.data && data.data.length > 0) {
      const latestMatch = data.data[0];
      const teamAgents = {};
      
      latestMatch.players.all_players.forEach(player => {
        const agentName = player.character;
        const agentSmallImage = player.assets.agent.small;
        const team = player.team;
        
        if (agentName && agentSmallImage) {
          if (!teamAgents[team]) {
            teamAgents[team] = [];
          }
          if (!teamAgents[team].some(a => a.name === agentName)) {
            teamAgents[team].push({
              name: agentName,
              image: agentSmallImage
            });
          }
        }
      });
      
      const combinedComposition = [
        ...(teamAgents.Blue || []),
      ];
      
      const uniqueAgents = Array.from(new Set(combinedComposition.map(agent => agent.name)))
        .map(name => combinedComposition.find(agent => agent.name === name));
      
      res.json({
        status: 'success',
        data: uniqueAgents,
        match_info: {
          map: latestMatch.metadata.map,
          mode: latestMatch.metadata.mode,
          started_at: latestMatch.metadata.started_at
        }
      });
    } else {
      res.json({
        status: 'no_data',
        data: [],
        message: 'No se encontraron partidas para este mapa'
      });
    }
    
  } catch (error) {
    console.error('❌ Error obteniendo composición de agentes:', error);
    res.status(500).json({ 
      status: 'error',
      error: 'Error al obtener composición de agentes',
      message: error.message 
    });
  }
});

// ── Agent-role lookup (Valorant as of 2024) ──────────────────────────────────
const AGENT_ROLES = {
  // Duelists
  Jett:'Duelista', Reyna:'Duelista', Raze:'Duelista', Phoenix:'Duelista',
  Yoru:'Duelista', Neon:'Duelista', Iso:'Duelista',
  // Initiators
  Sova:'Iniciador', Breach:'Iniciador', Skye:'Iniciador', Kay:'Iniciador',
  'KAY/O':'Iniciador', Fade:'Iniciador', Gekko:'Iniciador', Tejo:'Iniciador',
  // Controllers
  Brimstone:'Controlador', Viper:'Controlador', Omen:'Controlador',
  Astra:'Controlador', Harbor:'Controlador', Clove:'Controlador',
  // Sentinels
  Killjoy:'Centinela', Cypher:'Centinela', Sage:'Centinela',
  Chamber:'Centinela', Deadlock:'Centinela', Vyse:'Centinela',
};
const agentRole = (name) => {
  if (!name) return 'Duelista';
  // KAY/O appears as KAY/O or KAYO in API
  if (name.toUpperCase().startsWith('KAY')) return 'Iniciador';
  return AGENT_ROLES[name] || 'Duelista';
};

// ── GET /match-history/:region/:name/:tag  ───────────────────────────────────
router.get('/match-history/:region/:name/:tag', async (req, res) => {
  try {
    const { region, name, tag } = req.params;
    const size = Math.min(parseInt(req.query.size) || 15, 20);

    console.log(`📋 Fetching match history for ${name}#${tag} in ${region}`);

    const [matchesRes, mmrRes] = await Promise.all([
      fetch(
        `https://api.henrikdev.xyz/valorant/v3/matches/${region}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}?mode=competitive&size=${size}`,
        { headers: { Authorization: API_KEY, Accept: '*/*' } }
      ),
      fetch(
        `https://api.henrikdev.xyz/valorant/v1/mmr-history/${region}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`,
        { headers: { Authorization: API_KEY, Accept: '*/*' } }
      ),
    ]);

    const [matchesData, mmrData] = await Promise.all([
      matchesRes.json().catch(() => ({ data: [] })),
      mmrRes.json().catch(() => ({ data: [] })),
    ]);

    const rawMatches = matchesData?.data || [];
    const rawMmr    = mmrData?.data || [];

    // Format match list
    const matches = rawMatches.map((m) => {
      const allPlayers = m.players?.all_players || [];
      const me = allPlayers.find(
        (p) => p.name?.toLowerCase() === name.toLowerCase() &&
               p.tag?.toLowerCase()  === tag.toLowerCase()
      ) || allPlayers[0];

      if (!me) return null;

      const myTeam   = me.team?.toLowerCase();            // 'blue' | 'red'
      const blueWon  = m.teams?.blue?.won;
      const myWin    = myTeam === 'blue' ? blueWon : !blueWon;
      const blueR    = m.teams?.blue?.rounds_won  ?? 0;
      const redR     = m.teams?.red?.rounds_won   ?? 0;
      const score    = myTeam === 'blue' ? `${blueR}-${redR}` : `${redR}-${blueR}`;
      const kills    = me.stats?.kills   ?? 0;
      const deaths   = me.stats?.deaths  ?? 1;
      const assists  = me.stats?.assists ?? 0;
      const kd       = deaths > 0 ? (kills / deaths).toFixed(2) : kills.toFixed(2);
      const agent    = me.character || 'Unknown';

      return {
        matchId:         m.metadata?.matchid,
        map:             m.metadata?.map || 'Unknown',
        agent,
        agentImage:      me.assets?.agent?.small || '',
        role:            agentRole(agent),
        result:          myWin ? 'win' : 'loss',
        score,
        kills,
        deaths,
        assists,
        headshots:       me.stats?.headshots  ?? 0,
        bodyshots:       me.stats?.bodyshots  ?? 0,
        legshots:        me.stats?.legshots   ?? 0,
        avgCombatScore:  me.average_combat_score ?? 0,
        kdRatio:         kd,
        startedAt:       m.metadata?.game_start_patched || '',
      };
    }).filter(Boolean);

    // Format ELO progression from mmr-history (already ordered newest-first → reverse for chart)
    const mmrHistory = [...rawMmr].reverse().map((e) => ({
      elo:    e.elo          ?? 0,
      rank:   e.currenttierpatched || 'Unranked',
      change: e.mmr_change_to_last_game ?? 0,
    }));

    console.log(`✅ Match history fetched: ${matches.length} matches`);
    res.json({ status: 'success', matches, mmrHistory });
  } catch (error) {
    console.error('❌ Error fetching match history:', error);
    res.status(500).json({ status: 'error', matches: [], mmrHistory: [], message: error.message });
  }
});

// ── GET /player-stats/:region/:name/:tag  ────────────────────────────────────
router.get('/player-stats/:region/:name/:tag', async (req, res) => {
  try {
    const { region, name, tag } = req.params;
    const size = 15; // analyse last 15 competitive matches

    console.log(`📊 Computing player stats for ${name}#${tag}`);

    const response = await fetch(
      `https://api.henrikdev.xyz/valorant/v3/matches/${region}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}?mode=competitive&size=${size}`,
      { headers: { Authorization: API_KEY, Accept: '*/*' } }
    );

    const data = await response.json().catch(() => ({ data: [] }));
    const rawMatches = data?.data || [];

    if (!rawMatches.length) {
      return res.json({ status: 'no_data', stats: null });
    }

    // Aggregate stats across matches
    let totalKills = 0, totalDeaths = 0, totalAssists = 0;
    let totalHeadshots = 0, totalBodyshots = 0, totalLegshots = 0;
    let totalScore = 0, wins = 0;
    const agentMap  = {};
    const roleCount = {};
    let validMatches = 0;

    rawMatches.forEach((m) => {
      const allPlayers = m.players?.all_players || [];
      const me = allPlayers.find(
        (p) => p.name?.toLowerCase() === name.toLowerCase() &&
               p.tag?.toLowerCase()  === tag.toLowerCase()
      );
      if (!me) return;

      validMatches++;
      const myTeam  = me.team?.toLowerCase();
      const blueWon = m.teams?.blue?.won;
      if (myTeam === 'blue' ? blueWon : !blueWon) wins++;

      const k = me.stats?.kills   ?? 0;
      const d = me.stats?.deaths  ?? 0;
      const a = me.stats?.assists ?? 0;
      totalKills    += k;
      totalDeaths   += d;
      totalAssists  += a;
      totalHeadshots += me.stats?.headshots ?? 0;
      totalBodyshots += me.stats?.bodyshots ?? 0;
      totalLegshots  += me.stats?.legshots  ?? 0;
      totalScore    += me.average_combat_score ?? 0;

      const agent = me.character || 'Unknown';
      const role  = agentRole(agent);
      if (!agentMap[agent]) agentMap[agent] = { name: agent, role, games: 0, kills: 0, deaths: 0, assists: 0, image: me.assets?.agent?.small || '' };
      agentMap[agent].games++;
      agentMap[agent].kills   += k;
      agentMap[agent].deaths  += d;
      agentMap[agent].assists += a;
      roleCount[role] = (roleCount[role] || 0) + 1;
    });

    if (!validMatches) return res.json({ status: 'no_data', stats: null });

    const totalShots = totalHeadshots + totalBodyshots + totalLegshots;
    const hsPercent  = totalShots > 0 ? Math.round((totalHeadshots / totalShots) * 100) : 0;
    const kd  = totalDeaths > 0 ? parseFloat((totalKills / totalDeaths).toFixed(2)) : totalKills;
    const kda = totalDeaths > 0 ? parseFloat(((totalKills + totalAssists / 3) / totalDeaths).toFixed(2)) : totalKills;

    const topAgents = Object.values(agentMap)
      .map(a => ({
        ...a,
        kda: a.deaths > 0 ? parseFloat(((a.kills + a.assists / 3) / a.deaths).toFixed(2)) : a.kills,
      }))
      .sort((a, b) => b.games - a.games)
      .slice(0, 5);

    const primaryRole = Object.entries(roleCount).sort(([,a],[,b]) => b - a)[0]?.[0] || null;

    const stats = {
      matchesPlayed:        validMatches,
      wins,
      winRate:              Math.round((wins / validMatches) * 100),
      kd,
      kda,
      hsPercent,
      avgScore:             Math.round(totalScore / validMatches),
      avgKillsPerMatch:     (totalKills   / validMatches).toFixed(1),
      avgDeathsPerMatch:    (totalDeaths  / validMatches).toFixed(1),
      avgAssistsPerMatch:   (totalAssists / validMatches).toFixed(1),
      topAgents,
      roleCounts: roleCount,
      primaryRole,
    };

    console.log(`✅ Player stats computed for ${name}#${tag}`);
    res.json({ status: 'success', stats });
  } catch (error) {
    console.error('❌ Error computing player stats:', error);
    res.status(500).json({ status: 'error', stats: null, message: error.message });
  }
});

// ── GET /leaderboard  ────────────────────────────────────────────────────────
router.get('/leaderboard', async (req, res) => {
  try {
    const PLAYERS_LIST = [
      { name: "Edwin灵DVS", tag: "COL", region: "latam" },
      { name: "Pinunaaa",   tag: "Pau",   region: "latam" },
      { name: "ShereKhan",  tag: "neko",  region: "latam" },
      { name: "navidarx",   tag: "LAN",   region: "latam" },
      { name: "Lurasaga",   tag: "peru",  region: "latam" },
      { name: "21savage",   tag: "2908",  region: "latam" },
      { name: "COL Barrilete", tag: "COL", region: "latam" },
      { name: "Karito",     tag: "1610",  region: "latam" },
      { name: "Santi Arias",tag: "004",   region: "latam" },
      { name: "Parca",      tag: "ARQ22", region: "latam" },
      { name: "COL EL Diablo", tag: "CLDAS", region: "latam" },
      { name: "VeIox",      tag: "Rolo",  region: "latam" },
    ];

    const results = await Promise.all(PLAYERS_LIST.map(async (p) => {
      try {
        const r = await fetch(
          `https://api.henrikdev.xyz/valorant/v1/mmr-history/${p.region}/${encodeURIComponent(p.name)}/${encodeURIComponent(p.tag)}`,
          { headers: { Authorization: API_KEY, Accept: '*/*' } }
        );
        const d = await r.json();
        const latest = d?.data?.[0];
        return { ...p, elo: latest?.elo ?? 0, rank: latest?.currenttierpatched ?? 'Unranked', rankImage: latest?.images?.large ?? '' };
      } catch { return { ...p, elo: 0, rank: 'Unranked', rankImage: '' }; }
    }));

    results.sort((a, b) => b.elo - a.elo);
    res.json({ status: 'success', players: results });
  } catch (error) {
    res.status(500).json({ status: 'error', players: [], message: error.message });
  }
});

module.exports = router;