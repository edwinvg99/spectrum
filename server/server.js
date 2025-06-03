// server/server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;
require('dotenv').config(); // Esto carga el archivo .env
 
// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Rutas de Valorant API
app.use('/api/valorant', require('./routes/valorant'));

// Endpoint para verificar estado del servidor
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal en el servidor!' });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
  console.log(`📡 Frontend esperado en http://localhost:5173`);
  console.log(`🏥 Health check disponible en http://localhost:${PORT}/api/health`);
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