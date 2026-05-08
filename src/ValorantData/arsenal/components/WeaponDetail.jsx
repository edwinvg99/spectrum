import React, { useEffect, useRef, useState, useMemo } from "react";
import anime from "animejs";

/* ── translations ── */
const penetrationMap = {
  High:   { label: "Alta",  color: "text-red-400" },
  Medium: { label: "Media", color: "text-yellow-400" },
  Low:    { label: "Baja",  color: "text-green-400" },
};
const featureMap = { ROFIncrease: "Cadencia progresiva", Silenced: "Silenciado", DualZoom: "Doble zoom" };
const altFireMap = { ADS: "Mira de precisión", AirBurst: "Ráfaga aérea", Shotgun: "Modo escopeta" };

const SKIN_TIERS = {
  "12683d76-48d7-84a3-4e09-6985794f0445": { name: "Select",    color: "text-blue-400",   border: "border-blue-500/30",   bg: "bg-blue-500/10"   },
  "0cebb8be-46d7-c12a-d306-e9907bfc5a25": { name: "Deluxe",    color: "text-green-400",  border: "border-green-500/30",  bg: "bg-green-500/10"  },
  "60bca009-4182-7998-dee7-b8a2558dc369": { name: "Premium",   color: "text-pink-400",   border: "border-pink-500/30",   bg: "bg-pink-500/10"   },
  "e046854e-406c-37f4-6607-19a9ba8426fc": { name: "Exclusive", color: "text-orange-400", border: "border-orange-500/30", bg: "bg-orange-500/10" },
  "411e4a55-4e59-7757-41f0-86a53f101bb5": { name: "Ultra",     color: "text-yellow-400", border: "border-yellow-500/30", bg: "bg-yellow-500/10" },
};
const TIER_NONE = { name: "Estándar", color: "text-slate-400", border: "border-slate-700/30", bg: "bg-slate-700/10" };

const SKIN_FILTER_OPTIONS = [
  { key: "all",  label: "Todas"     },
  { key: "411e4a55-4e59-7757-41f0-86a53f101bb5", label: "Ultra"     },
  { key: "e046854e-406c-37f4-6607-19a9ba8426fc", label: "Exclusive" },
  { key: "60bca009-4182-7998-dee7-b8a2558dc369", label: "Premium"   },
  { key: "0cebb8be-46d7-c12a-d306-e9907bfc5a25", label: "Deluxe"    },
  { key: "12683d76-48d7-84a3-4e09-6985794f0445", label: "Select"    },
  { key: "none", label: "Estándar"  },
];

/* ── Animated stat bar ── */
function AnimStatBar({ label, value, max, suffix = "", accentColor = "#00f7ff" }) {
  const barRef = useRef(null);
  const pct = Math.min((value / max) * 100, 100);

  useEffect(() => {
    if (!barRef.current) return;
    anime({
      targets:  barRef.current,
      width:    [`0%`, `${pct}%`],
      duration: 900,
      delay:    200,
      easing:   "easeOutExpo",
    });
  }, [pct]);

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px]">
        <span className="text-slate-500 uppercase tracking-wider">{label}</span>
        <span className="text-slate-300 font-semibold tabular-nums">{value}{suffix}</span>
      </div>
      <div className="h-1.5 bg-slate-700/40 rounded-full overflow-hidden">
        <div
          ref={barRef}
          className="h-full rounded-full"
          style={{ width: 0, background: `linear-gradient(90deg, ${accentColor}, ${accentColor}80)` }}
        />
      </div>
    </div>
  );
}

function StatRow({ label, value, accent = false }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-slate-700/20 last:border-0">
      <span className="text-slate-500 text-xs uppercase tracking-wider">{label}</span>
      <span className={`text-sm font-semibold tabular-nums ${accent ? "text-spectrum-cyan" : "text-white"}`}>
        {value}
      </span>
    </div>
  );
}

/* ── Animated damage number ── */
function DamageCell({ value, color }) {
  const ref     = useRef(null);
  const numRef  = useRef(null);

  useEffect(() => {
    if (!numRef.current) return;
    const obj = { val: 0 };
    anime({
      targets:  obj,
      val:      value,
      duration: 1000,
      easing:   "easeOutExpo",
      update:   () => { if (numRef.current) numRef.current.textContent = Math.round(obj.val); },
    });
  }, [value]);

  return (
    <td className="py-2.5 px-3 text-center">
      <span
        ref={numRef}
        className="text-sm font-bold tabular-nums"
        style={{ color }}
      >
        0
      </span>
    </td>
  );
}

