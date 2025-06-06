// tienda.Valorant.jsx - Importar y usar el nuevo loading
import React, { useState, useEffect } from 'react';
import { StoreLoadingSkeleton } from '../../sharred/loadingSkeletons';

// Componente para el estado de error
const ErrorState = ({ error }) => (
  <div className="flex justify-center items-center min-h-screen bg-slate-950">
    <div className="text-center text-red-400">
      <p className="text-2xl mb-6">❌ Error al cargar los packs</p>
      <p className="text-xl">{error}</p>
    </div>
  </div>
);

// Componente para el estado vacío
const EmptyState = () => (
  <div className="text-center">
    <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-3xl p-16">
      <div className="text-8xl mb-6">🛍️</div>
      <p className="text-3xl text-slate-400 mb-4">No se encontraron packs destacados</p>
      <p className="text-xl text-slate-500">La tienda puede estar temporalmente vacía o aún no hay packs disponibles.</p>
    </div>
  </div>
);

// Componente para mostrar detalles del item seleccionado
const SelectedItemDetails = ({ item, onClose }) => (
  <div className="relative bg-slate-900/80 p-6 rounded-2xl border border-blue-600/50 mb-6">
    <div className="flex flex-col lg:flex-row items-center gap-6">
      {/* Imagen del item */}
      <div className="flex-shrink-0 w-32 h-32 lg:w-40 lg:h-40 bg-slate-800 rounded-xl flex items-center justify-center p-4 border border-slate-700">
        <img 
          src={item.displayIcon || item.image || 'https://via.placeholder.com/128x128/1e293b/ffffff?text=ITEM'} 
          alt={item.displayName || item.name || 'Item'} 
          className="w-full h-full object-contain" 
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/128x128/1e293b/ffffff?text=ITEM';
          }}
        />
      </div>
      
      {/* Información del item */}
      <div className="flex-grow text-center lg:text-left">
        <h4 className="text-2xl lg:text-3xl font-bold text-white mb-3">
          {item.displayName || item.name || 'Detalles del Item'}
        </h4>
        {item.type && (
          <p className="text-blue-400 text-lg mb-3">
            Tipo: {item.type.replace(/_/g, ' ')}
          </p>
        )}
        <div className="space-y-2">
          {item.base_price !== undefined && (
            <p className="text-slate-300 text-xl">
              Precio Base: <span className="font-semibold text-white">{item.base_price} VP</span>
            </p>
          )}
          {item.discounted_price !== undefined && item.discounted_price < item.base_price && (
            <p className="text-emerald-400 text-xl">
              Precio con descuento: <span className="font-semibold">{item.discounted_price} VP</span>
            </p>
          )}
        </div>
      </div>
    </div>
    
    {/* Botón cerrar */}
    <button 
      onClick={onClose}
      className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors text-3xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-700/50"
      aria-label="Cerrar detalles del item"
    >
      &times;
    </button>
  </div>
);

// Componente para mostrar un item individual del bundle
const BundleItem = ({ item, itemIndex, isSelected, onClick }) => (
  <div 
    className={`bg-slate-900/70 rounded-xl p-4 text-center border cursor-pointer 
    ${isSelected ? 'border-blue-500 ring-2 ring-blue-500 scale-105 shadow-lg shadow-blue-500/25' : 'border-slate-600/30'} 
    hover:border-blue-500/50 hover:scale-105 transition-all duration-300 min-h-[120px] flex flex-col justify-between`}
    onClick={onClick}
  >
    {/* Imagen del item */}
    <div className="mb-3">
      <img 
        src={item.displayIcon || item.image || 'https://via.placeholder.com/80x80/1e293b/ffffff?text=ITEM'} 
        alt={item.displayName || item.name || 'Item'} 
        className="w-16 h-16 lg:w-20 lg:h-20 object-contain mx-auto"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/80x80/1e293b/ffffff?text=ITEM';
        }}
      />
    </div>
    
    {/* Información del item */}
    <div>
      <p className="text-white text-sm lg:text-base font-medium mb-1 line-clamp-2">
        {item.displayName || item.name || 'Item Skin'}
      </p>
      {item.type && (
        <p className="text-slate-400 text-xs lg:text-sm opacity-80">
          {item.type.replace(/_/g, ' ')}
        </p>
      )}
    </div>
  </div>
);

// Componente para la información de precio del bundle
const BundlePricing = ({ bundlePrice }) => (
  <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-2 rounded-2xl border border-purple-500/30 mb-6">
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
      <h4 className="text-2xl lg:text-2xl font-bold text-[#84d7cb] flex items-center gap-3">
        <span className="text-3xl">💰</span>
        Precio del Pack
      </h4>
      <span className="text-3xl lg:text-2xl font-black text-[#84d7cb] bg-slate-900/50 px-6 py-3 rounded-xl">
        {bundlePrice ? `${bundlePrice} VP` : 'N/A'}
      </span>
    </div>
  </div>
);

// Componente para la información de tiempo restante
const BundleTimer = ({ secondsRemaining, formatTime }) => (
  secondsRemaining !== undefined && (
    <div className="flex flex-col sm:flex-row items-center justify-start  mt-4">
        <span className="text-xl lg:text-2xl text-slate-200 font-semibold flex items-center gap-3">
          Tiempo restante:
        </span>
        <span className="text-2xl lg:text-2xl text-red-500 font-black animate-pulse  px-6 py-3 rounded-xl">
          {formatTime(secondsRemaining)}
        </span>
    </div>
  )
);

