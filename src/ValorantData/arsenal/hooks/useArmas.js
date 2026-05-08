import { useEffect, useState } from "react";
import { cacheService } from "../../../services/cacheService";
import { CACHE_CONFIG } from "../../../utils/constants";

const CACHE_KEY = "weapons";

// Clean category enum → readable key
function cleanCategory(raw) {
  if (!raw) return "Desconocido";
  // "EEquippableCategory::Rifle" → "Rifle"
  return raw.replace("EEquippableCategory::", "");
}

// Clean wall penetration enum
function cleanPenetration(raw) {
  if (!raw) return null;
  return raw.replace("EWallPenetrationDisplayType::", "");
}

export function useArmas() {
  const [armas, setArmas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchArmas() {
      // Check cache first
      const cached = cacheService.get(CACHE_KEY);
      if (cached) {
        console.log(`⚡ Armas cargadas desde caché (${Math.round(cached.age / 1000)}s)`);
        setArmas(cached.data);
        setCargando(false);
        return;
      }

      try {
        const res = await fetch(
          "https://valorant-api.com/v1/weapons?language=es-MX"
        );
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        const json = await res.json();
        const data = json.data;

        const armasFormateadas = data.map((weapon) => ({
          uuid: weapon.uuid,
          nombre: weapon.displayName,
          categoria: cleanCategory(weapon.category),
          categoriaTexto: weapon.shopData?.categoryText || cleanCategory(weapon.category),
          icono: weapon.displayIcon,
          iconoKill: weapon.killStreamIcon,

          // Shop data
          costo: weapon.shopData?.cost ?? null,
          imagenTienda: weapon.shopData?.newImage || weapon.displayIcon,

          // Stats (null for Melee)
          stats: weapon.weaponStats
            ? {
                cadencia: weapon.weaponStats.fireRate,
                cargador: weapon.weaponStats.magazineSize,
                velocidadMovimiento: weapon.weaponStats.runSpeedMultiplier,
                tiempoEquipar: weapon.weaponStats.equipTimeSeconds,
                tiempoRecarga: weapon.weaponStats.reloadTimeSeconds,
                precisionPrimerBala: weapon.weaponStats.firstBulletAccuracy,
                perdigones: weapon.weaponStats.shotgunPelletCount,
                penetracionMuros: cleanPenetration(weapon.weaponStats.wallPenetration),
                caracteristica: weapon.weaponStats.feature
                  ? weapon.weaponStats.feature.replace("EWeaponStatsFeature::", "")
                  : null,
                tipoAltFuego: weapon.weaponStats.altFireType
                  ? weapon.weaponStats.altFireType.replace("EWeaponAltFireDisplayType::", "")
                  : null,
                mira: weapon.weaponStats.adsStats
                  ? {
                      zoom: weapon.weaponStats.adsStats.zoomMultiplier,
                      cadenciaMira: weapon.weaponStats.adsStats.fireRate,
                      rafaga: weapon.weaponStats.adsStats.burstCount,
                    }
                  : null,
                rangosDano: (weapon.weaponStats.damageRanges || []).map((r) => ({
                  inicio: r.rangeStartMeters,
                  fin: r.rangeEndMeters,
                  cabeza: Math.round(r.headDamage * 10) / 10,
                  cuerpo: Math.round(r.bodyDamage * 10) / 10,
                  piernas: Math.round(r.legDamage * 10) / 10,
                })),
              }
            : null,

          // Skins summary (keep lightweight for the list)
          totalSkins: weapon.skins?.length || 0,
          skins: (weapon.skins || [])
            .filter((s) => s.displayIcon && !s.displayName.includes("Estándar") && !s.displayName.includes("Standard"))
            .slice(0, 6)
            .map((s) => ({
              uuid: s.uuid,
              nombre: s.displayName,
              icono: s.displayIcon,
              rareza: s.contentTierUuid,
            })),

          // All skins for detail view (includes all with icons)
          allSkins: (weapon.skins || [])
            .filter((s) => s.displayIcon)
            .map((s) => ({
              uuid: s.uuid,
              nombre: s.displayName,
              icono: s.displayIcon,
              rareza: s.contentTierUuid,
            })),
        }));

        // Save to cache
        cacheService.set(CACHE_KEY, armasFormateadas, CACHE_CONFIG.WEAPONS_TTL);
        setArmas(armasFormateadas);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }

    fetchArmas();
  }, []);

  return { armas, cargando, error };
}
