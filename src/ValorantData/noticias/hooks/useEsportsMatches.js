import { useEffect, useState } from "react";
import { cacheService } from "../../../services/cacheService";
import { CACHE_CONFIG } from "../../../utils/constants";

const CACHE_KEY = "esports-matches";

export function useEsportsMatches() {
  const [partidas, setPartidas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMatches() {
      const cached = cacheService.get(CACHE_KEY);
      if (cached) {
        setPartidas(cached.data);
        setCargando(false);
        return;
      }

      try {
        const isDev = import.meta.env.DEV;
        const url = isDev
          ? "/api-orlandomm/v1/matches"
          : "/api-orlandomm/v1/matches";

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        const json = await res.json();

        if (!json.data || !Array.isArray(json.data)) {
          setPartidas([]);
          return;
        }

        // Take first 15 upcoming matches
        const formateados = json.data.slice(0, 15).map((match) => ({
          id: match.id,
          teams: match.teams.map((team) => ({
            name: team.name,
            country: team.country,
            score: team.score,
          })),
          status: match.status,
          in: match.in || null,
          event: match.event,
          tournament: match.tournament,
          img: match.img || null,
          timestamp: match.timestamp || null,
          utc: match.utc || null,
        }));

        cacheService.set(CACHE_KEY, formateados, CACHE_CONFIG.RESULTS_TTL);
        setPartidas(formateados);
      } catch (err) {
        console.error("Error al obtener partidas esports:", err);
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }

    fetchMatches();
  }, []);

  return { partidas, cargando, error };
}
