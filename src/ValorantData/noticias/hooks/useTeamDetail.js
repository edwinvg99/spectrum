import { useEffect, useState } from "react";
import { cacheService } from "../../../services/cacheService";
import { CACHE_CONFIG } from "../../../utils/constants";

export function useTeamDetail(teamId) {
  const [team, setTeam] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!teamId) {
      setTeam(null);
      return;
    }

    async function fetchTeam() {
      const cacheKey = `team-detail-${teamId}`;
      const cached = cacheService.get(cacheKey);
      if (cached) {
        setTeam(cached.data);
        setCargando(false);
        return;
      }

      setCargando(true);
      setError(null);

      try {
        const url = `/api-orlandomm/v1/teams/${teamId}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        const json = await res.json();

        if (!json.data) {
          throw new Error("No se encontro informacion del equipo");
        }

        cacheService.set(cacheKey, json.data, CACHE_CONFIG.TEAMS_TTL);
        setTeam(json.data);
      } catch (err) {
        console.error("Error al obtener equipo:", err);
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }

    fetchTeam();
  }, [teamId]);

  return { team, cargando, error };
}
