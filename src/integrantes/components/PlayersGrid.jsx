import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PlayerCard from './PlayerCard';
import { staggerGrid } from '../../utils/animations';

const PlayersGrid = ({ playersData }) => {
  const gridRef  = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll('.player-card-wrapper');
    if (cards.length) staggerGrid(cards, { delay: 100, stagger: 80 });
  }, [playersData]);

  const handlePlayerClick = (player) => {
    const name = player?.playerData?.name ?? player?.name ?? '';
    const tag  = player?.playerData?.tag  ?? player?.tag  ?? '';
    if (name && tag) {
      navigate(`/integrantes/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`);
    }
  };

  return (
    <main className="px-4 pb-12">
      <div
        ref={gridRef}
        className="flex flex-row flex-wrap items-stretch justify-center gap-4 max-w-7xl mx-auto"
      >
        {playersData.map((player) => (
          <div
            key={`${player.name}-${player.tag}`}
            className="player-card-wrapper w-full max-w-sm opacity-0 cursor-pointer"
            onClick={() => handlePlayerClick(player)}
            style={{ opacity: 0 }}
          >
            <PlayerCard
              playerData={player.playerData}
              mmrData={player.mmrData}
              isLoading={player.isLoading}
              error={player.error}
              playerInfo={player}
            />
          </div>
        ))}
      </div>
    </main>
  );
};

export default PlayersGrid;
