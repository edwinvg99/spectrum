// src/components/MapasValorant.jsx
import { useMaps } from "../hooks/useMaps";
import MapCard from "./MapCard"; // Importa el nuevo componente

export default function MapasValorant() {
    const { mapas, cargando, error } = useMaps([
        "La Galería",
        "Entrenamiento Básico",
        "Piazza",
        "Glitch",
        "Kasbah",
        "Drift",
        "District",
    ]);

    if (cargando) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
                <div className="flex flex-col justify-center items-center text-center">
                    <div className="w-12 h-12 border-3 border-slate-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-300 text-lg font-semibold">
                        Cargando mapas...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 text-center max-w-md">
                    <svg
                        className="w-16 h-16 mx-auto mb-4 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <p className="text-red-400 text-lg font-semibold">Error: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center w-full bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')] bg-repeat min-h-screen py-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 p-6 w-full max-w-7xl">
                {/* Ahora, por cada mapa, renderizamos un componente MapCard */}
                {mapas.map((mapa, idx) => (
                    <MapCard key={idx} mapa={mapa} />
                ))}
            </div>
        </div>
    );
}