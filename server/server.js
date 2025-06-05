// server/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Railway proporciona PORT automáticamente, usar eso o 3001 por defecto
const PORT = process.env.PORT || 3001;

require('dotenv').config();

console.log('🚀 Iniciando servidor...');
console.log('📍 Puerto:', PORT);
console.log('🌍 Entorno:', process.env.NODE_ENV || 'development');

// Middleware CORS - Importante para Railway
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3001', 
    'https://spectrum.up.railway.app',
    /https:\/\/.*\.railway\.app$/ // Permitir todos los subdominios de Railway
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos en producción
if (process.env.NODE_ENV === 'production') {
  console.log('📁 Sirviendo archivos estáticos desde:', path.join(__dirname, '../dist'));
  app.use(express.static(path.join(__dirname, '../dist')));
}

// Health check endpoint - DEBE estar antes de las otras rutas
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

// Rutas de API
app.use('/api/valorant', require('./routes/valorant'));
app.use('/api-orlandomm', require('./routes/orlandomm'));

// En producción, servir React para todas las rutas que no sean API
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    console.log('🎯 Ruta capturada:', req.path);
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