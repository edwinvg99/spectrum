import React, { useState } from 'react';
import { PLAYERS } from '../../utils/constants';

const TEAM_SIZE_OPTIONS = [
  { value: 1, label: '1v1', desc: 'Individual' },
  { value: 2, label: '2v2', desc: 'Parejas' },
  { value: 3, label: '3v3', desc: 'Trios' },
  { value: 4, label: '4v4', desc: 'Cuartetos' },
  { value: 5, label: '5v5', desc: 'Equipos completos' },
];

function TournamentSetup({ onCreate, onCancel }) {
  const [name, setName] = useState('');
  const [teamSize, setTeamSize] = useState(1);
  const [participants, setParticipants] = useState([]);
  const [customName, setCustomName] = useState('');
  const [error, setError] = useState('');

  const availablePlayers = PLAYERS.filter(p => !participants.includes(p.name));

  const addPlayer = (playerName) => {
    if (!playerName || participants.includes(playerName)) return;
    setParticipants(prev => [...prev, playerName]);
    setError('');
  };

  const addCustom = () => {
    const trimmed = customName.trim();
    if (!trimmed) return;
    if (participants.includes(trimmed)) {
      setError('Ese nombre ya esta en la lista');
      return;
    }
    setParticipants(prev => [...prev, trimmed]);
    setCustomName('');
    setError('');
  };

  const removeParticipant = (name) => {
    setParticipants(prev => prev.filter(p => p !== name));
  };

  const shuffleParticipants = () => {
    setParticipants(prev => {
      const arr = [...prev];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    });
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Dale un nombre al torneo');
      return;
    }
    if (participants.length < 2) {
      setError('Necesitas al menos 2 participantes');
      return;
    }
    onCreate(name.trim(), teamSize, participants);
  };

  const teamLabel = teamSize === 1 ? 'jugadores' : `equipos de ${teamSize}`;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      <div className="bg-slate-800/30 border border-slate-700/20 rounded-xl p-6 space-y-6 backdrop-blur-sm">
        {/* Title */}
        <div>
          <h2 className="text-xl font-display font-bold text-white tracking-wide uppercase mb-1">
            Nuevo Torneo
          </h2>
          <p className="text-sm text-slate-500">
            Configura el formato y agrega participantes.
          </p>
        </div>

        {/* Tournament name */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Nombre del torneo
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ej: Torneo Spectrum S1"
            className="w-full bg-slate-900/50 border border-slate-700/40 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-spectrum-cyan/50 focus:ring-1 focus:ring-spectrum-cyan/20 transition-colors"
          />
        </div>

        {/* Team size */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Formato
          </label>
          <div className="grid grid-cols-5 gap-2">
            {TEAM_SIZE_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setTeamSize(opt.value)}
                className={`px-3 py-2.5 rounded-lg text-center transition-all duration-200 border ${
                  teamSize === opt.value
                    ? 'bg-spectrum-cyan/10 border-spectrum-cyan/40 text-spectrum-cyan'
                    : 'bg-slate-900/40 border-slate-700/30 text-slate-400 hover:border-slate-600 hover:text-slate-300'
                }`}
              >
                <span className="block text-sm font-bold">{opt.label}</span>
                <span className="block text-[10px] mt-0.5 opacity-70">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Registered players quick-add */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Jugadores del Clan
          </label>
          <div className="flex flex-wrap gap-1.5">
            {availablePlayers.length === 0 ? (
              <p className="text-xs text-slate-600 italic">Todos los jugadores ya fueron agregados</p>
            ) : (
              availablePlayers.map(p => (
                <button
                  key={p.name}
                  onClick={() => addPlayer(p.name)}
                  className="px-2.5 py-1 text-xs font-medium bg-slate-800/60 border border-slate-700/30 rounded-md text-slate-400 hover:text-white hover:border-spectrum-cyan/30 hover:bg-spectrum-cyan/5 transition-all duration-150"
                >
                  + {p.name}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Custom name input */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Agregar participante manual
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customName}
              onChange={e => setCustomName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCustom()}
              placeholder="Nombre o equipo..."
              className="flex-1 bg-slate-900/50 border border-slate-700/40 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-spectrum-cyan/50 focus:ring-1 focus:ring-spectrum-cyan/20 transition-colors"
            />
            <button
              onClick={addCustom}
              className="px-4 py-2 bg-slate-700/50 border border-slate-600/40 rounded-lg text-sm font-medium text-slate-300 hover:bg-spectrum-cyan/10 hover:text-spectrum-cyan hover:border-spectrum-cyan/30 transition-all duration-200"
            >
              Agregar
            </button>
          </div>
        </div>

        {/* Selected participants */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Participantes ({participants.length} {teamLabel})
            </label>
            {participants.length > 2 && (
              <button
                onClick={shuffleParticipants}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-spectrum-cyan transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                Mezclar orden
              </button>
            )}
          </div>
          {participants.length === 0 ? (
            <div className="bg-slate-900/30 border border-dashed border-slate-700/40 rounded-lg p-4 text-center">
              <p className="text-xs text-slate-600">
                Agrega participantes usando los botones de arriba o el campo de texto
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {participants.map((p, i) => (
                <span
                  key={p}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-spectrum-cyan/5 border border-spectrum-cyan/20 rounded-md text-xs font-medium text-spectrum-cyan animate-fade-in-up"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  {p}
                  <button
                    onClick={() => removeParticipant(p)}
                    className="text-spectrum-cyan/50 hover:text-red-400 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <p className="text-xs text-red-400 font-medium">{error}</p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSubmit}
            className="flex-1 px-6 py-2.5 bg-gradient-to-r from-spectrum-cyan to-spectrum-blue text-spectrum-darker font-bold text-sm uppercase tracking-wider rounded-lg hover:shadow-lg hover:shadow-spectrum-cyan/25 hover:scale-[1.02] transition-all duration-300"
          >
            Crear Torneo
          </button>
          <button
            onClick={onCancel}
            className="px-5 py-2.5 border border-slate-700/50 text-slate-400 text-sm font-medium rounded-lg hover:bg-white/5 hover:text-white transition-all duration-200"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default TournamentSetup;
