import React from "react";
import { DEFAULT_IMAGES } from "../../../server/utils/constants";

const PlayerCard = ({ playerData, mmrData, isLoading, error, playerInfo }) => {
  if (isLoading) {
    return (
      <div className="bg-slate-800/60 rounded-2xl border border-slate-700/50 p-8 flex flex-col items-center justify-center shadow-xl animate-pulse">
        <div className="text-center text-slate-400">
          <div className="w-16 h-16 border-4 border-slate-500/50 border-t-blue-400 rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-xl font-semibold mb-2">Cargando datos para</p>
          <p className="text-2xl font-bold text-blue-300">
            {playerInfo?.name || "Jugador"}
            <span className="text-slate-400">#{playerInfo?.tag || "TAG"}</span>
          </p>
        </div>
      </div>
    );
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
            Verifica el nombre de usuario y el tag, o intenta de nuevo más
            tarde.
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

  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 hover:border-blue-500 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-500 relative">
      {/* Imagen de fondo del card */}
      <div
        className="h-52 bg-cover bg-center opacity-20 brightness-110"
        style={{ backgroundImage: `url(${cardImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/100"></div>
      </div>

      {/* Avatar */}
      <div className="absolute top-11 left-1/2 transform -translate-x-1/2 z-20">
        <img
          src={playerAvatar}
          alt={`${playerData.name} avatar`}
          className="w-28 h-28 rounded-full border-4 border-slate-800  object-cover ring-4 ring-purple-400/30 shadow-xl  shadow-sky-400"
          onError={(e) => {
            e.target.src = DEFAULT_IMAGES.DEFAULT_AVATAR;
          }}
        />
      </div>

      {/* ELO y Rango */}
      <div className="contenedor-elo absolute left-1/2 transform -translate-x-1/2 z-20">
        <span className="sombra-elo text-4xl  inline-block  text-slate-900 px-4 py-1 rounded-md font-extrabold">
          {elo}
        </span>
      </div>

      <div className="absolute top-5 left-[-10px] transform -translate-x-1/2 z-20 ">
        <img
          src={rankImage}
          alt={`${currentTier} rank`}
          className="w-50 h-50  rounded-xl object-contain opacity-30 "
          onError={(e) => {
            e.target.src = DEFAULT_IMAGES.UNRANKED_ICON;
          }}
        />
      </div>
            <div className="absolute top-10 left-56 transform -translate-x-1/2 z-20  ">
        <img
          src={rankImage}
          alt={`${currentTier} rank`}
          className="w-10 h-10  rounded-xl object-contain "
          onError={(e) => {
            e.target.src = DEFAULT_IMAGES.UNRANKED_ICON;
          }}
        />
      </div>

      {/* Contenido principal */}
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-slate-100">
          {playerData.name}
          <span className="ml-1 text-blue-400">#{playerData.tag}</span>
        </h2>

        <div className="flex  w-full flex-row justify-center">
          <div className="flex w-1/2 flex-col  bg-slate-800 p-4 rounded-xl border border-slate-700 hover:bg-slate-700 transition">
            <span className="block text-sm text-slate-400 uppercase tracking-wider mb-1">
              Nivel
            </span>
            <span className="text-2xl font-bold text-blue-300">
              {playerData.account_level || 0}
            </span>
          </div>

          <div className="flex  flex-col w-1/2 bg-slate-800 p-4 rounded-xl border border-slate-700 hover:bg-slate-700 transition">
            <span className="block text-sm text-slate-400 uppercase tracking-wider mb-1">
              Región
            </span>
            <span className="text-2xl font-bold text-blue-300">
              {playerData.region?.toUpperCase() || "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
