import React from 'react';

const ErrorDisplay = ({ title, message, details, onRetry }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-8">
      <div className="text-center p-12 bg-red-500/10 border-2 border-red-500/30 rounded-2xl text-red-400 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">🚫 {title}</h2>
        <p className="text-lg mb-4">{message}</p>
        {details && (
          <p className="mb-6">
            <code className="bg-black/30 px-2 py-1 rounded text-sm font-mono">
              {details}
            </code>
          </p>
        )}
        <button 
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
          onClick={onRetry}
        >
          Reintentar Conexión
        </button>
      </div>
    </div>
  );
};

export default ErrorDisplay;