import { useEffect, useState } from "react";
import { cacheService } from "../../../services/cacheService";
import { CACHE_CONFIG } from "../../../utils/constants";

const CACHE_KEY = "maps_es_MX";

export function useMaps(mapasExcluidos = []) {
  const [mapas, setmapas]       = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError]       = useState(null);
  const [fromCache, setFromCache] = useState(false);

  useEffect(() => {
    async function fetchMaps() {
      // ── 1. Try cache (1 hr TTL — maps only change on patches) ────────────
      const cached = cacheService.get(CACHE_KEY);
      let rawData;

      if (cached) {
        console.log(`⚡ Mapas desde caché (${Math.round(cached.age / 1000)}s)`);
        rawData = cached.data;
        setFromCache(true);
      } else {
        // ── 2. Fetch from valorant-api.com ───────────────────────────────────
        try {
          const res = await fetch("https://valorant-api.com/v1/maps?language=es-MX");
          if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
          const json = await res.json();
          rawData = json.data;
          cacheService.set(CACHE_KEY, rawData, CACHE_CONFIG.MAPS_TTL);
        } catch (err) {
          setError(err.message);
          setCargando(false);
          return;
        }
      }

      // ── 3. Filter + shape ─────────────────────────────────────────────────
      let data = rawData;
      if (mapasExcluidos.length > 0) {
        data = data.filter((m) => !mapasExcluidos.includes(m.displayName));
      }

      const formateados = data.map((m) => ({
        uuid:            m.uuid,
        nombre:          m.displayName,
        fondoCarga:      m.splash,
        cardmapas:       m.listViewIconTall,
        minimap:         m.displayIcon,
        fondo:           m.premierBackgroundImage,
        cordenadas:      m.coordinates,
        callouts:        (m.callouts || []).map((c) => ({
          nombre:   c.regionName,
          superNombre: c.superRegionName,
          x: c.location?.x,
          y: c.location?.y,
        })),
      }));

      setmapas(formateados);
      setCargando(false);
    }

    fetchMaps();
  }, []); // intentionally omit mapasExcluidos — cache is populated once per session

  return { mapas, cargando, error, fromCache };
}
