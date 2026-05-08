// src/shared/loadingSkeletons.jsx - Unified loading components
import React from 'react';
import SpectrumLogo from "../assets/images/spectrumLOGO.svg?react";

// Animated logo for all loading screens
const AnimatedSpectrumLogo = ({ size = "w-16 h-16" }) => (
  <div className="relative flex items-center justify-center">
    <div className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-spectrum-cyan/15 via-spectrum-purple/15 to-spectrum-blue/15 blur-xl animate-glow-pulse"></div>
    <SpectrumLogo
      className={`${size} object-contain relative z-10 animate-spin-slow`}
      fill="url(#loadingSpectrumGradient)"
      stroke="rgba(0, 247, 255, 0.3)"
      strokeWidth="0.5"
    />
    <svg width="0" height="0" className="absolute">
      <defs>
        <linearGradient id="loadingSpectrumGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f7ff" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

// Reusable centered loading overlay
const LoadingOverlay = ({ message, showProgress = false }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
    <AnimatedSpectrumLogo size="w-16 h-16" />
    <p className="text-base text-slate-300 mt-5 font-medium">{message}</p>
    {showProgress && (
      <div className="w-48 h-1 bg-slate-800 rounded-full mt-3 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-spectrum-cyan to-spectrum-purple rounded-full animate-pulse-width"></div>
      </div>
    )}
  </div>
);

// Shimmer block component
const ShimmerBlock = ({ className = "" }) => (
  <div className={`bg-slate-700/30 rounded-lg shimmer ${className}`}></div>
);

// Store skeleton
export const StoreLoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-spectrum-darker via-slate-900 to-spectrum-darker py-24 px-4 lg:px-8 flex items-center justify-center">
    <div className="max-w-7xl mx-auto relative w-full">
      <LoadingOverlay message="Cargando tienda..." />
      <div className="bg-slate-800/40 border border-slate-700/30 rounded-2xl p-8 lg:p-12 relative z-10 opacity-30">
        <div className="text-center mb-8">
          <ShimmerBlock className="h-10 mb-4 max-w-md mx-auto" />
          <ShimmerBlock className="h-5 max-w-sm mx-auto" />
        </div>
        <div className="bg-slate-800/30 p-5 rounded-xl border border-slate-700/20 mb-6">
          <div className="flex items-center justify-between">
            <ShimmerBlock className="h-7 w-40" />
            <ShimmerBlock className="h-10 w-28 rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/15">
              <ShimmerBlock className="w-14 h-14 mx-auto mb-3 rounded-lg" />
              <ShimmerBlock className="h-3.5 mb-2" />
              <ShimmerBlock className="h-3 w-3/4 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Maps skeleton
export const MapsLoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-spectrum-darker via-slate-900 to-spectrum-darker py-24 px-4 lg:px-8 flex items-center justify-center">
    <div className="max-w-7xl mx-auto relative w-full">
      <LoadingOverlay message="Cargando mapas..." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 opacity-30">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-slate-800/40 border border-slate-700/30 rounded-xl overflow-hidden h-72">
            <div className="h-full w-full shimmer bg-slate-700/20"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Agents skeleton
export const AgentsLoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-spectrum-darker via-slate-900 to-spectrum-darker py-24 px-4 lg:px-8 flex items-center justify-center">
    <div className="max-w-7xl mx-auto relative w-full">
      <LoadingOverlay message="Cargando agentes..." showProgress />
      <div className="flex flex-wrap justify-center gap-5 relative z-10 opacity-30">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="w-80 bg-spectrum-dark border border-slate-700/30 rounded-xl overflow-hidden h-80">
            <div className="p-4 space-y-2">
              {[...Array(4)].map((_, j) => (
                <ShimmerBlock key={j} className="w-9 h-9 rounded-md" />
              ))}
            </div>
            <div className="absolute bottom-0 inset-x-0 h-48 bg-slate-700/15 shimmer"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// News skeleton
export const NewsLoadingSkeleton = () => (
  <div className="space-y-4 p-2">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="bg-slate-800/40 border border-slate-700/20 rounded-lg p-4">
        <ShimmerBlock className="h-5 mb-2 w-4/5" />
        <ShimmerBlock className="h-3.5 mb-1.5 w-full" />
        <ShimmerBlock className="h-3.5 w-2/3" />
        <div className="flex justify-between mt-3">
          <ShimmerBlock className="h-3 w-24" />
          <ShimmerBlock className="h-3 w-16" />
        </div>
      </div>
    ))}
  </div>
);

