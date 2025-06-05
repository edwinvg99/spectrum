import React from 'react';
import { useNoticiasValorant } from '../hooks/useNews'; // Asegúrate de que la ruta sea correcta

function NoticiasValorantSection() {
  const { noticias, cargando, error } = useNoticiasValorant();

  if (cargando) {
    return (
      <section className="py-12 bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600 mb-4"></div>
          <p className="text-white text-xl font-semibold">Cargando las últimas noticias de Valorant...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="bg-red-800 p-6 rounded-lg shadow-lg text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Error al cargar las noticias</h2>
          <p className="text-lg">Parece que hubo un problema. Intenta de nuevo más tarde.</p>
          <p className="text-sm mt-2 opacity-80">Detalle del error: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-center text-red-600 mb-12 drop-shadow-lg">
          Últimas Noticias de VALORANT
        </h2>

        {noticias.length === 0 ? (
          <div className="text-center text-white text-xl">
            <p>No se encontraron noticias en este momento. Vuelve a intentarlo más tarde.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {noticias.map((noticia, index) => (
              <a
                key={index} // Idealmente, usa un ID único de la noticia si la API lo proporciona
                href={`${noticia.url_path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block group bg-gray-800 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-500 transition-colors duration-300">
                    {noticia.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {noticia.description}
                  </p>
                  <div className="flex justify-between items-center text-gray-500 text-xs">
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
    </section>
  );
}

export default NoticiasValorantSection;