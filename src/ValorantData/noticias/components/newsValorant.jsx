import React from 'react';
import { useNoticiasValorant } from '../hooks/useNews'; // Asegúrate de que la ruta sea correcta
import { NewsLoadingSkeleton } from '../../../sharred/loadingSkeletons';

function NoticiasValorantSection() {
  const { noticias, cargando, error } = useNoticiasValorant();

  if (cargando) {
    return (
    <NewsLoadingSkeleton/>  
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center bg-red-800 rounded-lg text-white">
        <p className="font-bold">Error al cargar noticias:</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div >
      {noticias.length === 0 ? (
        <div className="text-center text-white text-lg p-4">
          <p>No se encontraron noticias en este momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6"> {/* Ahora siempre 1 columna para la sección de noticias */}
          {noticias.map((noticia, index) => (
            <a
              key={index}
              href={`${noticia.url_path}`} // Asegúrate de tener la URL completa
              target="_blank"
              rel="noopener noreferrer"
              className="block group bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-red-500 transition-colors duration-300 line-clamp-2">
                  {noticia.title}
                </h3>
                <p className="text-gray-400 text-xs line-clamp-3">
                  {noticia.description}
                </p>
                <div className="flex justify-between items-center text-gray-500 text-[10px] mt-2">
                  <span>{new Date(noticia.date).toLocaleDateString('es-CO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                  <span className="text-red-400 group-hover:text-red-300 transition-colors duration-300">
                    Leer más &rarr;
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default NoticiasValorantSection;