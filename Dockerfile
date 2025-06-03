# Dockerfile
FROM node:20

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

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