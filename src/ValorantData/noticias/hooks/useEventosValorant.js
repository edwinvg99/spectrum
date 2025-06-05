// src/hooks/useEventosValorant.js
import { useEffect, useState } from "react";

export function useEventosValorant() {
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEventos() {
      try {
        // Usamos el mismo patrón de proxy que configuramos en vite.config.js
        // para evitar problemas de CORS.
        // La API de eventos es diferente, así que usaremos un nuevo prefijo,
        // por ejemplo, '/api-orlandomm'. Lo configuraremos en vite.config.js después.
        const res = await fetch('https://vlr.orlandomm.net/api/v1/events?status=upcoming&region=all');
        
        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status} - ${res.statusText}`);
        }
        
        const json = await res.json();
        
        // Verificamos la estructura de la respuesta según la documentación:
        // { "status": "string", "size": 0, "data": [ ... ] }
        const fetchedEventos = json.data;

        if (!Array.isArray(fetchedEventos)) {
          console.warn("⚠️ La API de eventos no devolvió un array en 'data' como se esperaba.", json);
          setEventos([]); // Aseguramos un array vacío si la estructura es inesperada
          return;
        }

        // Mapeamos los datos para estandarizar el formato, si lo deseas,
        // aunque los campos ya son bastante descriptivos.
        const eventosFormateados = fetchedEventos.map(evento => ({
          id: evento.id,
          name: evento.name,
          status: evento.status,
          prizepool: evento.prizepool,
          dates: evento.dates,
          country: evento.country,
          img: evento.img,
        }));

        setEventos(eventosFormateados);

      } catch (err) {
        console.error("❌ Error al obtener los eventos:", err);
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }

    fetchEventos();
  }, []); // Dependencias vacías para ejecutar solo una vez al montar

  return { eventos, cargando, error };
}