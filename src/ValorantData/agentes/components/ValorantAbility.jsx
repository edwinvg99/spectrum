// ValorantAbility.jsx - Con lazy loading
import React, { useState } from 'react';

export default function ValorantAbility({ habilidad }) {
  const [iconLoaded, setIconLoaded] = useState(false);

  return (
    <div className="flex flex-row w-10 h-10 rounded-md bg-slate-700 relative">
      {/* Skeleton del icono */}
      {!iconLoaded && (
        <div className="absolute inset-0 bg-slate-600/50 rounded-md animate-pulse"></div>
      )}
      
      {/* Icono de habilidad */}
      <img
        src={habilidad.icono}
        alt={habilidad.nombre}
        className={`w-auto h-auto transition-opacity duration-300 ${iconLoaded ? 'opacity-100' : 'opacity-0'}`}
        loading="lazy"
        onLoad={() => setIconLoaded(true)}
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/40x40/475569/ffffff?text=?';
          setIconLoaded(true);
        }}
      />
    </div>
  );
}