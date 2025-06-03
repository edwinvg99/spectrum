// server/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

require('dotenv').config();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000',
    'https://spectrum.up.railway.app' // Agregar tu dominio de Railway
  ],
  credentials: true
}));
app.use(express.json());

// Servir archivos estáticos del frontend en producción
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
}

// Rutas de API
app.use('/api/valorant', require('./routes/valorant'));

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// En producción, servir el frontend para todas las rutas no-API
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal en el servidor!' });
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`🔗 Aplicación disponible en: https://spectrum.up.railway.app`);
  }
});

const router = express.Router();
const API_KEY = process.env.API_KEY;


// Obtener datos básicos del jugador
router.get('/player/:name/:tag', async (req, res) => {
  try {
    const { name, tag } = req.params;
    
    const response = await fetch(`https://api.henrikdev.xyz/valorant/v1/account/${name}/${tag}`, {
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
    res.json(data);
  } catch (error) {
    console.error('Error fetching player data:', error);
    res.status(500).json({ error: 'Error fetching player data', details: error.message });
  }
});

// Obtener datos de MMR del jugador
router.get('/mmr/:region/:name/:tag', async (req, res) => {
  try {
    const { region, name, tag } = req.params;
    
    const response = await fetch(`https://api.henrikdev.xyz/valorant/v1/mmr-history/${region}/${name}/${tag}`, {
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
    res.json(data);
  } catch (error) {
    console.error('Error fetching MMR data:', error);
    res.status(500).json({ error: 'Error fetching MMR data', details: error.message });
  }
});

// Endpoint combinado para obtener todos los datos
router.get('/complete/:region/:name/:tag', async (req, res) => {
  try {
    const { region, name, tag } = req.params;
    
    const [playerResponse, mmrResponse] = await Promise.all([
      fetch(`https://api.henrikdev.xyz/valorant/v1/account/${name}/${tag}`, {
        method: 'GET',
        headers: {
          "Authorization": API_KEY,
          "Accept": "*/*"
        },
      }),
      fetch(`https://api.henrikdev.xyz/valorant/v1/mmr-history/${region}/${name}/${tag}`, {
        method: 'GET',
        headers: {
          "Authorization": API_KEY,
          "Accept": "*/*"
        },
      })
    ]);

    const [playerData, mmrData] = await Promise.all([
      playerResponse.json(),
      mmrResponse.json()
    ]);

    res.json({
      success: true,
      player: playerData,
      mmr: mmrData
    });
  } catch (error) {
    console.error('Error fetching complete player data:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error fetching complete player data', 
      details: error.message 
    });
  }
});

module.exports = router;