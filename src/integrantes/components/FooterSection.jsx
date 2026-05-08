import React from 'react';

const FooterSection = ({ cacheStatus }) => {
  return (
    <footer className="text-center border-t border-slate-800 pt-8">
      <div className="flex flex-col items-center gap-3">
        <p className="text-slate-500 text-sm font-medium">
          Datos proporcionados por 
          <span className="text-slate-400 font-semibold ml-1">Henrik Dev API</span>
        </p>
        
        <CacheInfo cacheStatus={cacheStatus} />
      </div>
    </footer>
  );
};

const CacheInfo = ({ cacheStatus }) => {
  const nextUpdateMs = cacheStatus?.nextUpdateIn || 0;
  const nextH = Math.floor(nextUpdateMs / 3600000);
  const nextM = Math.round((nextUpdateMs % 3600000) / 60000);
  const nextLabel = nextH > 0 ? `${nextH}h ${nextM}m` : `${nextM}m`;

  return (
    <div className="flex items-center gap-4 text-slate-600 text-xs">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        <span>Caché 24h activo</span>
      </div>
      {cacheStatus?.hasCache && nextUpdateMs > 0 && (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full" />
          <span>Próxima actualización: {nextLabel}</span>
        </div>
      )}
      {cacheStatus?.hasCache && nextUpdateMs <= 0 && (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
          <span>Actualizando en segundo plano…</span>
        </div>
      )}
    </div>
  );
};

export default FooterSection;