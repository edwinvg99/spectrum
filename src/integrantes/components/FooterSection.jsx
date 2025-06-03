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

// Componente para mostrar información del caché
const CacheInfo = ({ cacheStatus }) => (
  <div className="flex items-center gap-4 text-slate-600 text-xs">
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
      <span>Caché inteligente activo</span>
    </div>
    
    {cacheStatus?.hasCache && (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        <span>
          Próxima actualización: {Math.round(cacheStatus.nextUpdateIn / 1000)}s
        </span>
      </div>
    )}
  </div>
);

export default FooterSection;