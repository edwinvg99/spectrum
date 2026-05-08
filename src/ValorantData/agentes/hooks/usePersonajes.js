import { useEffect, useState } from "react";
import { cacheService } from "../../../services/cacheService";
import { CACHE_CONFIG } from "../../../utils/constants";

const CACHE_KEY = "agents_es_MX";

export function usePersonajes() {
  const [personajes, setPersonajes] = useState([]);
  const [cargando, setCargando]     = useState(true);
  const [error, setError]           = useState(null);
  const [fromCache, setFromCache]   = useState(false);

  useEffect(() => {
    async function fetchPersonajes() {
      // ── 1. Try localStorage cache (1 hr TTL — agents only change on patches) ──
      const cached = cacheService.get(CACHE_KEY);
      if (cached) {
        console.log(`⚡ Agentes desde caché (${Math.round(cached.age / 1000)}s)`);
        setPersonajes(cached.data);
        setFromCache(true);
        setCargando(false);
        return;
      }

      // ── 2. Fetch from valorant-api.com (free, no key, CDN-backed) ──────────
      try {
        const res = await fetch(
          "https://valorant-api.com/v1/agents?isPlayableCharacter=true&language=es-MX"
        );
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        const json = await res.json();

        const formateados = json.data.map((p) => ({
          uuid:           p.uuid,
          nombre:         p.displayName,
          descripcion:    p.description,
          imagen:         p.fullPortrait    || p.displayIcon,
          imagenV2:       p.fullPortraitV2  || p.fullPortrait || p.displayIcon,
          icono:          p.displayIcon,
          fondo:          p.background,
          gradientColors: p.backgroundGradientColors,
          rol:            p.role?.displayName  || "Desconocido",
          iconoRol:       p.role?.displayIcon  || "",
          rolDescripcion: p.role?.description  || "",
          habilidades: p.abilities.map((hab) => ({
            nombre:      hab.displayName,
            icono:       hab.displayIcon,
            descripcion: hab.description,
            slot:        hab.slot,           // C / Q / E / X / Passive
          })),
        }));

        cacheService.set(CACHE_KEY, formateados, CACHE_CONFIG.AGENTS_TTL);
        setPersonajes(formateados);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }

    fetchPersonajes();
  }, []);

  return { personajes, cargando, error, fromCache };
}
