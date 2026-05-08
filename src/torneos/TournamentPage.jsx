import React, { useState } from 'react';
import useTournament from './hooks/useTournament';
import TournamentSetup from './components/TournamentSetup';
import TournamentBracket from './components/TournamentBracket';
import TournamentList from './components/TournamentList';

function TournamentPage() {
  const {
    tournaments,
    activeTournament,
    createTournament,
    selectWinner,
    deleteTournament,
    resetTournament,
    setActive,
    clearActive,
    getRoundName,
  } = useTournament();

  const [showSetup, setShowSetup] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // --- VIEW: Active tournament bracket ---
  if (activeTournament) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-spectrum-darker via-slate-900 to-spectrum-darker page-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 animate-fade-in-up">
            <div className="flex items-center gap-4">
              <button
                onClick={clearActive}
                className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                title="Volver a torneos"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                </svg>
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wide uppercase">
                  {activeTournament.name}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    activeTournament.status === 'completed'
                      ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                      : 'bg-spectrum-cyan/10 text-spectrum-cyan border border-spectrum-cyan/20'
                  }`}>
                    {activeTournament.status === 'completed' ? 'Finalizado' : 'En curso'}
                  </span>
                  <span className="text-xs text-slate-600">
                    {activeTournament.participants.length} participantes
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => resetTournament(activeTournament.id)}
                className="px-3 py-1.5 text-xs font-medium text-slate-400 border border-slate-700/40 rounded-lg hover:text-white hover:border-slate-600 hover:bg-white/5 transition-all duration-200"
              >
                Reiniciar bracket
              </button>
            </div>
          </div>

          {/* Instructions */}
          {!activeTournament.champion && (
            <div className="mb-6 bg-slate-800/20 border border-slate-700/20 rounded-lg px-4 py-2.5 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
              <p className="text-xs text-slate-500">
                <span className="text-spectrum-cyan font-semibold">Tip:</span> Haz clic en el nombre del ganador de cada partido para avanzarlo a la siguiente ronda.
              </p>
            </div>
          )}

          {/* Bracket */}
          <TournamentBracket
            tournament={activeTournament}
            onSelectWinner={selectWinner}
            getRoundName={getRoundName}
          />
        </div>
      </div>
    );
  }

  // --- VIEW: Setup form ---
  if (showSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-spectrum-darker via-slate-900 to-spectrum-darker page-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <TournamentSetup
            onCreate={(name, teamSize, participants) => {
              createTournament(name, teamSize, participants);
              setShowSetup(false);
            }}
            onCancel={() => setShowSetup(false)}
          />
        </div>
      </div>
    );
  }

  // --- VIEW: Main list ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-spectrum-darker via-slate-900 to-spectrum-darker page-pattern">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <p className="text-spectrum-cyan/60 text-xs font-semibold tracking-[0.3em] uppercase mb-3">
            Eliminacion directa
          </p>
          <h1 className="text-3xl font-display font-bold text-white tracking-wide uppercase">
            Torneos
          </h1>
          <p className="text-slate-500 text-sm mt-3 max-w-md mx-auto">
            Crea brackets de eliminacion directa para el clan. Selecciona ganadores y avanza hasta coronar al campeon.
          </p>
        </div>

        {/* Create button */}
        <div className="flex justify-center mb-8 animate-fade-in-up" style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>
          <button
            onClick={() => setShowSetup(true)}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-spectrum-cyan to-spectrum-blue text-spectrum-darker font-bold text-sm uppercase tracking-wider rounded-lg hover:shadow-lg hover:shadow-spectrum-cyan/25 hover:scale-[1.02] transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/>
            </svg>
            Nuevo Torneo
          </button>
        </div>

        {/* Delete confirmation modal */}
        {confirmDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-800 border border-slate-700/50 rounded-xl p-6 max-w-sm mx-4 shadow-2xl">
              <h3 className="text-white font-bold text-sm mb-2">Eliminar torneo</h3>
              <p className="text-slate-400 text-xs mb-5">
                Esta accion no se puede deshacer. Se eliminara el torneo y todo su progreso.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => { deleteTournament(confirmDelete); setConfirmDelete(null); }}
                  className="flex-1 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold rounded-lg hover:bg-red-500/20 transition-colors"
                >
                  Eliminar
                </button>
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 px-4 py-2 bg-slate-700/50 border border-slate-600/30 text-slate-300 text-xs font-medium rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tournament list */}
        <TournamentList
          tournaments={tournaments}
          onSelect={setActive}
          onDelete={(id) => setConfirmDelete(id)}
        />

        {/* Empty state */}
        {tournaments.length === 0 && (
          <div className="text-center mt-12 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/50 border border-slate-700/30 flex items-center justify-center text-slate-600">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 4l2 4 4-3 4 3 2-4M6 4v8c0 3.31 2.69 6 6 6s6-2.69 6-6V4M9 20h6M12 18v2M6 8H4a2 2 0 00-2 2v1a3 3 0 003 3h1M18 8h2a2 2 0 012 2v1a3 3 0 01-3 3h-1"/>
              </svg>
            </div>
            <p className="text-slate-600 text-sm">
              No hay torneos creados aun.
            </p>
            <p className="text-slate-700 text-xs mt-1">
              Crea uno para empezar a competir.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TournamentPage;
