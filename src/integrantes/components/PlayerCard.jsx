import React, { useState, useEffect, useRef } from "react";
import anime from "animejs";
import { DEFAULT_IMAGES } from "../../../server/utils/constants";
import SpectrumLogo from "../../assets/images/spectrumLOGO.svg?react";

/* ── Skeleton ── */
const PlayerCardSkeleton = ({ playerInfo }) => (
  <div className="bg-slate-800/60 rounded-2xl border border-slate-700/40 p-8 shadow-xl animate-pulse h-full">
    <div className="relative h-52 mb-4">
      <div className="absolute inset-0 bg-slate-700/30 rounded-xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
        <div className="w-28 h-28 rounded-full bg-slate-600/50 border-4 border-slate-700/50" />
      </div>
      <div className="absolute top-10 right-10 z-30 w-12 h-12 bg-slate-600/50 rounded-full" />
      <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 z-40 bg-slate-900 px-5 py-2 rounded-full border border-slate-700/50">
        <div className="w-16 h-8 bg-slate-600/50 rounded" />
      </div>
    </div>
    <div className="text-center pt-10 pb-4 space-y-3">
      <h2 className="text-2xl font-extrabold text-slate-300">
        {playerInfo?.name || "Cargando..."}
        <span className="text-slate-400">#{playerInfo?.tag || "..."}</span>
      </h2>
      <div className="h-4 bg-slate-600/50 rounded w-24 mx-auto" />
      <div className="flex w-full px-4 gap-4 mt-4">
        <div className="flex-1 bg-slate-700/50 p-4 rounded-xl h-20" />
        <div className="flex-1 bg-slate-700/50 p-4 rounded-xl h-20" />
      </div>
    </div>
  </div>
);

/* ── Rank colors ── */
const RANK_COLORS = {
  "Iron 1": "#828282",   "Iron 2": "#828282",   "Iron 3": "#828282",
  "Bronze 1": "#7c5522", "Bronze 2": "#7c5522", "Bronze 3": "#7c5522",
  "Silver 1": "#d1d1d1", "Silver 2": "#d1d1d1", "Silver 3": "#d1d1d1",
  "Gold 1": "#FFD700",   "Gold 2": "#FFD700",   "Gold 3": "#FFD700",
  "Platinum 1": "#00c7c0","Platinum 2": "#00c7c0","Platinum 3": "#00c7c0",
  "Diamond 1": "#eb96f2","Diamond 2": "#eb96f2","Diamond 3": "#eb96f2",
  "Ascendant 1": "#7defb9","Ascendant 2": "#7defb9","Ascendant 3": "#7defb9",
  "Immortal 1": "#ff5551","Immortal 2": "#ff5551","Immortal 3": "#ff5551",
  Radiant: "#ffedaa",
  Unranked: "#4A5568",
};
const getRankColor = (r) => RANK_COLORS[r] || RANK_COLORS["Unranked"];

