// src/components/LoadingComponents.jsx - Componentes de carga unificados
import React from 'react';
import SpectrumLogo from "../assets/images/spectrumLOGO.svg?react";

// 🎯 Logo animado base para todos los loadings
const AnimatedSpectrumLogo = ({ size = "w-16 h-16" }) => (
    <div className="relative flex items-center justify-center">
        {/* Glow effect animado que sigue el tamaño del logo */}
        <div className="absolute inset-0 m-auto rounded-full bg-gradient-to-br from-purple-500/60 via-blue-500/60 to-teal-500/60 opacity-75 blur-xl animate-pulse-slow z-0" style={{ width: `calc(${size} * 1.5)`, height: `calc(${size} * 1.5)` }}></div>
        
        {/* Logo SVG con rotación aplicada directamente al SVG */}
        <SpectrumLogo
            className={`${size} object-contain relative z-10 animate-spin`} // Aplicar animate-spin directamente al SVG
            fill="url(#loadingSpectrumGradient)"
            stroke="rgba(132, 215, 203, 0.8)"
            strokeWidth="1"
        />
        
        {/* SVG Gradient para loading (puede ser ocultado con h-0 w-0 o absolute fuera de la vista) */}
        <svg width="0" height="0" className="absolute">
            <defs>
                <linearGradient id="loadingSpectrumGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#84d7cb" />
                    <stop offset="50%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
            </defs>
        </svg>
    </div>
);

// 🛍️ Loading para la Tienda
export const StoreLoadingSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-24 px-4 lg:px-8 flex items-center justify-center">
        <div className="max-w-7xl mx-auto relative w-full h-full"> {/* Contenedor relative para el logo y skeleton */}
            {/* Logo central animado - Posicionado absolutamente para estar encima */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20"> {/* z-index alto para el logo */}
                <AnimatedSpectrumLogo size="w-20 h-20" />
                <p className="text-xl text-white mt-6 animate-pulse">Cargando tienda de Valorant...</p>
            </div>

            {/* Skeleton del contenido - Asegúrate de que tenga un z-index menor o no tenga z-index explícito */}
            <div className="bg-slate-800/70 backdrop-blur-md border border-slate-700/50 rounded-3xl p-8 lg:p-12 shadow-2xl relative z-10 opacity-40"> {/* Opacidad para que el skeleton sea visible pero el logo resalte */}
                {/* Título skeleton */}
                <div className="text-center mb-8">
                    <div className="h-12 bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-lg mb-4 animate-pulse"></div>
                    <div className="h-6 bg-slate-700/30 rounded-lg max-w-2xl mx-auto animate-pulse"></div>
                </div>

                {/* Precio skeleton */}
                <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-6 rounded-2xl border border-purple-500/20 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="h-8 w-48 bg-slate-600/50 rounded-lg animate-pulse"></div>
                        <div className="h-12 w-32 bg-slate-600/50 rounded-xl animate-pulse"></div>
                    </div>
                </div>

                {/* Grid skeleton */}
                <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-700">
                    <div className="h-8 w-64 bg-slate-600/50 rounded-lg mb-6 mx-auto animate-pulse"></div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-6">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="bg-slate-800/50 rounded-xl p-4 border border-slate-600/20 animate-pulse">
                                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-slate-600/50 rounded-lg mx-auto mb-3"></div>
                                <div className="h-4 bg-slate-600/50 rounded mb-2"></div>
                                <div className="h-3 bg-slate-600/30 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
);



export const MapsLoadingSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-24 px-4 lg:px-8 flex items-center justify-center">
        <div className="max-w-7xl mx-auto relative w-full h-full">
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                <AnimatedSpectrumLogo size="w-20 h-20" />
                <p className="text-xl text-white mt-6 animate-pulse">Cargando mapas de Valorant...</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10 opacity-40">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-slate-800/70 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 shadow-2xl animate-pulse">
                        <div className="h-48 bg-slate-600/50 rounded-2xl mb-6"></div>
                        <div className="h-8 bg-slate-600/50 rounded-lg mb-4"></div>
                        <div className="space-y-4">
                            <div className="h-6 bg-slate-600/30 rounded w-2/3"></div>
                            <div className="flex gap-2">
                                {[...Array(5)].map((_, j) => (
                                    <div key={j} className="w-12 h-12 bg-slate-600/50 rounded-full"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);



// loadingSkeletons.jsx - Skeleton mejorado para agentes
export const AgentsLoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-24 px-4 lg:px-8 flex items-center justify-center">
    <div className="max-w-7xl mx-auto relative w-full h-full">
      {/* Logo central animado */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <AnimatedSpectrumLogo size="w-20 h-20" />
        <p className="text-xl text-white mt-6 animate-pulse">Cargando agentes de Valorant...</p>
        
        {/* Barra de progreso simulada */}
        <div className="w-64 h-2 bg-slate-700 rounded-full mt-4 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse-width"></div>
        </div>
      </div>

      {/* Grid de cards skeleton */}
      <div className="flex flex-wrap justify-center gap-6 p-6 max-w-7xl relative z-10 opacity-40">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="w-96 relative overflow-hidden border border-slate-700/50 bg-[#0F1923] min-h-[320px] rounded-xl animate-pulse">
            {/* Fondo skeleton */}
            <div className="absolute inset-0 bg-slate-700/30 rounded-xl"></div>
            
            {/* Skeleton de habilidades */}
            <div className="w-full min-h-96 flex flex-col justify-center gap-2 m-5 relative z-20">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="flex flex-row w-10 h-10 rounded-md bg-slate-600/50"></div>
              ))}
            </div>
            
            {/* Skeleton de imagen del agente */}
            <div className="absolute bottom-0 left-0 right-0 h-64 bg-slate-600/30 rounded-b-xl"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);



