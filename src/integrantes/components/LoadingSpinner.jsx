import React from 'react';

const LoadingSpinner = ({ message = "Cargando datos de jugadores..." }) => {
  return (
    <div className="flex min-w-full items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-slate-600 border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
        <div className="text-xl font-semibold text-slate-300">{message}</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;