export default function WeaponDetail({ arma, onClose }) {
  const overlayRef  = useRef(null);
  const panelRef    = useRef(null);
  const [skinFilter, setSkinFilter] = useState("all");

  const allSkins     = arma.allSkins || arma.skins || [];
  const filteredSkins = useMemo(() => {
    if (skinFilter === "all")  return allSkins;
    if (skinFilter === "none") return allSkins.filter((s) => !s.rareza);
    return allSkins.filter((s) => s.rareza === skinFilter);
  }, [allSkins, skinFilter]);

  const availableTiers = useMemo(() => {
    const tierKeys = new Set(allSkins.map((s) => s.rareza || "none"));
    return SKIN_FILTER_OPTIONS.filter((opt) => opt.key === "all" || tierKeys.has(opt.key));
  }, [allSkins]);

  /* ── open animation ── */
  useEffect(() => {
    if (!overlayRef.current || !panelRef.current) return;
    anime({ targets: overlayRef.current, opacity: [0, 1], duration: 250, easing: "easeOutQuad" });
    anime({ targets: panelRef.current,   scale: [0.9, 1], opacity: [0, 1], duration: 400, easing: "easeOutBack" });
  }, []);

  /* ── close ── */
  const handleClose = () => {
    anime({
      targets:  [overlayRef.current, panelRef.current],
      opacity:  [1, 0],
      scale:    panelRef.current ? [1, 0.93] : undefined,
      duration: 200,
      easing:   "easeInQuad",
      complete: onClose,
    });
  };

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const stats = arma.stats;
  const pen   = stats?.penetracionMuros ? penetrationMap[stats.penetracionMuros] : null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) handleClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      style={{ opacity: 0 }}
    >
      <div
        ref={panelRef}
        className="relative bg-spectrum-darker border border-slate-700/50 rounded-2xl shadow-2xl
                   max-w-3xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
        style={{ opacity: 0 }}
      >
        {/* glow top border */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-spectrum-cyan/60 to-transparent" />

        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700
                     text-slate-400 hover:text-white transition-colors group"
        >
          <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        {/* ── Header ── */}
        <div className="relative px-8 pt-8 pb-5">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Weapon image */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-spectrum-cyan/5 rounded-xl blur-xl" />
              <div
                className="relative bg-slate-800/50 border border-slate-700/30 rounded-xl p-6
                           w-60 h-36 flex items-center justify-center"
                style={{
                  backgroundImage: "linear-gradient(rgba(0,247,255,.015) 1px,transparent 1px),linear-gradient(90deg,rgba(0,247,255,.015) 1px,transparent 1px)",
                  backgroundSize: "16px 16px",
                }}
              >
                <img
                  src={arma.imagenTienda || arma.icono}
                  alt={arma.nombre}
                  className="max-h-24 w-auto object-contain drop-shadow-[0_0_16px_rgba(0,247,255,0.3)]
                             animate-float"
                />
              </div>
            </div>

            {/* Name + meta */}
            <div className="text-center sm:text-left">
              <h2 className="text-3xl font-display font-black text-white uppercase tracking-widest">
                {arma.nombre}
              </h2>
              <p className="text-slate-400 text-sm mt-1">{arma.categoriaTexto}</p>
              {arma.costo !== null && (
                <div className="flex items-center gap-2 mt-3 justify-center sm:justify-start">
                  <span className="text-yellow-500 text-xl">●</span>
                  <span className="text-yellow-400 font-black text-2xl tabular-nums">
                    {arma.costo.toLocaleString()}
                  </span>
                  <span className="text-yellow-600 text-sm font-semibold">Creds</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="px-8 pb-8 space-y-6">

          {/* Quick stat bars */}
          {stats && (
            <div className="bg-slate-800/30 border border-slate-700/20 rounded-xl p-5">
              <h3 className="text-[10px] font-black text-spectrum-cyan uppercase tracking-[0.25em] mb-4">
                Estadísticas Rápidas
              </h3>
              <div className="space-y-3">
                <AnimStatBar label="Cadencia" value={stats.cadencia} max={16}   suffix="/s" accentColor="#00f7ff" />
                <AnimStatBar label="Cargador" value={stats.cargador} max={100}              accentColor="#3b82f6" />
                {stats.rangosDano?.[0] && (
                  <AnimStatBar label="Daño (cuerpo)" value={stats.rangosDano[0].cuerpo} max={160} accentColor="#a855f7" />
                )}
              </div>
            </div>
          )}

          {/* Full stats grid */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800/30 border border-slate-700/20 rounded-xl p-4">
                <h3 className="text-[10px] font-black text-spectrum-cyan uppercase tracking-[0.2em] mb-3">
                  Estadísticas
                </h3>
                <StatRow label="Cadencia de fuego"  value={`${stats.cadencia}/s`}                   accent />
                <StatRow label="Cargador"            value={stats.cargador}                                  />
                <StatRow label="Tiempo de recarga"  value={`${stats.tiempoRecarga}s`}                       />
                <StatRow label="Tiempo de equipar"  value={`${stats.tiempoEquipar}s`}                       />
                <StatRow label="Vel. movimiento"    value={`${Math.round(stats.velocidadMovimiento * 100)}%`} />
                {stats.perdigones > 1  && <StatRow label="Perdigones" value={stats.perdigones} />}
                {pen && (
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-slate-500 text-xs uppercase tracking-wider">Penetración</span>
                    <span className={`text-sm font-semibold ${pen.color}`}>{pen.label}</span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {(stats.caracteristica || stats.tipoAltFuego) && (
                  <div className="bg-slate-800/30 border border-slate-700/20 rounded-xl p-4">
                    <h3 className="text-[10px] font-black text-spectrum-purple uppercase tracking-[0.2em] mb-3">
                      Características
                    </h3>
                    {stats.caracteristica && (
                      <div className="flex items-center gap-2 text-sm text-slate-300 mb-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-spectrum-purple" />
                        {featureMap[stats.caracteristica] || stats.caracteristica}
                      </div>
                    )}
                    {stats.tipoAltFuego && (
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-spectrum-blue" />
                        {altFireMap[stats.tipoAltFuego] || stats.tipoAltFuego}
                      </div>
                    )}
                  </div>
                )}
                {stats.mira && (
                  <div className="bg-slate-800/30 border border-slate-700/20 rounded-xl p-4">
                    <h3 className="text-[10px] font-black text-spectrum-blue uppercase tracking-[0.2em] mb-3">
                      Mira (ADS)
                    </h3>
                    <StatRow label="Zoom"          value={`${stats.mira.zoom}x`}               accent />
                    <StatRow label="Cadencia (ADS)" value={`${stats.mira.cadenciaMira}/s`}           />
                    {stats.mira.rafaga > 1 && <StatRow label="Ráfaga" value={`${stats.mira.rafaga} balas`} />}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Damage table with animated numbers */}
          {stats?.rangosDano?.length > 0 && (
            <div className="bg-slate-800/30 border border-red-500/10 rounded-xl p-5 overflow-x-auto">
              <h3 className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em] mb-4">
                Daño por Distancia
              </h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/30">
                    <th className="text-left text-slate-500 text-[10px] uppercase tracking-wider py-2 pr-4">Distancia</th>
                    <th className="text-center text-red-400/80 text-[10px] uppercase tracking-wider py-2 px-3">💀 Cabeza</th>
                    <th className="text-center text-yellow-400/80 text-[10px] uppercase tracking-wider py-2 px-3">💛 Cuerpo</th>
                    <th className="text-center text-blue-400/80 text-[10px] uppercase tracking-wider py-2 px-3">🦵 Piernas</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.rangosDano.map((rango, i) => (
                    <tr key={i} className="border-b border-slate-700/10 last:border-0 hover:bg-slate-700/10 transition-colors">
                      <td className="py-2.5 pr-4 text-slate-300 font-semibold tabular-nums">
                        {rango.inicio}–{rango.fin}m
                      </td>
                      <DamageCell value={rango.cabeza}  color="#f87171" />
                      <DamageCell value={rango.cuerpo}  color="#facc15" />
                      <DamageCell value={rango.piernas} color="#60a5fa" />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Skins gallery */}
          {allSkins.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Skins
                  <span className="ml-2 text-slate-600 normal-case tracking-normal font-normal">
                    ({filteredSkins.length}/{allSkins.length})
                  </span>
                </h3>
              </div>

              {availableTiers.length > 2 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {availableTiers.map(({ key, label }) => {
                    const tier     = SKIN_TIERS[key] || (key === "none" ? TIER_NONE : null);
                    const isActive = skinFilter === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setSkinFilter(key)}
                        className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border
                                    transition-all duration-200
                          ${isActive
                            ? key === "all"
                              ? "bg-spectrum-cyan/15 text-spectrum-cyan border-spectrum-cyan/30"
                              : `${tier?.bg || ""} ${tier?.color || "text-white"} ${tier?.border || "border-slate-600/30"}`
                            : "text-slate-500 border-slate-700/20 hover:text-slate-300 hover:border-slate-600/40"}`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[380px] overflow-y-auto custom-scrollbar pr-1">
                {filteredSkins.map((skin, i) => {
                  const tier = SKIN_TIERS[skin.rareza] || TIER_NONE;
                  return (
                    <div
                      key={skin.uuid}
                      className={`bg-slate-800/30 border ${tier.border} rounded-xl p-3
                                  hover:border-slate-500/60 hover:bg-slate-700/20 transition-all duration-200
                                  animate-fade-in-up`}
                      style={{ animationDelay: `${i * 30}ms` }}
                    >
                      <div className="h-14 flex items-center justify-center mb-2">
                        <img
                          src={skin.icono}
                          alt={skin.nombre}
                          className="max-h-12 w-auto object-contain hover:scale-110 transition-transform duration-200"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 text-center truncate">{skin.nombre}</p>
                      {skin.rareza && SKIN_TIERS[skin.rareza] && (
                        <p className={`text-[9px] text-center mt-0.5 font-black uppercase tracking-wider ${tier.color}`}>
                          {tier.name}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
              {filteredSkins.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-slate-500 text-sm">No hay skins en esta categoría.</p>
                </div>
              )}
            </div>
          )}

          {!stats && (
            <div className="text-center py-10">
              <span className="text-5xl mb-3 block">⚔️</span>
              <p className="text-slate-500 text-sm">Sin estadísticas de combate para armas cuerpo a cuerpo.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
