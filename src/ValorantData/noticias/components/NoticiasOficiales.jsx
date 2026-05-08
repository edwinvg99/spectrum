import React from 'react';
import { useOfficialNews } from '../hooks/useOfficialNews';
import { NewsLoadingSkeleton } from '../../../shared/loadingSkeletons';

function NoticiasOficiales() {
  const { noticias, cargando, error } = useOfficialNews();

  if (cargando) {
    return <NewsLoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="p-4 text-center bg-red-900/10 rounded-lg border border-red-700/20">
        <p className="text-red-400 text-sm font-medium">Error al cargar noticias oficiales</p>
        <p className="text-red-500/60 text-xs mt-1">{error}</p>
      </div>
    );
  }

  if (noticias.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500 text-sm">No se encontraron noticias oficiales.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {noticias.map((noticia, index) => (
        <a
          key={index}
          href={noticia.external_link || noticia.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block group bg-slate-800/40 rounded-lg overflow-hidden border border-slate-700/15 hover:border-spectrum-cyan/30 transition-all duration-200 hover:bg-slate-800/60"
        >
          {/* Banner image */}
          {noticia.banner_url && (
            <div className="relative aspect-[16/7] overflow-hidden">
              <img
                src={noticia.banner_url}
                alt={noticia.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
            </div>
          )}

          <div className="p-4">
            {/* Category badge */}
            {noticia.category && (
              <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-spectrum-cyan bg-spectrum-cyan/10 px-2 py-0.5 rounded-full mb-2">
                {noticia.category}
              </span>
            )}

            <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-spectrum-cyan transition-colors duration-200 line-clamp-2 leading-snug">
              {noticia.title}
            </h3>

            {noticia.description && (
              <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                {noticia.description}
              </p>
            )}

            <div className="flex justify-between items-center text-[10px] mt-2.5">
              <span className="text-slate-600">
                {new Date(noticia.date).toLocaleDateString('es-CO', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <span className="text-spectrum-cyan/60 group-hover:text-spectrum-cyan transition-colors">
                Ver mas &rarr;
              </span>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}

export default NoticiasOficiales;
