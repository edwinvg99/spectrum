// src/components/MapCard.jsx
import React from 'react';
import { useAgentComposition } from "../hooks/useAgentComposition";

// Componente Skeleton para las imágenes de agente
const AgentSkeleton = () => (
    <div className="w-10 h-10 rounded-full bg-slate-700 animate-pulse border-2 border-slate-600/50"></div>
);

export default function MapCard({ mapa }) {
    const { composition, loadingComposition, compositionError } = useAgentComposition(mapa.nombre);

    // Función auxiliar para obtener el slug del mapa
    const getMapSlug = (nombreMapa) => {
        return nombreMapa.toLowerCase().replace(/\s+/g, "-");
    };

    // Nueva función para obtener el slug del agente
    const getAgentSlug = (nombreAgente) => {
        return nombreAgente.toLowerCase().replace(/[^a-z0-9]/g, '');
    };

    const mapSlug = getMapSlug(mapa.nombre);

    const lineupUrlMapOnly = `https://blitz.gg/valorant/lineups?map=${mapSlug}`;

    return (
        <div
            className="group relative overflow-hidden border border-slate-700/50 backdrop-blur-md transition-all duration-700 ease-in-out w-full h-[550px] rounded-xl hover:scale-105 hover:shadow-2xl"
            style={{
                backgroundImage: `url(${mapa.fondo})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* Imagen de fondo de carga que aparece en hover y ocupa toda la card */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out z-50 rounded-xl"
                style={{
                    backgroundImage: `url(${mapa.fondoCarga})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                {/* Overlay con gradiente para mejor legibilidad */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-xl"></div>

                {/* Nombre del mapa que aparece junto con el fondo de carga */}
                <div className="absolute top-8 left-8 z-10 transform ">
                    <h2 className="nombre-mapa text-4xl sm:text-5xl font-black text-white ">
                        {mapa.nombre}
                    </h2>
                </div>

                {/* Sección para la composición de agentes - CONTENEDOR MODIFICADO */}
                {/* 🎯 CAMBIO CLAVE AQUÍ: `flex flex-col items-center justify-center` */}
                <div className="absolute inset-y-0 right-0 z-40 p-4 flex flex-col items-center justify-center"> 
                   
                    {loadingComposition ? (
                        <div className="flex flex-col items-center gap-2"> 
                            {[...Array(5)].map((_, i) => ( 
                                <AgentSkeleton key={i} />
                            ))}
                        </div>
                    ) : compositionError ? (
                        <p className="text-red-400 text-sm text-center">Error al cargar agentes</p>
                    ) : (
                        <div className="flex flex-col items-center gap-2"> 
                            {composition && composition.length > 0 ? (
                                composition.map((agent, agentIdx) => {
                                    const agentSlug = getAgentSlug(agent.name);
                                    const agentLineupUrl = `https://blitz.gg/valorant/lineups?map=${mapSlug}&agent=${agentSlug}`;

                                    return (
                                        <a 
                                            key={agentIdx} 
                                            href={agentLineupUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            title={`Ver lineups de ${agent.name} en ${mapa.nombre}`}
                                            className="group flex items-center justify-end mr-5" 
                                        >
                                     
                                            <img
                                                src={agent.image}
                                                alt={agent.name}
                                                className="w-14 h-14 rounded-full border-2 border-white/50 shadow-md transform transition-transform duration-200 hover:scale-110"
                                            />
                                        </a>
                                    );
                                })
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    {[...Array(5)].map((_, i) => (
                                        <AgentSkeleton key={i} />
                                    ))}
                                    <p className="text-slate-400 text-xs text-center mt-1">No hay datos de composición.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Botón/Enlace de Lineups general (solo mapa) */}
                <div className="absolute bottom-8 left-8 z-50">
                    <a
                        href={lineupUrlMapOnly}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ease-in-out"
                    >
                        Ver Lineups del Mapa
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="ml-2 -mr-1 h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                        </svg>
                    </a>
                </div>
            </div>

            {/* Minimap en la esquina superior izquierda */}
            <img
                src={mapa.minimap}
                alt={`${mapa.nombre} Minimap`}
                className="absolute
                top-4 sm:top-8 md:top-8 lg:top-10 xl:top-12
                left-4 sm:left-6 md:left-0 lg:left-10 xl:left-12
                w-20 h-20 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32
                rounded-lg z-30 rotate-90"
            />

            {/* Contenido principal */}
            <div className="relative p-6 flex flex-col justify-center items-center h-full">
                {/* Card del mapa en posición vertical central */}
                <div className="flex flex-col items-center">
                    <img
                        src={mapa.cardmapas}
                        alt={`${mapa.nombre} Card`}
                        className="w-40 sm:w-48 h-auto rounded-lg shadow-lg border border-white/20 z-20"
                    />

                    {/* Coordenadas exactamente abajo de cardmapas */}
                    <h3 className="text-white/90 text-lg sm:text-xl drop-shadow-md mt-4 z-30 text-center">
                        {mapa.cordenadas}
                    </h3>
                </div>
            </div>
        </div>
    );
}