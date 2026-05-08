import React, { useState, useEffect, useRef } from 'react';
import anime from 'animejs';
import { StoreLoadingSkeleton } from '../../sharred/loadingSkeletons';

/* ══ helpers ══ */
const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return "-- : -- : --";
  const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const s = String(Math.floor(seconds % 60)).padStart(2, '0');
  return `${h}:${m}:${s}`;
};

const adaptBundle = (bundle) => {
  let name  = 'Pack Desconocido';
  let image = '';
  let desc  = bundle.description || '';
  if (bundle.items?.length) {
    const main = bundle.items.reduce((prev, cur) => {
      if (cur.promo_item) return cur;
      return (prev.base_price || 0) > (cur.base_price || 0) ? prev : cur;
    }, bundle.items[0]);
    if (main) {
      name  = main.displayName || main.name || name;
      image = main.displayIcon || main.image || '';
      if (!desc && main.description) desc = main.description;
    }
  }
  return { ...bundle, name, image, description: desc };
};

/* ══ Timer widget ══ */
function TimerBadge({ seconds }) {
  if (!seconds || isNaN(seconds)) return null;
  return (
    <div className="flex items-center gap-2 text-xs font-mono">
      <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
      <span className="text-slate-400">Expira en</span>
      <span className="text-red-400 font-bold">{formatTime(seconds)}</span>
    </div>
  );
}

/* ══ Bundle item card ══ */
function ItemCard({ item, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`group relative bg-slate-900/60 rounded-2xl p-4 text-center border
                  transition-all duration-300 hover:scale-105 focus:outline-none
                  ${isSelected
                    ? 'border-spectrum-cyan/60 ring-2 ring-spectrum-cyan/30 shadow-cyan bg-spectrum-cyan/5'
                    : 'border-slate-700/30 hover:border-spectrum-cyan/30 hover:bg-slate-800/60'}`}
    >
      {/* glow */}
      {isSelected && (
        <div className="absolute inset-0 bg-spectrum-cyan/5 rounded-2xl pointer-events-none" />
      )}

      <div className="h-20 flex items-center justify-center mb-3">
        <img
          src={item.displayIcon || item.image || ''}
          alt={item.displayName || item.name || 'Item'}
          className="max-h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      </div>

      <p className="text-white text-xs font-semibold line-clamp-2 mb-1">
        {item.displayName || item.name || 'Item'}
      </p>

      {item.type && (
        <p className="text-slate-500 text-[10px]">{item.type.replace(/_/g, ' ')}</p>
      )}

      {item.base_price !== undefined && (
        <p className="text-yellow-400 text-xs font-bold mt-2">
          {item.base_price} <span className="text-yellow-600 font-normal">VP</span>
        </p>
      )}
    </button>
  );
}