const PlayerCard = ({ playerData, mmrData, isLoading, error, playerInfo }) => {
  const [showContent, setShowContent] = useState(false);
  const cardRef      = useRef(null);
  const eloRef       = useRef(null);

  /* ── preload images then reveal ── */
  useEffect(() => {
    if (!playerData || isLoading) return;

    const srcs = [
      playerData.card?.wide || playerData.card?.large || DEFAULT_IMAGES.ERROR_CARD,
      playerData.card?.small || playerData.info?.displayIcon || DEFAULT_IMAGES.DEFAULT_AVATAR,
      mmrData?.images?.large || DEFAULT_IMAGES.UNRANKED_ICON,
    ];
    let done = 0;
    srcs.forEach((src) => {
      const img = new Image();
      img.onload = img.onerror = () => { if (++done === srcs.length) setShowContent(true); };
      img.src = src;
    });
  }, [playerData, mmrData, isLoading]);

  /* ── anime entrance ── */
  useEffect(() => {
    if (!showContent || !cardRef.current) return;
    anime({
      targets:  cardRef.current,
      opacity:  [0, 1],
      translateY: [20, 0],
      duration: 600,
      easing:   "easeOutExpo",
    });
  }, [showContent]);

  if (isLoading || !showContent) return <PlayerCardSkeleton playerInfo={playerInfo} />;

  if (error || !playerData) {
    return (
      <div className="bg-red-900/20 border border-red-700/40 rounded-2xl p-8 flex flex-col items-center justify-center shadow-xl h-full">
        <div className="text-center text-red-300">
          <h3 className="text-2xl font-bold mb-3 text-red-200">
            {playerInfo?.name || "Error"}
            <span className="text-red-400">#{playerInfo?.tag || ""}</span>
          </h3>
          <p className="text-base">❌ {error || "No se pudieron cargar los datos."}</p>
        </div>
      </div>
    );
  }

  const cardImage   = playerData.card?.wide || playerData.card?.large || DEFAULT_IMAGES.ERROR_CARD;
  const playerAvatar= playerData.card?.small || playerData.info?.displayIcon || DEFAULT_IMAGES.DEFAULT_AVATAR;
  const rankImage   = mmrData?.images?.large || DEFAULT_IMAGES.UNRANKED_ICON;
  const currentTier = mmrData?.currenttierpatched || "Unranked";
  const elo         = mmrData?.elo || "N/A";
  const rankColor   = getRankColor(currentTier);

  return (
    <div
      ref={cardRef}
      className="relative bg-spectrum-dark rounded-2xl overflow-hidden border border-slate-700/40
                 transition-all duration-300 ease-out group cursor-pointer select-none
                 hover:-translate-y-2"
      style={{ opacity: 0, "--rank-c": rankColor, "--rank-shadow": `${rankColor}50` }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = rankColor + "80";
        e.currentTarget.style.boxShadow   = `0 20px 50px -10px ${rankColor}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "";
        e.currentTarget.style.boxShadow   = "";
      }}
    >
      {/* ── Banner ── */}
      <div className="relative h-52">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 group-hover:opacity-40 transition-opacity duration-500"
          style={{ backgroundImage: `url(${cardImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-spectrum-dark via-spectrum-dark/60 to-transparent" />

        {/* Spectrum watermark */}
        <div className="absolute -top-4 -right-6 opacity-[0.06] group-hover:opacity-[0.14] transition-opacity duration-500 pointer-events-none">
          <SpectrumLogo className="w-52 h-52" fill={rankColor} stroke={rankColor} />
        </div>

        {/* Avatar */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <img
            src={playerAvatar}
            alt={playerData.name}
            className="w-28 h-28 rounded-full border-4 object-cover shadow-2xl
                       ring-4 ring-offset-2 ring-offset-spectrum-dark group-hover:scale-110 transition-transform duration-400"
            style={{ borderColor: `${rankColor}90`, ringColor: rankColor }}
            onError={(e) => { e.target.src = DEFAULT_IMAGES.DEFAULT_AVATAR; }}
          />
        </div>

        {/* Rank icon */}
        <div className="absolute top-10 right-8 z-20">
          <img
            src={rankImage}
            alt={currentTier}
            className="w-12 h-12 object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
            onError={(e) => { e.target.src = DEFAULT_IMAGES.UNRANKED_ICON; }}
          />
        </div>

        {/* ELO pill */}
        <div
          ref={eloRef}
          className="absolute bottom-[-18px] left-1/2 -translate-x-1/2 z-30 px-6 py-1.5 rounded-full
                     bg-spectrum-darker border group-hover:scale-110 transition-transform duration-300"
          style={{ borderColor: `${rankColor}60`, boxShadow: `0 8px 24px -4px ${rankColor}50` }}
        >
          <span
            className="text-3xl font-black tabular-nums"
            style={{ color: rankColor, textShadow: `0 0 12px ${rankColor}80` }}
          >
            {elo}
          </span>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="text-center pt-10 pb-5 px-5 relative z-10">
        <h2 className="text-2xl font-extrabold text-white group-hover:scale-105 transition-transform duration-300">
          {playerData.name}
          <span className="ml-1 font-bold text-lg" style={{ color: rankColor }}>
            #{playerData.tag}
          </span>
        </h2>
        <p className="text-sm text-slate-400 mt-1 group-hover:text-slate-300 transition-colors">
          {currentTier}
        </p>

        {/* Stats */}
        <div className="flex gap-3 mt-5">
          {[
            { label: "Nivel", value: playerData.account_level || 0 },
            { label: "Región", value: (playerData.region || "N/A").toUpperCase() },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex-1 bg-slate-800/60 border border-slate-700/30 rounded-xl p-3
                         group-hover:bg-slate-700/50 group-hover:border-[var(--rank-c)]/20 transition-all duration-300"
            >
              <span className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">{label}</span>
              <span className="block text-xl font-bold" style={{ color: rankColor }}>{value}</span>
            </div>
          ))}
        </div>

        {/* "Ver perfil" hint */}
        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-[11px] text-spectrum-cyan/70 font-semibold uppercase tracking-[0.2em]">
            Ver perfil →
          </span>
        </div>
      </div>

      {/* Decorative corner logos */}
      <div className="absolute bottom-0 left-0 -translate-x-1/3 translate-y-1/3 opacity-[0.04]
                      group-hover:opacity-[0.1] transition-opacity pointer-events-none">
        <SpectrumLogo className="w-40 h-40" fill={rankColor} stroke={rankColor} />
      </div>
    </div>
  );
};

export default PlayerCard;
