import { useEffect, useState } from "react";

export function usePersonajes() {
  const [personajes, setPersonajes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPersonajes() {
      try {
        const res = await fetch("https://valorant-api.com/v1/agents?isPlayableCharacter=true&language=es-MX");
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        const json = await res.json();
        const data = json.data;

        const personajesFiltrados = data.map((personaje) => ({
          nombre: personaje.displayName,
          descripcion: personaje.description,
          imagen: personaje.fullPortrait || personaje.displayIcon, // Usa fullPortrait si está disponible
          fondo: personaje.background, // Fondo para las cards
          gradientColors: personaje.backgroundGradientColors, // Añadimos los colores del gradiente aquí
          rol: personaje.role?.displayName || "Desconocido", // Nombre del rol
          iconoRol: personaje.role?.displayIcon || "", // Icono del rol
          habilidades: personaje.abilities.map((hab) => ({
            nombre: hab.displayName,
            icono: hab.displayIcon,
            descripcion: hab.description,
          })),
        }));

        setPersonajes(personajesFiltrados);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }

    fetchPersonajes();
  }, []);

  return { personajes, cargando, error };
}