// Componente principal para mostrar un bundle individual
const BundleCard = ({ bundle, selectedPackItem, onItemClick, onItemDeselect, formatTime }) => (
  <div className="bg-slate-800/70 backdrop-blur-md border border-slate-700/50 rounded-3xl p-5 lg:p-12 shadow-2xl shadow-purple-500/10">
    <div className="max-w-6xl mx-auto">
        
        
        
      {/* Título del pack */}
      <div className="text-center mb-8">
        <h2 className="text-2xl lg:text-4xl xl:text-5xl font-black mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Pack Destacado de la Tienda
        </h2>
        {bundle.description && (
          <p className="text-xl lg:text-2xl text-slate-300 max-w-4xl mx-auto">{bundle.description}</p>
        )}
      </div>

      {/* Detalles del item seleccionado */}
      {selectedPackItem && (
        <SelectedItemDetails 
          item={selectedPackItem} 
          onClose={onItemDeselect} 
        />
      )}

      {/* Precio del pack */}
      <BundlePricing bundlePrice={bundle.bundle_price} />

      {/* Grid de items del bundle */}
      <div className="bg-slate-900/50 p-3 lg:p-8 rounded-2xl border border-slate-700">
        <h3 className="text-2xl lg:text-3xl font-bold text-white mb-6 text-center">
          Items Incluidos ({bundle.items?.length || 0})
        </h3>
        
        {bundle.items && bundle.items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-6">
            {bundle.items.map((item, itemIndex) => (
              <BundleItem
                key={item.uuid || itemIndex}
                item={item}
                itemIndex={itemIndex}
                isSelected={selectedPackItem?.uuid === item.uuid}
                onClick={() => onItemClick(item)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-slate-800/50 p-8 rounded-2xl text-center">
            <p className="text-xl text-slate-400">No se encontraron items para este pack.</p>
          </div>
        )}

        {/* Timer del bundle */}
        <BundleTimer 
          secondsRemaining={bundle.seconds_remaining} 
          formatTime={formatTime} 
        />
      </div>
    </div>
  </div>
);

// Componente principal
function ValorantStore() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPackItem, setSelectedPackItem] = useState(null);

  // Función para formatear tiempo
  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return "Tiempo no disponible";
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(Math.floor(seconds % 60)).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  // Función para adaptar datos de bundles
  const adaptBundleData = (bundle) => {
    let bundleName = 'Pack Desconocido';
    let bundleImage = 'https://via.placeholder.com/1200x675/1e293b/ffffff?text=PACK+COMPLETO';
    let bundleDescription = bundle.description || '';

    if (bundle.items && bundle.items.length > 0) {
      const mainItem = bundle.items.reduce((prev, current) => {
        if (current.promo_item) return current;
        return (prev.base_price || 0) > (current.base_price || 0) ? prev : current;
      }, bundle.items[0]);

      if (mainItem) {
        bundleName = mainItem.displayName || mainItem.name || `Pack ${bundle.bundle_uuid.slice(0, 4)}`;
        bundleImage = mainItem.displayIcon || mainItem.image || bundleImage;
        if (!bundleDescription && mainItem.description) {
          bundleDescription = mainItem.description;
        }
      }
    }

    return {
      ...bundle,
      name: bundleName,
      image: bundleImage,
      description: bundleDescription
    };
  };

  // Efecto para cargar productos de la tienda
  useEffect(() => {
    const fetchStoreProducts = async () => {
      try {
        // ✅ URL adaptativa: desarrollo vs producción
        const isDevelopment = window.location.hostname === 'localhost';
        const baseUrl = isDevelopment 
          ? '/api-local'  // Desarrollo: usar proxy
          : '';           // Producción: usar mismo dominio
        
        const url = `${baseUrl}/api/valorant/store-products`;
        
        console.log(`🛍️ Fetching tienda desde: ${url}`);
        console.log(`🌍 Entorno: ${isDevelopment ? 'Desarrollo' : 'Producción'}`);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📦 Datos de tienda recibidos:', data);
        
        if (data && data.data && data.data.length > 0) {
          const adaptedBundles = data.data.map(adaptBundleData);
          setProducts(adaptedBundles);
          setSelectedPackItem(null);
        } else {
          setProducts([]);
        }
        
      } catch (err) {
        console.error("❌ Error fetching store products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreProducts();
  }, []);

  // Handlers para la selección de items
  const handleItemClick = (item) => {
    setSelectedPackItem(item);
  };

  const handleDeselectItem = () => {
    setSelectedPackItem(null);
  };

  // Renderizado condicional basado en el estado
  if (loading) return <StoreLoadingSkeleton />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-24 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {products.length > 0 ? (
          <div className="space-y-12">
            {products.map((bundle) => (
              <BundleCard
                key={bundle.bundle_uuid}
                bundle={bundle}
                selectedPackItem={selectedPackItem}
                onItemClick={handleItemClick}
                onItemDeselect={handleDeselectItem}
                formatTime={formatTime}
              />
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