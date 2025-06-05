import { useEffect, useState } from "react";

export function useMaps(mapasExcluidos = []) {
    const [mapas, setmapas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        async function fetchMaps() {
            try {
                const res = await fetch("https://valorant-api.com/v1/maps?language=es-MX");
                if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
                const json = await res.json();
                let data = json.data;

              

                // Filtrar mapas excluidos
                if (mapasExcluidos.length > 0) {
                    console.log("Mapas a excluir:", mapasExcluidos);
                    data = data.filter(mapa => 
                        !mapasExcluidos.includes(mapa.displayName)
                    );
                    console.log("Mapas después del filtro:", data.map(mapa => mapa.displayName));
                }

                const mapasFiltrados = data.map((mapas) => ({
                    nombre: mapas.displayName,
                    fondoCarga: mapas.splash,
                    cardmapas: mapas.listViewIconTall,
                    minimap: mapas.displayIcon,
                    fondo: mapas.premierBackgroundImage,
                    cordenadas: mapas.coordinates,
                }));

                setmapas(mapasFiltrados);
            } catch (err) {
                setError(err.message);
            } finally {
                setCargando(false);
            }
        }
        fetchMaps();
    }, [mapasExcluidos]);

    return { mapas, cargando, error };
}

