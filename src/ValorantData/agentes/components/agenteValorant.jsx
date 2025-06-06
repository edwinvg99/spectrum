// agenteValorant.jsx - Con carga progresiva
import React, { useState, useEffect } from 'react';
import { usePersonajes } from "../hooks/usePersonajes";
import AgentCard from "./AgentCard";
import { AgentsLoadingSkeleton } from "../../../sharred/loadingSkeletons";

export default function PersonajesValorant() {
  const { personajes, cargando, error } = usePersonajes();
  const [showCards, setShowCards] = useState(false);
  const [cardsToShow, setCardsToShow] = useState(0);

  // Mostrar cards progresivamente
  useEffect(() => {
    if (!cargando && personajes.length > 0) {
      const timer = setTimeout(() => {
        setShowCards(true);
        
        // Mostrar cards de 2 en 2 cada 300ms
        const interval = setInterval(() => {
          setCardsToShow(prev => {
            if (prev >= personajes.length) {
              clearInterval(interval);
              return prev;
            }
            return prev + 2;
          });
        }, 300);

        return () => clearInterval(interval);
      }, 1000); // Esperar 1 segundo antes de empezar a mostrar cards

      return () => clearTimeout(timer);
    }
  }, [cargando, personajes.length]);

  if (cargando || !showCards) {
    return <AgentsLoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 text-center max-w-md">
          <svg className="w-16 h-16 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-400 text-lg font-semibold">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')] bg-repeat">
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-wrap justify-center gap-6 p-6 max-w-7xl">
          {personajes.slice(0, cardsToShow).map((agente, idx) => (
            <div
              key={idx}
              className="animate-fade-in-up"
              style={{
                animationDelay: `${(idx % 2) * 100}ms`,
                animationFillMode: 'both'
              }}
            >
              <AgentCard agente={agente} />
            </div>
          ))}
          
          {/* Mostrar skeletons para las cards que faltan */}
          {cardsToShow < personajes.length && 
            [...Array(Math.min(2, personajes.length - cardsToShow))].map((_, idx) => (
              <div key={`skeleton-${idx}`} className="w-96 relative overflow-hidden border border-slate-700/50 bg-[#0F1923] min-h-[320px] rounded-xl animate-pulse">
                <div className="absolute inset-0 bg-slate-700/30 rounded-xl"></div>
                <div className="w-full min-h-96 flex flex-col justify-center gap-2 m-5 relative z-20">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="flex flex-row w-10 h-10 rounded-md bg-slate-600/50"></div>
                  ))}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-64 bg-slate-600/30 rounded-b-xl"></div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}