/* ══ Selected item detail ══ */
function SelectedDetail({ item, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    anime({ targets: ref.current, translateY: [-16, 0], opacity: [0, 1], duration: 400, easing: 'easeOutExpo' });
  }, [item]);

  return (
    <div ref={ref} className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80
                               border border-spectrum-cyan/30 rounded-2xl p-6 mb-6
                               shadow-[0_0_40px_rgba(0,247,255,0.08)]">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-spectrum-cyan/50 to-transparent rounded-t-2xl" />

      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-500 hover:text-white
                   hover:bg-slate-700/50 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>

      <div className="flex items-center gap-6">
        <div className="w-28 h-28 bg-slate-800 rounded-xl flex items-center justify-center p-3
                        border border-slate-700/40 flex-shrink-0">
          <img
            src={item.displayIcon || item.image || ''}
            alt={item.displayName || ''}
            className="w-full h-full object-contain"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
        <div>
          <h4 className="text-xl font-bold text-white mb-1">
            {item.displayName || item.name || 'Item'}
          </h4>
          {item.type && (
            <p className="text-spectrum-cyan text-xs uppercase tracking-widest mb-3">
              {item.type.replace(/_/g, ' ')}
            </p>
          )}
          <div className="flex items-center gap-4">
            {item.base_price !== undefined && (
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">Precio</span>
                <p className="text-yellow-400 text-xl font-black">
                  {item.base_price} <span className="text-yellow-600 text-sm font-normal">VP</span>
                </p>
              </div>
            )}
            {item.discounted_price !== undefined && item.discounted_price < item.base_price && (
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">Descuento</span>
                <p className="text-green-400 text-xl font-black">
                  {item.discounted_price} <span className="text-green-600 text-sm font-normal">VP</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══ Bundle card ══ */
function BundleCard({ bundle, index }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const cardRef = useRef(null);

  useEffect(() => {
    if (!cardRef.current) return;
    anime({
      targets:    cardRef.current,
      translateY: [40, 0],
      opacity:    [0, 1],
      duration:   700,
      delay:      index * 200,
      easing:     'easeOutExpo',
    });
  }, []);

  return (
    <div
      ref={cardRef}
      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/30 rounded-3xl
                 overflow-hidden shadow-2xl"
      style={{ opacity: 0 }}
    >
      {/* Banner / header */}
      <div className="relative px-8 pt-8 pb-6 bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-black text-spectrum-purple/80 uppercase tracking-[0.35em] mb-2">
              Pack Destacado
            </p>
            <h2 className="text-2xl lg:text-3xl font-display font-black text-white">
              {bundle.name}
            </h2>
            {bundle.description && (
              <p className="text-slate-400 text-sm mt-2 max-w-lg">{bundle.description}</p>
            )}
          </div>

          {/* Price + timer */}
          <div className="flex-shrink-0 text-right">
            {bundle.bundle_price && (
              <div className="bg-slate-900/60 border border-yellow-500/30 rounded-2xl px-6 py-3
                              shadow-gold">
                <p className="text-[10px] text-yellow-600 uppercase tracking-wider mb-1">Precio total</p>
                <p className="text-3xl font-black text-yellow-400 tabular-nums">
                  {bundle.bundle_price.toLocaleString()}
                  <span className="text-lg font-semibold text-yellow-600 ml-1">VP</span>
                </p>
              </div>
            )}
            <div className="mt-2">
              <TimerBadge seconds={bundle.seconds_remaining} />
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="p-8">
        {selectedItem && (
          <SelectedDetail item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}

        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-bold text-white">
            Items Incluidos
            <span className="ml-2 text-xs text-slate-500 font-normal">({bundle.items?.length || 0})</span>
          </h3>
          {selectedItem && (
            <button onClick={() => setSelectedItem(null)} className="text-xs text-slate-500 hover:text-white transition-colors">
              Deseleccionar
            </button>
          )}
        </div>

        {bundle.items?.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {bundle.items.map((item, i) => (
              <div
                key={item.uuid || i}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <ItemCard
                  item={item}
                  isSelected={selectedItem?.uuid === item.uuid}
                  onClick={() => setSelectedItem(selectedItem?.uuid === item.uuid ? null : item)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-800/40 rounded-xl p-8 text-center">
            <p className="text-slate-500 text-sm">No se encontraron items para este pack.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══ Empty state ══ */
const EmptyState = () => (
  <div className="text-center py-24">
    <div className="text-8xl mb-6">🛍️</div>
    <h3 className="text-2xl font-bold text-slate-400 mb-2">Tienda vacía</h3>
    <p className="text-slate-600">La tienda no tiene packs destacados en este momento.</p>
  </div>
);

/* ══ Main component ══ */
function ValorantStore() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const isDev = window.location.hostname === 'localhost';
        const url   = `${isDev ? '/api-local' : ''}/api/valorant/store-products`;
        const res   = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data  = await res.json();
        setProducts((data?.data || []).map(adaptBundle));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
  }, []);

  /* header entrance */
  useEffect(() => {
    if (loading || !headerRef.current) return;
    anime({
      targets:    headerRef.current.querySelectorAll('.store-header-part'),
      translateY: [30, 0],
      opacity:    [0, 1],
      duration:   700,
      delay:      anime.stagger(120),
      easing:     'easeOutExpo',
    });
  }, [loading]);

  if (loading) return <StoreLoadingSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen bg-spectrum-darker flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-red-300 mb-2">Error cargando tienda</h2>
          <p className="text-sm text-red-400/80">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-spectrum-darker page-pattern pb-16">
      {/* hero gradient */}
      <div className="absolute inset-x-0 top-16 h-64 bg-gradient-to-b from-spectrum-purple/10 via-spectrum-blue/5 to-transparent pointer-events-none" />

      <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">

        {/* Header */}
        <div ref={headerRef} className="text-center mb-12">
          <p className="store-header-part opacity-0 text-spectrum-cyan/60 text-[10px] font-black tracking-[0.4em] uppercase mb-3">
            Valorant
          </p>
          <h1 className="store-header-part opacity-0 text-5xl font-display font-black text-white uppercase tracking-widest
                         drop-shadow-[0_0_40px_rgba(168,85,247,0.4)]">
            Tienda
          </h1>
          <p className="store-header-part opacity-0 text-slate-500 text-sm mt-2">
            Packs destacados · Se actualiza diariamente
          </p>

          {/* decorative line */}
          <div className="store-header-part opacity-0 flex items-center gap-4 justify-center mt-6 max-w-xs mx-auto">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-spectrum-purple/40" />
            <div className="w-2 h-2 rounded-full bg-spectrum-purple/60" />
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-spectrum-purple/40" />
          </div>
        </div>

        {/* Bundles */}
        {products.length > 0 ? (
          <div className="space-y-10">
            {products.map((bundle, i) => (
              <BundleCard key={bundle.bundle_uuid || i} bundle={bundle} index={i} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

export default ValorantStore;
