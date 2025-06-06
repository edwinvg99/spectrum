// src/hooks/useAgentComposition.js - Versión corregida con URL adaptativa
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
            // ✅ URL adaptativa: desarrollo vs producción
            const isDevelopment = window.location.hostname === 'localhost';
            const baseUrl = isDevelopment 
                ? '/api-local'  // Desarrollo: usar proxy
                : '';           // Producción: usar mismo dominio
            
            const url = `${baseUrl}/api/valorant/agent-composition/${REFERENCE_PLAYER.region}/${REFERENCE_PLAYER.name}/${REFERENCE_PLAYER.tag}?map=${encodeURIComponent(mapName)}`;
            
            console.log(`🎯 Fetching composición desde: ${url}`);
            console.log(`🌍 Entorno: ${isDevelopment ? 'Desarrollo' : 'Producción'}`);
            
            const response = await fetch(url);

            if (!response.ok) {
                // Intenta parsear el error, pero maneja si no es JSON (como el <!doctype)
                let errorDetails = 'Error desconocido';
                try {
                    const errorData = await response.json();
                    errorDetails = errorData.message || JSON.stringify(errorData);
                } catch (jsonErr) {
                    // Si no es JSON, es probablemente HTML
                    const textResponse = await response.text();
                    if (textResponse.includes('<!doctype') || textResponse.includes('<html>')) {
                        errorDetails = 'Recibida página HTML en lugar de JSON (posible error de routing)';
                    } else {
                        errorDetails = `Respuesta no JSON: ${response.status} ${response.statusText}`;
                    }
                }
                throw new Error(`Error ${response.status}: ${errorDetails}`);
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