# Dockerfile
FROM node:20-alpine

# Instalar dependencias del sistema para compilación nativa
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Limpiar e instalar dependencias
RUN rm -rf node_modules package-lock.json || true
RUN npm install --no-optional
RUN npm install @rollup/rollup-linux-x64-gnu

# Copiar código fuente
COPY . .

# Build del frontend
RUN npm run build:only

# Copiar build al servidor
RUN cp -r dist server/

# Cambiar al directorio del servidor
WORKDIR /app/server

# Exponer puerto
EXPOSE 3001

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3001

# Iniciar servidor
CMD ["node", "server.js"]