// server/server.js - Versión corregida
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3001;

require('dotenv').config();

console.log('🚀 Iniciando servidor...');
console.log('📍 Puerto:', PORT);
console.log('🌍 Entorno:', process.env.NODE_ENV || 'development');

// Middleware CORS
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3001', 
    'https://spectrum.up.railway.app',
    /https:\/\/.*\.railway\.app$/
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ 1. PRIMERO: Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('🏥 Health check solicitado');
  res.status(200).json({ 
    status: 'OK', 
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    hasApiKey: !!process.env.API_KEY
  });
});

// ✅ 2. SEGUNDO: Todas las rutas de API (ANTES del fallback de React)
app.use('/api/valorant', require('./routes/valorant'));
app.use('/api-orlandomm', require('./routes/orlandomm'));
app.use('/api-valorant', require('./routes/valorantNews'));
app.use('/api', require('./routes/store'));

// ✅ 3. DESPUÉS: Servir archivos estáticos en producción
if (process.env.NODE_ENV === 'production') {
  console.log('📁 Sirviendo archivos estáticos desde:', path.join(__dirname, '../dist'));
  app.use(express.static(path.join(__dirname, '../dist')));
  console.log('📁 Sirviendo archivos públicos desde:', path.join(__dirname, '../public'));
  app.use(express.static(path.join(__dirname, '../public')));
}

// ✅ 4. ÚLTIMO: Fallback de React (solo para rutas que NO son API)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    // ✅ IMPORTANTE: Verificar que NO sea una ruta de API
    if (req.path.startsWith('/api')) {
      console.log('❌ Ruta de API no encontrada:', req.path);
      return res.status(404).json({ 
        error: 'API endpoint no encontrado',
        path: req.path,
        timestamp: new Date().toISOString()
      });
    }
    
    console.log('🎯 Sirviendo React para ruta:', req.path);
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('💥 Error del servidor:', err.stack);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// 404 para rutas no encontradas
app.use('*', (req, res) => {
  console.log('❌ Ruta no encontrada:', req.originalUrl);
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 API Key configurada: ${process.env.API_KEY ? 'Sí' : 'No'}`);
  
  if (process.env.NODE_ENV === 'production') {
    console.log(`🔗 Aplicación disponible en: https://spectrum.up.railway.app`);
    console.log(`💚 Health check: https://spectrum.up.railway.app/api/health`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM recibido, cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT recibido, cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});