export const NewsLoadingSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-24 px-4 lg:px-8 flex items-center justify-center">
        <div className="max-w-7xl mx-auto relative w-full h-full">
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                <AnimatedSpectrumLogo size="w-20 h-20" />
                <p className="text-xl text-white mt-6 animate-pulse">Cargando noticias de Valorant...</p>
            </div>

            <div className="space-y-8 relative z-10 opacity-40">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-slate-800/70 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-xl animate-pulse">
                        <div className="flex flex-col lg:flex-row gap-6">
                            <div className="w-full lg:w-64 h-48 bg-slate-600/50 rounded-xl flex-shrink-0"></div>
                            <div className="flex-grow space-y-4">
                                <div className="h-8 bg-slate-600/50 rounded-lg"></div>
                                <div className="h-6 bg-slate-600/30 rounded-lg w-2/3"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-slate-600/30 rounded"></div>
                                    <div className="h-4 bg-slate-600/30 rounded w-5/6"></div>
                                    <div className="h-4 bg-slate-600/30 rounded w-4/6"></div>
                                </div>
                                <div className="h-10 bg-slate-600/50 rounded-lg w-32"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);



export const PlaylistLoadingSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-24 px-4 lg:px-8 flex items-center justify-center">
        <div className="max-w-7xl mx-auto relative w-full h-full">
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                <AnimatedSpectrumLogo size="w-20 h-20" />
                <p className="text-xl text-white mt-6 animate-pulse">Cargando playlist de jugadas...</p>
            </div>

            <div className="bg-slate-800/70 backdrop-blur-md border border-slate-700/50 rounded-3xl p-8 lg:p-12 shadow-2xl relative z-10 opacity-40">
                <div className="flex justify-center mb-8">
                    <div className="flex gap-4 bg-slate-900/50 rounded-2xl p-3">
                        <div className="h-16 w-32 bg-slate-600/50 rounded-xl animate-pulse"></div>
                        <div className="h-16 w-32 bg-slate-600/50 rounded-xl animate-pulse"></div>
                    </div>
                </div>

                <div className="bg-slate-900/50 rounded-2xl p-6 mb-8">
                    <div className="h-8 bg-slate-600/50 rounded-lg mb-6 w-2/3 mx-auto animate-pulse"></div>
                    <div className="aspect-video bg-slate-600/50 rounded-xl animate-pulse"></div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-slate-800/50 rounded-xl p-4 text-center animate-pulse">
                            <div className="w-8 h-8 bg-slate-600/50 rounded mx-auto mb-2"></div>
                            <div className="h-6 bg-slate-600/50 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);



// loadingSkeletons.jsx - Skeleton optimizado para integrantes
export const IntegrantesLoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-24 px-4 lg:px-8 flex items-center justify-center">
    <div className="max-w-7xl mx-auto relative w-full h-full">
      {/* Logo central animado */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <AnimatedSpectrumLogo size="w-20 h-20" />
        <p className="text-xl text-white mt-6 animate-pulse">Preparando datos del clan...</p>
        
        {/* Progress bar */}
        <div className="w-64 h-2 bg-slate-700 rounded-full mt-4 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse-width"></div>
        </div>
        
        <p className="text-sm text-slate-400 mt-3 animate-pulse">
          Conectando con la API de Valorant...
        </p>
      </div>

      {/* Grid skeleton de fondo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 relative z-10 opacity-30">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-slate-800/60 rounded-2xl border border-slate-700/50 p-8 shadow-xl animate-pulse">
            <div className="relative h-52 mb-4">
              <div className="absolute inset-0 bg-slate-700/30 rounded-xl"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-slate-600/50"></div>
              <div className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 w-16 h-8 bg-slate-600/50 rounded-full"></div>
            </div>
            <div className="text-center pt-10 pb-4 space-y-4">
              <div className="h-8 bg-slate-600/50 rounded w-3/4 mx-auto"></div>
              <div className="h-6 bg-slate-600/30 rounded w-1/2 mx-auto"></div>
              <div className="flex gap-4 mt-6">
                <div className="flex-1 h-16 bg-slate-700/50 rounded-xl"></div>
                <div className="flex-1 h-16 bg-slate-700/50 rounded-xl"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);



export const GenericLoadingSkeleton = ({ message = "Cargando contenido..." }) => (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center py-24 px-4 relative">
        <div className="text-center relative z-20"> {/* Logo y mensaje elevados */}
            <AnimatedSpectrumLogo size="w-24 h-24" />
            <p className="text-2xl text-white mt-8 animate-pulse">{message}</p>
            
            {/* Puntos animados */}
            <div className="flex justify-center gap-2 mt-6">
                {[...Array(3)].map((_, i) => (
                    <div 
                        key={i} 
                        className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.2}s` }}
                    ></div>
                ))}
            </div>
        </div>
        {/* Este es un skeleton genérico, no tiene un esqueleto de contenido específico detrás. 
            Si quisieras agregar un skeleton de fondo, lo harías aquí con z-10 y opacidad. */}
    </div>
);