import React, { useState } from "react";

// Category → accent color mapping
const categoryColors = {
  Rifle: { border: "border-red-500/40", bg: "bg-red-500/10", text: "text-red-400" },
  Heavy: { border: "border-orange-500/40", bg: "bg-orange-500/10", text: "text-orange-400" },
  Shotgun: { border: "border-amber-500/40", bg: "bg-amber-500/10", text: "text-amber-400" },
  SMG: { border: "border-green-500/40", bg: "bg-green-500/10", text: "text-green-400" },
  Sidearm: { border: "border-sky-500/40", bg: "bg-sky-500/10", text: "text-sky-400" },
  Sniper: { border: "border-purple-500/40", bg: "bg-purple-500/10", text: "text-purple-400" },
  Melee: { border: "border-slate-500/40", bg: "bg-slate-500/10", text: "text-slate-400" },
};

// Stat bar component
function StatBar({ label, value, max, suffix = "", color = "#00f7ff" }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="space-y-0.5">
      <div className="flex justify-between text-[11px]">
        <span className="text-slate-500 uppercase tracking-wider">{label}</span>
        <span className="text-slate-300 font-medium tabular-nums">
          {value}{suffix}
        </span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}, ${color}88)`,
          }}
        />
      </div>
    </div>
  );
}

export default function WeaponCard({ arma, onClick }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const colors = categoryColors[arma.categoria] || categoryColors.Melee;

  return (
    <button
      onClick={() => onClick(arma)}
      className={`group relative w-full text-left bg-spectrum-dark border ${colors.border} rounded-xl overflow-hidden
        hover:border-spectrum-cyan/40 hover:shadow-lg hover:shadow-spectrum-cyan/5 transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-spectrum-cyan/30`}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-spectrum-cyan/0 to-spectrum-purple/0 group-hover:from-spectrum-cyan/5 group-hover:to-spectrum-purple/5 transition-all duration-500 pointer-events-none" />

      {/* Weapon image area */}
      <div className="relative h-32 flex items-center justify-center px-6 overflow-hidden">
        {/* Faint grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)", backgroundSize: "20px 20px" }}
        />
        <img
          src={arma.icono}
          alt={arma.nombre}
          className={`max-h-20 w-auto object-contain drop-shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_12px_rgba(0,247,255,0.15)] ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-slate-700 border-t-spectrum-cyan rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Info area */}
      <div className="p-4 pt-3 space-y-3 relative z-10">
        {/* Name + category + cost */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-white font-display font-bold text-sm tracking-wide uppercase truncate">
              {arma.nombre}
            </h3>
            <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest rounded-md ${colors.bg} ${colors.text}`}>
              {arma.categoriaTexto}
            </span>
          </div>
          {arma.costo !== null && (
            <div className="flex items-center gap-1 shrink-0">
              <svg className="w-3 h-3 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" />
                <text x="12" y="16" textAnchor="middle" fontSize="12" fill="#000" fontWeight="bold">$</text>
              </svg>
              <span className="text-yellow-500/80 text-xs font-bold tabular-nums">
                {arma.costo.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Quick stats */}
        {arma.stats && (
          <div className="space-y-1.5">
            <StatBar label="Cadencia" value={arma.stats.cadencia} max={16} suffix="/s" />
            <StatBar label="Cargador" value={arma.stats.cargador} max={100} />
            {arma.stats.rangosDano.length > 0 && (
              <StatBar
                label="Daño (cuerpo)"
                value={arma.stats.rangosDano[0].cuerpo}
                max={160}
              />
            )}
          </div>
        )}

        {/* Melee placeholder */}
        {!arma.stats && (
          <p className="text-[11px] text-slate-500 italic">Arma cuerpo a cuerpo</p>
        )}
      </div>

      {/* "Ver detalles" hint on hover */}
      <div className="absolute bottom-0 inset-x-0 h-10 flex items-end justify-center pb-2 bg-gradient-to-t from-spectrum-dark via-spectrum-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-[10px] text-spectrum-cyan/70 font-medium uppercase tracking-widest">
          Ver detalles
        </span>
      </div>
    </button>
  );
}
