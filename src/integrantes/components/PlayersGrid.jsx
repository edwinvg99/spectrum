import React from 'react';
import PlayerCard from './PlayerCard';

const PlayersGrid = ({ playersData }) => {
  return (
    <main className="flex flex-row flex-wrap items-center justify-center min-w-screen ">
      <div className="flex flex-row flex-wrap items-center justify-center w-full gap-3 max-w-7xl ">
        {playersData.map((player) => (
          <PlayerCardWrapper key={`${player.name}-${player.tag}`} player={player} />
        ))}
      </div>
    </main>
  );
};

// Wrapper para cada PlayerCard
const PlayerCardWrapper = ({ player }) => (
  <div className="w-full max-w-sm  gap-3 " >
    <PlayerCard
      playerData={player.playerData}
      mmrData={player.mmrData}
      isLoading={player.isLoading}
      error={player.error}
      playerInfo={player}
    />
  </div>
);

export default PlayersGrid;