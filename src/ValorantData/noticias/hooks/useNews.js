import { useEffect, useState } from "react";

export function useNoticiasValorant() {
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchNoticias() {
      try {
        const res = await fetch('/api-valorant/news');
        
        // Verifica si la respuesta HTTP es exitosa
        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status} - ${res.statusText}`);
        }
        
        const json = await res.json();

        // Accede a la estructura correcta de los datos, que parece ser data.data.segments
        const fetchedNoticias = json.data.segments;

        if (!Array.isArray(fetchedNoticias)) {
          throw new Error("La API no devolvió un array de noticias como se esperaba.");
        }

        // Mapea los datos para un formato más limpio si es necesario, 
        // aunque tu estructura original ya es bastante usable.
        const noticiasFormateadas = fetchedNoticias.map(noticia => ({
          title: noticia.title,
          description: noticia.description,
          date: noticia.date,
          url_path: noticia.url_path,
          // Puedes añadir más campos si los necesitas de la respuesta original
        }));

        setNoticias(noticiasFormateadas);

      } catch (err) {
        console.error("❌ Error al obtener las noticias:", err);
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }

    fetchNoticias();
  }, []); // El array de dependencias vacío asegura que el efecto se ejecute una sola vez al montar el componente

  return { noticias, cargando, error };
}