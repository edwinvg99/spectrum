// server/verify-setup.js
const fs = require('fs');
const path = require('path');

console.log('🔍 === VERIFICACIÓN DE SETUP ===');
console.log('📁 Directorio actual:', process.cwd());
console.log('📂 Archivos en directorio:', fs.readdirSync('.'));

// Verificar dist
if (fs.existsSync('./dist')) {
  console.log('✅ dist/ existe');
  console.log('📁 Contenido de dist/', fs.readdirSync('./dist'));
} else {
  console.log('❌ dist/ NO existe');
}

// Verificar rutas
if (fs.existsSync('./routes')) {
  console.log('✅ routes/ existe');
  console.log('📁 Contenido de routes/', fs.readdirSync('./routes'));
} else {
  console.log('❌ routes/ NO existe');
}

// Verificar variables de entorno
console.log('🌍 Variables de entorno:');
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('  PORT:', process.env.PORT);
console.log('  API_KEY:', process.env.API_KEY ? 'PRESENTE' : 'AUSENTE');

console.log('🔍 === FIN VERIFICACIÓN ===');