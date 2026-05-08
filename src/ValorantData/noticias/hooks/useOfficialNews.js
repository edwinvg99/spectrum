import { useEffect, useState } from "react";
import { cacheService } from "../../../services/cacheService";
import { CACHE_CONFIG } from "../../../utils/constants";

const CACHE_KEY = "official-news";

export function useOfficialNews() {
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOfficialNews() {
      const cached = cacheService.get(CACHE_KEY);
      if (cached) {
        setNoticias(cached.data);
        setCargando(false);
        return;
      }

      try {
        const isDevelopment = window.location.hostname === 'localhost';
        const baseUrl = isDevelopment ? '/api-local' : '';
        const url = `${baseUrl}/api/valorant/official-news?locale=es-mx`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        const json = await res.json();

        if (json.status !== 200 || !json.data) {
          throw new Error('Formato de respuesta inesperado');
        }

        const noticiasFormateadas = json.data.slice(0, 10).map(noticia => ({
          title: noticia.title,
          description: noticia.description || '',
          date: noticia.date,
          url: noticia.url,
          category: noticia.category || 'General',
          banner_url: noticia.banner_url || null,
          external_link: noticia.external_link || null,
        }));

        cacheService.set(CACHE_KEY, noticiasFormateadas, CACHE_CONFIG.OFFICIAL_NEWS_TTL);
        setNoticias(noticiasFormateadas);
      } catch (err) {
        console.error("Error al obtener noticias oficiales:", err);
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }

    fetchOfficialNews();
  }, []);

  return { noticias, cargando, error };
}
