// src/hooks/useAgentComposition.js
import { useState, useEffect, useCallback } from 'react';

const REFERENCE_PLAYER = {
    name: 'TenZ',
    tag: '00005',
    region: 'na'
};

// Objeto para almacenar la caché de composiciones.
// Esta variable vive fuera del hook y persistirá durante la vida de la aplicación de frontend.
const compositionCache = {};

export function useAgentComposition(mapName) {
    const [composition, setComposition] = useState(null);
    const [loadingComposition, setLoadingComposition] = useState(true);
    const [compositionError, setCompositionError] = useState(null);

    const fetchAgentComposition = useCallback(async () => {
        if (!mapName) {
            setLoadingComposition(false);
            return;
        }

        // 🎯 Paso 1: Intentar obtener los datos de la caché
        if (compositionCache[mapName]) {
            console.log(`✅ Datos de composición para ${mapName} obtenidos de la caché.`);
            setComposition(compositionCache[mapName].data); // Asume que la caché guarda { data, status }
            setLoadingComposition(false);
            setCompositionError(null);
            return; // Salir, ya tenemos los datos
        }

        setLoadingComposition(true);
        setCompositionError(null);

        try {
            // ✅ Tu URL actual del proxy de backend
            const url = `/api-local/api/valorant/agent-composition/${REFERENCE_PLAYER.region}/${REFERENCE_PLAYER.name}/${REFERENCE_PLAYER.tag}?map=${encodeURIComponent(mapName)}`;
            
            const response = await fetch(url);

            if (!response.ok) {
                // Intenta parsear el error, pero maneja si no es JSON (como el <!doctype)
                let errorDetails = 'Error desconocido';
                try {
                    const errorData = await response.json();
                    errorDetails = errorData.message || JSON.stringify(errorData);
                } catch (jsonErr) {
                    errorDetails = `Respuesta no JSON: ${response.status} ${response.statusText}`;
                    console.error('Error al parsear respuesta de error como JSON:', jsonErr, response.text());
                }
                throw new Error(`Error en la solicitud: ${response.status} - ${errorDetails}`);
            }

            const data = await response.json();
            
            console.log(`🎯 Composición recibida para ${mapName}:`, data);

            if (data.status === 'success' && data.data && data.data.length > 0) {
                // 🎯 Paso 2: Almacenar los datos en la caché después de una solicitud exitosa
                compositionCache[mapName] = data; // Guarda la respuesta completa o solo data.data si prefieres
                setComposition(data.data);
            } else {
                setComposition([]);
                if (data.status === 'no_data') {
                    console.log(`ℹ️ No hay datos de composición para ${mapName}`);
                }
            }
            
        } catch (err) {
            console.error(`❌ Error obteniendo composición para ${mapName}:`, err);
            setCompositionError(err.message);
            setComposition([]); // En caso de error, muestra un array vacío o un valor por defecto
        } finally {
            setLoadingComposition(false);
        }
    }, [mapName]); // `fetchAgentComposition` solo cambia si `mapName` cambia

    useEffect(() => {
        fetchAgentComposition(); // Ejecutar la función de fetch al montar o si fetchAgentComposition cambia
    }, [fetchAgentComposition]); // La dependencia `fetchAgentComposition` es importante para useCallback

    return { composition, loadingComposition, compositionError };
}