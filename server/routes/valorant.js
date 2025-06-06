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

// server/routes/valorant.js - Agregar esta nueva ruta
router.get('/agent-composition/:region/:name/:tag', async (req, res) => {
  try {
    const { region, name, tag } = req.params;
    const { map } = req.query;
    
    console.log(`🎯 Obteniendo composición de agentes para ${name}#${tag} en ${map}`);
    
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

module.exports = router;