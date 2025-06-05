// src/components/ProximosEventosSection.jsx
import React from 'react';
import { useEventosValorant } from '../hooks/useEventosValorant'; // Asegúrate de que la ruta sea correcta

function ProximosEventosSection() {
  const { eventos, cargando, error } = useEventosValorant();

  if (cargando) {
    return (
      <section className="py-12 bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-500 mb-4"></div>
          <p className="text-white text-xl font-semibold">Cargando próximos eventos de Valorant...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="bg-red-800 p-6 rounded-lg shadow-lg text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Error al cargar los eventos</h2>
          <p className="text-lg">No pudimos obtener la información de los próximos eventos.</p>
          <p className="text-sm mt-2 opacity-80">Detalle del error: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-900 py-16 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-7xl mx-auto">

        {eventos.length === 0 ? (
          <div className="text-center text-white text-xl">
            <p>No hay próximos eventos registrados en este momento. ¡Mantente atento!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventos.map((evento) => (
              // Asumiendo que `id` es único para la key
              <div
                key={evento.id} 
                className="bg-gray-800 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 flex flex-col"
              >
                {evento.img && (
                  <div className="relative w-full h-48 overflow-hidden">
                    <img
                      src={evento.img}
                      alt={evento.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-75"></div>
                  </div>
                )}
                <div className="p-6 flex-grow">
                  <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                    {evento.name}
                  </h3>
                  {evento.status && (
                    <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                      evento.status === 'upcoming' ? 'bg-blue-600 text-blue-100' :
                      evento.status === 'ongoing' ? 'bg-green-600 text-green-100' :
                      'bg-gray-600 text-gray-100'
                    } mb-3 inline-block`}>
                      {evento.status.charAt(0).toUpperCase() + evento.status.slice(1)}
                    </span>
                  )}
                  {evento.prizepool && (
                    <p className="text-red-400 text-lg font-bold mb-2">
                      Premio: {evento.prizepool}
                    </p>
                  )}
                  {evento.dates && (
                    <p className="text-gray-400 text-sm mb-2">
                      Fechas: {evento.dates}
                    </p>
                  )}
                  {evento.country && (
                    <p className="text-gray-500 text-xs">
                      País: {evento.country}
                    </p>
                  )}
                </div>
                {/* Puedes añadir un botón o enlace a una página de detalles del evento si la API lo proporcionara */}
                {/* <div className="p-6 border-t border-gray-700 mt-auto">
                  <a href="#" className="text-red-500 hover:text-red-400 font-semibold transition-colors duration-200">
                    Ver detalles &rarr;
                  </a>
                </div> */}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ProximosEventosSection;