// server/routes/store.js - Versión corregida
const express = require('express');
const fetch = require('node-fetch'); // ✅ AGREGAR ESTA LÍNEA
const router = express.Router();

// Endpoint para obtener productos de la tienda
router.get('/store-products', async (req, res) => {
  try {
    console.log('🛍️ Solicitando productos de la tienda...');
    
    // Usar bundles en lugar de store-featured
    const response = await fetch('https://valorant-api.com/v1/bundles');
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const bundlesData = await response.json();
    
    // Formatear los datos para el frontend
    const formattedData = {
      data: bundlesData.data.slice(0, 6).map(bundle => ({
        uuid: bundle.uuid,
        name: bundle.displayName,
        description: bundle.description,
        image: bundle.displayIcon,
        items: bundle.items || []
      }))
    };
    
    console.log('✅ Productos de tienda obtenidos exitosamente');
    res.json(formattedData);
    
  } catch (error) {
    console.error('❌ Error obteniendo productos de tienda:', error);
    res.status(500).json({ 
      error: 'Error al obtener productos de la tienda',
      message: error.message 
    });
  }
});

module.exports = router;