import React from 'react';
import NoticiasValorantSection from './newsValorant';
import ProximosEventosSection from './ProximosEventos';

function MainContentLayout() {
  return (
    <section className="bg-slate-900 py-16 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-8xl mx-auto flex flex-col-reverse lg:flex-row gap-8 lg:gap-12 h-full">
        {/* Columna de Noticias */}
        <div className="w-full lg:w-1/3 flex flex-col lg:h-[900px]"> {/* Ajusta la altura deseada */}
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 text-center lg:text-left drop-shadow-lg">
            Últimas <span className="text-red-600">Noticias</span>
          </h2>
          <div className="flex-grow overflow-y-auto custom-scroll p-2 bg-gray-800 rounded-xl">
            <NoticiasValorantSection />
          </div>
        </div>

        {/* Separador vertical para pantallas grandes */}
        <div className="hidden lg:block w-px bg-gray-700"></div>

        {/* Columna de Eventos */}
        <div className="w-full lg:w-2/3 flex flex-col lg:h-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 text-center lg:text-left drop-shadow-lg">
            Próximos <span className="text-red-600">Eventos</span>
          </h2>
          <div className="flex-grow bg-gray-800 p-2 rounded-xl">
            <ProximosEventosSection />
          </div>
        </div>
      </div>
    </section>
  );
}

export default MainContentLayout;
