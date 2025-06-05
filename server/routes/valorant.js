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

module.exports = router;