// Playlist skeleton
export const PlaylistLoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-spectrum-darker via-slate-900 to-spectrum-darker py-24 px-4 lg:px-8 flex items-center justify-center">
    <div className="max-w-7xl mx-auto relative w-full">
      <LoadingOverlay message="Cargando playlist..." />
      <div className="bg-slate-800/40 border border-slate-700/30 rounded-2xl p-8 lg:p-12 relative z-10 opacity-30">
        <div className="flex justify-center mb-8">
          <div className="flex gap-3 bg-slate-900/50 rounded-xl p-2">
            <ShimmerBlock className="h-12 w-28 rounded-lg" />
            <ShimmerBlock className="h-12 w-28 rounded-lg" />
          </div>
        </div>
        <div className="aspect-video bg-slate-700/20 rounded-xl shimmer mb-6"></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-800/30 rounded-lg p-3 text-center">
              <ShimmerBlock className="w-7 h-7 mx-auto mb-2 rounded" />
              <ShimmerBlock className="h-5 w-2/3 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Integrantes skeleton
export const IntegrantesLoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-spectrum-darker via-slate-900 to-spectrum-darker py-24 px-4 lg:px-8 flex items-center justify-center">
    <div className="max-w-7xl mx-auto relative w-full">
      <LoadingOverlay message="Preparando datos del clan..." showProgress />
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10 opacity-25">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-slate-800/40 rounded-xl border border-slate-700/20 p-6">
            <div className="relative h-44 mb-4">
              <div className="absolute inset-0 bg-slate-700/20 rounded-lg shimmer"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-slate-700/30"></div>
            </div>
            <div className="text-center pt-6 space-y-3">
              <ShimmerBlock className="h-7 w-3/4 mx-auto" />
              <ShimmerBlock className="h-5 w-1/2 mx-auto" />
              <div className="flex gap-3 mt-4">
                <ShimmerBlock className="flex-1 h-14 rounded-lg" />
                <ShimmerBlock className="flex-1 h-14 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Arsenal skeleton
export const ArsenalLoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-spectrum-darker via-slate-900 to-spectrum-darker py-24 px-4 lg:px-8 flex items-center justify-center">
    <div className="max-w-7xl mx-auto relative w-full">
      <LoadingOverlay message="Cargando arsenal..." showProgress />
      {/* Filter tabs placeholder */}
      <div className="flex justify-center mb-8 relative z-10 opacity-30">
        <div className="flex gap-2 bg-slate-800/30 rounded-xl p-1.5">
          {[...Array(7)].map((_, i) => (
            <ShimmerBlock key={i} className="h-8 w-20 rounded-lg" />
          ))}
        </div>
      </div>
      {/* Weapon cards placeholder */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 relative z-10 opacity-30">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="bg-spectrum-dark border border-slate-700/30 rounded-xl overflow-hidden">
            <div className="h-32 bg-slate-700/15 shimmer" />
            <div className="p-4 space-y-2">
              <ShimmerBlock className="h-4 w-3/4" />
              <ShimmerBlock className="h-3 w-1/2" />
              <div className="space-y-1.5 mt-3">
                <ShimmerBlock className="h-1.5 w-full rounded-full" />
                <ShimmerBlock className="h-1.5 w-full rounded-full" />
                <ShimmerBlock className="h-1.5 w-4/5 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Generic loading skeleton
export const GenericLoadingSkeleton = ({ message = "Cargando contenido..." }) => (
  <div className="min-h-screen bg-gradient-to-br from-spectrum-darker via-slate-900 to-spectrum-darker flex items-center justify-center py-24 px-4">
    <div className="text-center">
      <AnimatedSpectrumLogo size="w-20 h-20" />
      <p className="text-lg text-slate-300 mt-6 font-medium">{message}</p>
      <div className="flex justify-center gap-1.5 mt-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 bg-spectrum-cyan/60 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          ></div>
        ))}
      </div>
    </div>
  </div>
);
