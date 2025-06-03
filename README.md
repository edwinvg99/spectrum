# SPECTRUM - Valorant Stats App 🎮

Una aplicación web moderna para visualizar estadísticas de jugadores de Valorant y explorar información sobre agentes del juego.

## 🌟 Características

- **📊 Estadísticas en tiempo real**: Visualiza datos actualizados de jugadores de Valorant
- **🎯 Información de agentes**: Explora todos los agentes disponibles con sus habilidades
- **⚡ Sistema de caché inteligente**: Optimización automática de rendimiento
- **📱 Diseño responsivo**: Experiencia perfecta en todos los dispositivos
- **🔄 Actualizaciones automáticas**: Datos siempre frescos con actualización en segundo plano

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19** - Framework de interfaz de usuario
- **Vite** - Herramienta de construcción ultrarrápida
- **Tailwind CSS 4** - Framework de estilos utilitarios
- **React Router DOM** - Navegación SPA
- **Axios** - Cliente HTTP para APIs

### Backend
- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web minimalista
- **CORS** - Intercambio de recursos entre orígenes
- **node-fetch** - Cliente HTTP para Node.js
- **dotenv** - Gestión de variables de entorno

### APIs Externas
- **Henrik Dev API** - Estadísticas de jugadores de Valorant
- **Valorant API** - Información de agentes y contenido del juego

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone https://github.com/edwinvg99/spectrum.git
cd valorant-stats-app
```

### 2. Instalar dependencias del frontend
```bash
npm install
```

### 3. Instalar dependencias del backend
```bash
cd server
npm install
```

### 4. Configurar variables de entorno
Crea un archivo `.env` en la carpeta `server` basado en `.env.example`:

```env
API_KEY=tu_api_key_de_henrik_dev
PORT=3001
```

**Nota**: Obtén tu API key gratuita en [Henrik Dev API](https://henrikdev.xyz/api)

### 5. Ejecutar la aplicación

#### Modo desarrollo (ejecutar ambos servidores)

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

La aplicación estará disponible en:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

## 📁 Estructura del Proyecto

```
valorant-stats-app/
├── 📂 public/                    # Archivos estáticos
│   ├── 📂 image/                 # Imágenes (logos, etc.)
│   └── 📂 videos/                # Videos de fondo
├── 📂 src/                       # Código fuente del frontend
│   ├── 📂 api/                   # Configuración de APIs
│   ├── 📂 integrantes/           # Módulo de estadísticas de jugadores
│   │   ├── 📂 components/        # Componentes React
│   │   ├── 📂 hooks/             # Custom hooks
│   │   └── 📂 styles/            # Estilos específicos
│   ├── 📂 layout/                # Componentes de layout
│   │   ├── HomePage.jsx          # Página principal
│   │   └── navbar.jsx            # Barra de navegación
│   ├── 📂 ValorantData/          # Módulo de datos de Valorant
│   │   └── 📂 agentes/           # Información de agentes
│   ├── App.jsx                   # Componente principal
│   └── main.jsx                  # Punto de entrada
├── 📂 server/                    # Código fuente del backend
│   ├── 📂 routes/                # Rutas de la API
│   ├── 📂 services/              # Servicios y lógica de negocio
│   │   ├── cacheService.js       # Sistema de caché
│   │   └── valorantApi.jsx       # Cliente de APIs externas
│   ├── 📂 utils/                 # Utilidades y constantes
│   └── server.js                 # Servidor Express
├── package.json                  # Dependencias del frontend
├── vite.config.js               # Configuración de Vite
├── tailwind.config.js           # Configuración de Tailwind
└── README.md                    # Este archivo
```

## 🎯 Funcionalidades Principales

### 📊 Dashboard de Jugadores
- Visualización de estadísticas de jugadores configurados en `constants.js`
- Información de rango, nivel y región
- Sistema de caché inteligente para optimizar rendimiento
- Actualizaciones automáticas en segundo plano

### 🎮 Catálogo de Agentes
- Lista completa de agentes de Valorant
- Diseño visual atractivo con gradientes dinámicos
- Datos en español (es-MX)

### ⚡ Sistema de Caché
- **TTL**: 5 minutos para datos frescos
- **Actualización en segundo plano**: Los datos se actualizan automáticamente
- **Persistencia local**: Utiliza localStorage para mantener datos entre sesiones
- **Indicadores visuales**: Estado del caché y tiempo de próxima actualización

## 🔧 Scripts Disponibles

### Frontend
```bash
npm run dev        # Servidor de desarrollo
npm run build      # Construcción para producción
npm run preview    # Vista previa de la construcción
npm run lint       # Análisis de código con ESLint
```

### Backend
```bash
npm start          # Producción
npm run dev        # Desarrollo con nodemon
```

## ⚙️ Personalización

### Agregar Nuevos Jugadores
Edita el array `PLAYERS` en el archivo de constantes:

```javascript
export const PLAYERS = [
  {
    name: "NombreJugador",
    tag: "TAG",
    region: "latam", // latam, na, eu, ap, br, kr
  },
  // ... más jugadores
];
```

### Configurar Temas y Colores
Modifica `tailwind.config.js` para personalizar la paleta de colores:

```javascript
colors: {
  "valorant-red": "#ff4655",
  "valorant-blue": "#00b4e0",
  // Agrega tus colores personalizados
},
```

## 🌐 APIs Utilizadas

| API | Propósito | Documentación |
|-----|-----------|---------------|
| Henrik Dev API | Estadísticas de jugadores | Datos de cuenta y MMR |
| Valorant API | Información del juego | Agentes, habilidades, mapas |

## 🚀 Despliegue

### Frontend (Vercel/Netlify)
```bash
npm run build
# Sube la carpeta 'dist' a tu plataforma de hosting
```

### Backend (Railway/Heroku/VPS)
```bash
cd server
npm start
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request


## 📞 Contacto

**Desarrollador**: Edwin Velasquez
**Email**: velasquezgiraldoedwin@gmail.com
---

⭐ ¡No olvides dar una estrella al proyecto si te fue útil!
