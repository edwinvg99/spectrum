import React from 'react';

// Componente principal del encabezado
const HeaderSection = ({ 
  serverStatus, 
  cacheStatus, 
  isUpdatingCache, 
  loadingState, 
  onRefresh, 
  onClearCache 
}) => {
  return (
    <header className="relative flex flex-col items-center justify-center  text-center ">
      <div className="mb-12">
        {/* <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4 tracking-tight leading-tight">
          VALORANT STATS
        </h1> */}
 <p className="texto-integrantes mt-5 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text ">
  Estadísticas en tiempo real de nuestros jugadores.
</p>
      </div>

      {/* Caja de Métricas y Controles - Flotante/Compacta */}
      <div className="flex justify-center  lg:bottom-16 w-full  mb-10">
        <div className="bg-gray-800/70 backdrop-blur-md border  rounded-2xl p-6 shadow-lg  shadow-cyan-500/20 flex flex-col lg:flex-row items-center gap-6 max-w-fit mx-auto">
          {/* Contenedor de Status (Server y Cache) */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {serverStatus && (
              <ServerStatus status={serverStatus} />
            )}
            {cacheStatus && cacheStatus.hasCache && (
              <CacheStatus cacheStatus={cacheStatus} isUpdatingCache={isUpdatingCache} />
            )}
          </div>
          
          {/* Botones de Control */}
          <ControlButtons 
            loadingState={loadingState}
            onRefresh={onRefresh}
            onClearCache={onClearCache}
            hasCache={cacheStatus?.hasCache}
          />
        </div>
      </div>
    </header>
  );
};

// ---

// Componente para el estado del servidor (mantenido similar, ajustes mínimos de tamaño)
const ServerStatus = ({ status }) => (
  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs border transition-all duration-200 ${
    status.status === 'OK' 
      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-emerald-500/10' 
      : 'bg-red-500/10 text-red-400 border-red-500/30 shadow-red-500/10'
  }`}>
    <div className={`w-2 h-2 rounded-full ${
      status.status === 'OK' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400 animate-pulse'
    }`}></div>
    <span className="font-bold">
      {status.status === 'OK' ? 'SERVER ONLINE' : 'SERVER OFFLINE'}
    </span>
  </div>
);

// ---

// Componente para el estado del caché (mantenido similar, ajustes mínimos de tamaño)
const CacheStatus = ({ cacheStatus, isUpdatingCache }) => (
  <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs border transition-all duration-200 ${
    cacheStatus.isStale 
      ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' 
      : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
  }`}>
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 1.79 4 4 4h8c0 0 0 0 0 0 2.21 0 4-1.79 4-4V7c0-2.21-1.79-4-4-4H8c-2.21 0-4 1.79-4 4z" />
    </svg>
    <span>
      Caché: {cacheStatus.lastUpdate ? new Date(cacheStatus.lastUpdate).toLocaleTimeString() : 'N/A'} 
      {isUpdatingCache && ' (actualizando...)'}
    </span>
  </div>
);

// ---

// Componente para los botones de control (mantenido similar, ajustes mínimos de tamaño/padding)
const ControlButtons = ({ loadingState, onRefresh, onClearCache, hasCache }) => (
  <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0"> {/* Agregamos margen superior en móviles */}
    <button 
      className="group  hover:from-blue-500 hover:to-purple-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm uppercase tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none border border-blue-500/20"
      onClick={() => onRefresh(true)}
      disabled={loadingState === 'loading'}
    >
      <span className="flex items-center gap-2">
        {loadingState === 'loading' ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Actualizando...
          </>
        ) : (
          <>
            <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Forzar Actualización
          </>
        )}
      </span>
    </button>

    {hasCache && (
      <button 
        className=" text-white  rounded-xl font-bold text-sm uppercase tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none border border-blue-500/20"
        onClick={onClearCache}
      >
        Limpiar Caché
      </button>
    )}
  </div>
);

export default HeaderSection;