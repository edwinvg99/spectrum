/**
 * useAccesorios — fetches Valorant accessories from valorant-api.com
 *
 * Items included:
 *  • Buddies (Llaveros) — gun charms
 *  • Sprays            — spray paints (static + animated GIF)
 *  • PlayerCards       — profile cards (small / wide / large art)
 *
 * Bilingual:
 *  Fetches ES (es-MX) for display names AND EN (en-US) so searches
 *  work in both languages.
 *
 * Cache: 1 hour TTL via cacheService (assets rarely change between patches).
 */

import { useEffect, useState, useCallback } from "react";
import { cacheService } from "../../../services/cacheService";
import { CACHE_CONFIG }  from "../../../utils/constants";

const CACHE_KEY = "accesorios_v1";
const API       = "https://valorant-api.com/v1";

/* ── helpers ── */
async function fetchJson(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status} — ${url}`);
  const j = await r.json();
  return j.data || [];
}

/** Build a uuid→name map from an array of items. */
const nameMap = (arr) => Object.fromEntries(arr.map(x => [x.uuid, x.displayName]));

/** Normalise a single accessory to a common schema. */
function normBuddy(item, enNames) {
  if (!item.displayIcon) return null;
  return {
    uuid:        item.uuid,
    nameEs:      item.displayName,
    nameEn:      enNames[item.uuid] || item.displayName,
    tipo:        "buddy",
    tipoLabel:   "Llavero",
    imagen:      item.displayIcon,
    imagenLarge: item.displayIcon,
    // downloads: [{ label, url, ext }]
    downloads: [{ label: "PNG", url: item.displayIcon, ext: "png" }],
  };
}

function normSpray(item, enNames) {
  if (!item.displayIcon || item.isNullSpray) return null;
  const best   = item.fullTransparentIcon || item.fullIcon || item.displayIcon;
  const dl = [];
  if (item.animationGif) dl.push({ label: "GIF animado", url: item.animationGif, ext: "gif" });
  dl.push({ label: "PNG", url: best, ext: "png" });
  return {
    uuid:        item.uuid,
    nameEs:      item.displayName,
    nameEn:      enNames[item.uuid] || item.displayName,
    tipo:        "spray",
    tipoLabel:   "Spray",
    imagen:      item.displayIcon,
    imagenLarge: best,
    animado:     !!item.animationGif,
    gifUrl:      item.animationGif || null,
    downloads:   dl,
  };
}

function normCard(item, enNames) {
  if (!item.smallArt && !item.displayIcon) return null;
  const dl = [];
  if (item.largeArt)  dl.push({ label: "Grande",  url: item.largeArt,  ext: "png" });
  if (item.wideArt)   dl.push({ label: "Ancha",   url: item.wideArt,   ext: "png" });
  if (item.smallArt)  dl.push({ label: "Pequeña", url: item.smallArt,  ext: "png" });
  return {
    uuid:        item.uuid,
    nameEs:      item.displayName,
    nameEn:      enNames[item.uuid] || item.displayName,
    tipo:        "playercard",
    tipoLabel:   "Tarjeta",
    imagen:      item.smallArt  || item.displayIcon,
    imagenLarge: item.largeArt  || item.smallArt || item.displayIcon,
    imagenWide:  item.wideArt   || null,
    downloads:   dl,
  };
}

/* ══════════════════════════════════════════════ */

export function useAccesorios() {
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [fromCache,setFromCache]= useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    /* 1. Try cache */
    const cached = cacheService.get(CACHE_KEY);
    if (cached) {
      console.log(`⚡ Accesorios desde caché (${Math.round(cached.age / 1000)}s)`);
      setItems(cached.data);
      setFromCache(true);
      setLoading(false);
      return;
    }

    /* 2. Parallel fetch: 3 types × 2 languages = 6 requests */
    try {
      const [buddiesEs, buddiesEn, spraysEs, spraysEn, cardsEs, cardsEn] =
        await Promise.all([
          fetchJson(`${API}/buddies?language=es-MX`),
          fetchJson(`${API}/buddies?language=en-US`),
          fetchJson(`${API}/sprays?language=es-MX`),
          fetchJson(`${API}/sprays?language=en-US`),
          fetchJson(`${API}/playercards?language=es-MX`),
          fetchJson(`${API}/playercards?language=en-US`),
        ]);

      const buddyEn = nameMap(buddiesEn);
      const sprayEn = nameMap(spraysEn);
      const cardEn  = nameMap(cardsEn);

      const all = [
        ...buddiesEs.map(x => normBuddy(x, buddyEn)),
        ...spraysEs .map(x => normSpray(x, sprayEn)),
        ...cardsEs  .map(x => normCard (x, cardEn)),
      ].filter(Boolean);

      cacheService.set(CACHE_KEY, all, CACHE_CONFIG.AGENTS_TTL); // 1 hour
      setItems(all);
      setFromCache(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { items, loading, error, fromCache, reload: load };
}
