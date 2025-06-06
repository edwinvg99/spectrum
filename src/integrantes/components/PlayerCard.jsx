import React, { useState, useEffect } from "react";
import { DEFAULT_IMAGES } from "../../../server/utils/constants";
import SpectrumLogo from "../../assets/images/spectrumLOGO.svg?react";

// Skeleton específico para PlayerCard
const PlayerCardSkeleton = ({ playerInfo }) => (
  <div className="bg-slate-800/60 rounded-2xl border border-slate-700/50 p-8 shadow-xl animate-pulse">
    <div className="relative h-52 mb-4">
      {/* Fondo skeleton */}
      <div className="absolute inset-0 bg-slate-700/30 rounded-xl"></div>

      {/* Avatar skeleton */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
        <div className="w-32 h-32 rounded-full bg-slate-600/50 border-4 border-slate-700/50"></div>
      </div>

      {/* Rank skeleton */}
      <div className="absolute top-10 right-10 z-30">
        <div className="w-12 h-12 bg-slate-600/50 rounded-full"></div>
      </div>

      {/* ELO skeleton */}
      <div className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 z-40 bg-slate-900 px-5 py-2 rounded-full border border-slate-700/50">
        <div className="w-16 h-8 bg-slate-600/50 rounded"></div>
      </div>
    </div>

    {/* Contenido skeleton */}
    <div className="text-center pt-10 pb-4 space-y-4">
      {/* Nombre del jugador que sí sabemos */}
      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold text-blue-300">
          {playerInfo?.name || "Cargando..."}
          <span className="text-blue-400">#{playerInfo?.tag || "..."}</span>
        </h2>
        <div className="h-6 bg-slate-600/50 rounded w-24 mx-auto"></div>
      </div>

      {/* Stats skeleton */}
      <div className="flex w-full px-4 gap-4 mt-6">
        <div className="flex flex-col flex-1 bg-slate-700/50 p-4 rounded-xl">
          <div className="h-4 bg-slate-600/50 rounded mb-2"></div>
          <div className="h-8 bg-slate-600/50 rounded"></div>
        </div>
        <div className="flex flex-col flex-1 bg-slate-700/50 p-4 rounded-xl">
          <div className="h-4 bg-slate-600/50 rounded mb-2"></div>
          <div className="h-8 bg-slate-600/50 rounded"></div>
        </div>
      </div>
    </div>

 
  </div>
);


const RANK_COLORS = {
  "Iron 1": "#828282ff",
  "Iron 2": "#828282ff",
  "Iron 3": "#828282ff",
  "Bronze 1": "#7c5522ff",
  "Bronze 2": "#7c5522ff",
  "Bronze 3": "#7c5522ff",
  "Silver 1": "#d1d1d1ff",
  "Silver 2": "#d1d1d1ff",
  "Silver 3": "#d1d1d1ff",
  "Gold 1": "#FFD700",
  "Gold 2": "#FFD700",
  "Gold 3": "#FFD700",
  "Platinum 1": "#00c7c0ff",
  "Platinum 2": "#00c7c0ff",
  "Platinum 3": "#00c7c0ff",
  "Diamond 1": "#eb96f2",
  "Diamond 2": "#eb96f2",
  "Diamond 3": "#eb96f2",
  "Ascendant 1": "#7defb9",
  "Ascendant 2": "#7defb9",
  "Ascendant 3": "#7defb9",
  "Immortal 1": "#ff5551ff",
  "Immortal 2": "#ff5551ff",
  "Immortal 3": "#ff5551ff",
  Radiant: "#ffedaaff",
  Unranked: "#4A5568",
};

const getRankColor = (rankName) => {
  return RANK_COLORS[rankName] || RANK_COLORS["Unranked"];
};

const PlayerCard = ({ playerData, mmrData, isLoading, error, playerInfo }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // Precargar imágenes y agregar delay mínimo
  useEffect(() => {
    if (playerData && !isLoading) {
      const cardImage =
        playerData.card?.wide || playerData.card?.large || DEFAULT_IMAGES.ERROR_CARD;
      const playerAvatar =
        playerData.card?.small || playerData.info?.displayIcon || DEFAULT_IMAGES.DEFAULT_AVATAR;
      const rankImage = mmrData?.images?.large || DEFAULT_IMAGES.UNRANKED_ICON;

      let imagesLoaded = 0;
      const totalImages = 3;

      const checkImagesLoaded = () => {
        imagesLoaded++;
        if (imagesLoaded === totalImages) {
          setImageLoaded(true);
          // Delay mínimo para que se vea el skeleton
          setTimeout(() => {
            setShowContent(true);
          }, 1500);
        }
      };

      // Precargar imágenes
      [cardImage, playerAvatar, rankImage].forEach((src) => {
        const img = new Image();
        img.onload = checkImagesLoaded;
        img.onerror = checkImagesLoaded; // Contar incluso si falla
        img.src = src;
      });
    }
  }, [playerData, mmrData, isLoading]);

  // Mostrar skeleton hasta que todo esté listo
  if (isLoading || !showContent) {
    return <PlayerCardSkeleton playerInfo={playerInfo} />;
  }

  if (error || !playerData) {
    return (
      <div className="bg-red-900/20 border border-red-700/50 rounded-2xl p-8 flex flex-col items-center justify-center shadow-xl">
        <div className="text-center text-red-300">
          <h3 className="text-3xl font-bold mb-4 text-red-200">
            {playerInfo?.name || "Error"}
            <span className="text-red-400">#{playerInfo?.tag || ""}</span>
          </h3>
          <p className="text-lg mb-4">
            ❌ {error || "No se pudieron cargar los datos del jugador."}
          </p>
          <p className="text-sm font-medium">
            Verifica el nombre de usuario y el tag, o intenta de nuevo más tarde.
          </p>
        </div>
      </div>
    );
  }

  const cardImage =
    playerData.card?.wide ||
    playerData.card?.large ||
    DEFAULT_IMAGES.ERROR_CARD;
  const playerAvatar =
    playerData.card?.small ||
    playerData.info?.displayIcon ||
    DEFAULT_IMAGES.DEFAULT_AVATAR;
  const rankImage = mmrData?.images?.large || DEFAULT_IMAGES.UNRANKED_ICON;
  const currentTier = mmrData?.currenttierpatched || "Unranked";
  const elo = mmrData?.elo || "N/A";
  const logoColor = getRankColor(currentTier);

  const cardHoverStyle = {
    "--rank-color": logoColor,
    "--rank-shadow": `${logoColor}40`,
  };

  return (
    <div
      className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg relative pb-4 group animate-fade-in-up"
      style={cardHoverStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = logoColor;
        e.currentTarget.style.boxShadow = `0 20px 25px -5px ${logoColor}40, 0 10px 10px -5px ${logoColor}20`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#374151";
        e.currentTarget.style.boxShadow = "";
      }}
    >
      {/* Contenedor de la imagen de fondo y el degradado */}
      <div className="relative h-52">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 brightness-110 group-hover:opacity-30 transition-opacity"
          style={{ backgroundImage: `url(${cardImage})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/40"></div>

        {/* Logo Spectrum decorativo */}
        <div className="absolute -top-5 right-[-20px] transform translate-x-1/2 z-10 opacity-10 group-hover:opacity-20 transition-opacity">
          <SpectrumLogo className="w-56 h-56 object-contain" fill={logoColor} stroke={logoColor} />
        </div>

        {/* Avatar del jugador */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
          <img
            src={playerAvatar}
            alt={`${playerData.name} avatar`}
            className="w-32 h-32 rounded-full border-4 border-slate-800 object-cover ring-4 shadow-2xl group-hover:scale-110 transition-transform duration-300"
            style={{
              "--tw-ring-color": logoColor,
              borderColor: logoColor + "90",
              boxShadow: `0 25px 50px -12px ${logoColor}90`,
            }}
            loading="lazy"
            onError={(e) => {
              e.target.src = DEFAULT_IMAGES.DEFAULT_AVATAR;
            }}
          />
        </div>

        {/* Rank Image */}
        <div className="absolute top-10 left-[245px] z-30 transform -translate-x-[calc(100%+30px)] -translate-y-1/2 group-hover:scale-110 transition-transform duration-300">
          <img
            src={rankImage}
            alt={`${currentTier} rank`}
            className="w-12 h-12 object-contain"
            loading="lazy"
            onError={(e) => {
              e.target.src = DEFAULT_IMAGES.UNRANKED_ICON;
            }}
          />
        </div>

        {/* ELO */}
        <div
          className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 z-40 bg-slate-900 px-5 py-2 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300"
          style={{
            borderColor: logoColor,
            borderWidth: "1px",
            boxShadow: `0 10px 15px -3px ${logoColor}40`,
          }}
        >
          <span
            className="text-4xl font-extrabold group-hover:animate-pulse"
            style={{
              color: logoColor,
              textShadow: `0 0 8px ${logoColor}60`,
              filter: `drop-shadow(0 0 6px ${logoColor}80)`,
            }}
          >
            {elo}
          </span>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="text-center pt-10 pb-4 relative z-10">
        <h2 className="text-3xl font-extrabold text-slate-100 group-hover:scale-105 transition-transform duration-300">
          {playerData.name}
          <span className="ml-1" style={{ color: logoColor }}>
            #{playerData.tag}
          </span>
        </h2>
        <p className="text-md text-slate-400 mt-1 mb-4 group-hover:text-slate-300 transition-colors">
          {currentTier}
        </p>

        <div className="flex w-full px-4 gap-4 mt-6">
          <div
            className="flex flex-col flex-1 bg-slate-800 p-4 rounded-xl border border-slate-700 transition-all duration-300 group-hover:bg-slate-700 group-hover:scale-105"
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = logoColor + "80";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#374151";
            }}
          >
            <span className="block text-sm text-slate-400 uppercase tracking-wider mb-1">
              Nivel
            </span>
            <span className="text-2xl font-bold" style={{ color: logoColor }}>
              {playerData.account_level || 0}
            </span>
          </div>

          <div
            className="flex flex-col flex-1 bg-slate-800 p-4 rounded-xl border border-slate-700 transition-all duration-300 group-hover:bg-slate-700 group-hover:scale-105"
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = logoColor + "80";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#374151";
            }}
          >
            <span className="block text-sm text-slate-400 uppercase tracking-wider mb-1">
              Región
            </span>
            <span className="text-2xl font-bold" style={{ color: logoColor }}>
              {playerData.region?.toUpperCase() || "N/A"}
            </span>
          </div>
        </div>

        {/* Logos decorativos */}
        <div className="absolute bottom-[-32px] left-[-15px] transform -translate-x-1/2 z-0 opacity-10 rotate-180 group-hover:opacity-20 transition-opacity">
          <SpectrumLogo className="w-48 h-48 object-contain" fill={logoColor} stroke={logoColor} strokeWidth="1" />
        </div>
        <div className="absolute bottom-[-32px] right-[-200px] transform -translate-x-1/2 z-0 opacity-10 rotate-180 group-hover:opacity-20 transition-opacity">
          <SpectrumLogo className="w-48 h-48 object-contain" fill={logoColor} stroke={logoColor} strokeWidth="1" />
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
