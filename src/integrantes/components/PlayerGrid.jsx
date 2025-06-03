
import { PLAYERS, LOADING_STATES } from '../../../server/utils/constants';
import PlayerCard from './PlayerCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';
import HeaderSection from './HeaderSection';
import ErrorMessage from './ErrorMessage';
import PlayersGrid from './PlayersGrid';
import FooterSection from './FooterSection';
import {usePlayerData} from '../hooks/usePlayerData';

const PlayerGrid = () => {
  const {
    playersData,
    loadingState,
    error,
    serverStatus,
    cacheStatus,
    isUpdatingCache,
    handleRefresh,
    handleClearCache
  } = usePlayerData();

  // Renderizado condicional basado en el estado
  if (loadingState === LOADING_STATES.LOADING) {
    return <LoadingSpinner />;
  }

  if (loadingState === LOADING_STATES.ERROR && serverStatus?.status === 'ERROR') {
    return (
      <ErrorDisplay 
        title="Error del Servidor"
        message="No se pudo conectar al servidor backend."
        details="Asegúrate de que esté ejecutándose en http://localhost:3001"
        onRetry={() => handleRefresh(true)}
      />
    );
  }

  return (
<div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 ">
    
      <div className="bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')] bg-repeat">
        {/* Header Section */}  
        
        <HeaderSection 
          serverStatus={serverStatus}
          cacheStatus={cacheStatus}
          isUpdatingCache={isUpdatingCache}
          loadingState={loadingState}
          onRefresh={handleRefresh}
          onClearCache={handleClearCache}
        />

        <ErrorMessage error={error} />

        <PlayersGrid playersData={playersData} />
        
        <FooterSection cacheStatus={cacheStatus} />
      </div>
    </div>
  );
};

export default PlayerGrid;