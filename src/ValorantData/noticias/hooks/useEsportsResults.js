import { useEffect, useState } from "react";
import { cacheService } from "../../../services/cacheService";
import { CACHE_CONFIG } from "../../../utils/constants";

const CACHE_KEY = "esports-results";

export function useEsportsResults() {
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchResults() {
      const cached = cacheService.get(CACHE_KEY);
      if (cached) {
        setResultados(cached.data);
        setCargando(false);
        return;
      }

      try {
        const isDev = import.meta.env.DEV;
        const url = isDev
          ? "/api-orlandomm/v1/results"
          : "/api-orlandomm/v1/results";

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        const json = await res.json();

        if (!json.data || !Array.isArray(json.data)) {
          setResultados([]);
          return;
        }

        // Take first 20 results for display
        const formateados = json.data.slice(0, 20).map((match) => ({
          id: match.id,
          teams: match.teams.map((team) => ({
            name: team.name,
            score: team.score,
            country: team.country,
            won: team.won,
          })),
          status: match.status,
          ago: match.ago,
          event: match.event,
          tournament: match.tournament,
          img: match.img || null,
        }));

        cacheService.set(CACHE_KEY, formateados, CACHE_CONFIG.RESULTS_TTL);
        setResultados(formateados);
      } catch (err) {
        console.error("Error al obtener resultados esports:", err);
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }

    fetchResults();
  }, []);

  return { resultados, cargando, error };
}
