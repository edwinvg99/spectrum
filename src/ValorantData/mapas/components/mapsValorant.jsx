import { useMaps } from "../hooks/useMaps";

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
        {mapas.map((mapa, idx) => {
          // Función para generar el slug del mapa para la URL
          const getMapSlug = (nombreMapa) => {
            return nombreMapa.toLowerCase().replace(/\s+/g, "-");
          };

          const lineupUrl = `https://blitz.gg/valorant/lineups?map=${getMapSlug(mapa.nombre)}`;

          return (
            <div
              key={idx}
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

                {/* Botón/Enlace de Lineups */}
                <div className="absolute bottom-8 left-8 z-50">
                  <a
                    href={lineupUrl}
                    target="_blank" // Abre en una nueva pestaña
                    rel="noopener noreferrer" // Mejora la seguridad al abrir en nueva pestaña
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ease-in-out"
                  >
                    Ver Lineups
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

              {/* Minimap en la esquina superior derecha */}
              <img
                src={mapa.minimap}
                alt={`${mapa.nombre} Minimap`}
                // Clases responsive ajustadas para varios tamaños de pantalla
                className="absolute
                top-4 sm:top-8 md:top-8 lg:top-10 xl:top-12
                right-4 sm:right-6 md:right-0 lg:right-10 xl:right-12
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
        })}
      </div>
    </div>
  );
}