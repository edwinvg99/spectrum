import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'vsc_tournaments';
const ACTIVE_KEY = 'vsc_active_tournament';

// ============================================================
// Tournament state management with localStorage persistence
// ============================================================

function loadTournaments() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTournaments(tournaments) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tournaments));
  } catch (e) {
    console.error('[Torneos] Error guardando:', e);
  }
}

function loadActiveTournamentId() {
  try {
    return localStorage.getItem(ACTIVE_KEY) || null;
  } catch {
    return null;
  }
}

function saveActiveTournamentId(id) {
  try {
    if (id) localStorage.setItem(ACTIVE_KEY, id);
    else localStorage.removeItem(ACTIVE_KEY);
  } catch { /* noop */ }
}

/**
 * Build a single-elimination bracket from a list of participant names.
 * Returns an array of rounds, each round is an array of matches.
 */
function buildBracket(participants) {
  const n = participants.length;
  if (n < 2) return [];

  // Next power of two
  let slots = 1;
  while (slots < n) slots *= 2;

  // Seed participants (fill gaps with BYE)
  const seeded = [...participants];
  while (seeded.length < slots) seeded.push(null); // null = BYE

  // First round matches
  const firstRound = [];
  for (let i = 0; i < slots; i += 2) {
    firstRound.push({
      id: `r0-m${i / 2}`,
      p1: seeded[i],
      p2: seeded[i + 1],
      winner: null,
      // Auto-advance BYEs
    });
  }

  // Auto-resolve BYE matches
  firstRound.forEach(m => {
    if (m.p1 && !m.p2) m.winner = m.p1;
    else if (!m.p1 && m.p2) m.winner = m.p2;
  });

  const rounds = [firstRound];

  // Build empty subsequent rounds
  let prevRound = firstRound;
  while (prevRound.length > 1) {
    const roundIndex = rounds.length;
    const nextRound = [];
    for (let i = 0; i < prevRound.length; i += 2) {
      nextRound.push({
        id: `r${roundIndex}-m${i / 2}`,
        p1: prevRound[i].winner || null,
        p2: prevRound[i + 1]?.winner || null,
        winner: null,
      });
    }
    rounds.push(nextRound);
    prevRound = nextRound;
  }

  return rounds;
}

function getRoundName(roundIndex, totalRounds) {
  const remaining = totalRounds - roundIndex;
  if (remaining === 1) return 'FINAL';
  if (remaining === 2) return 'SEMIFINAL';
  if (remaining === 3) return 'CUARTOS';
  return `RONDA ${roundIndex + 1}`;
}

export function useTournament() {
  const [tournaments, setTournaments] = useState(() => loadTournaments());
  const [activeTournamentId, setActiveTournamentId] = useState(() => loadActiveTournamentId());

  // Persist whenever state changes
  useEffect(() => { saveTournaments(tournaments); }, [tournaments]);
  useEffect(() => { saveActiveTournamentId(activeTournamentId); }, [activeTournamentId]);

  const activeTournament = tournaments.find(t => t.id === activeTournamentId) || null;

  // Create a new tournament
  const createTournament = useCallback((name, teamSize, participants) => {
    const id = `t_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const bracket = buildBracket(participants);
    const tournament = {
      id,
      name,
      teamSize,           // 1, 2, 3, 4, or 5
      participants,
      bracket,
      champion: null,
      createdAt: Date.now(),
      status: 'active',   // 'active' | 'completed'
    };
    setTournaments(prev => [tournament, ...prev]);
    setActiveTournamentId(id);
    return id;
  }, []);

  // Select a match winner and propagate through bracket
  const selectWinner = useCallback((tournamentId, matchId, winner) => {
    setTournaments(prev => prev.map(t => {
      if (t.id !== tournamentId) return t;

      const bracket = t.bracket.map(round => round.map(m => ({ ...m })));
      let roundIdx = -1, matchIdx = -1;

      // Find the match
      for (let r = 0; r < bracket.length; r++) {
        for (let m = 0; m < bracket[r].length; m++) {
          if (bracket[r][m].id === matchId) {
            roundIdx = r;
            matchIdx = m;
            break;
          }
        }
        if (roundIdx >= 0) break;
      }

      if (roundIdx < 0) return t;

      // Set winner
      bracket[roundIdx][matchIdx].winner = winner;

      // Propagate to next round
      if (roundIdx + 1 < bracket.length) {
        const nextMatchIdx = Math.floor(matchIdx / 2);
        const slot = matchIdx % 2 === 0 ? 'p1' : 'p2';
        bracket[roundIdx + 1][nextMatchIdx][slot] = winner;

        // If we changed a slot, clear that next match's winner
        // (in case the user changes their mind)
        bracket[roundIdx + 1][nextMatchIdx].winner = null;

        // Clear all downstream from that next match too
        let clearRound = roundIdx + 1;
        let clearMatch = nextMatchIdx;
        while (clearRound + 1 < bracket.length) {
          const nextClearMatch = Math.floor(clearMatch / 2);
          const nextSlot = clearMatch % 2 === 0 ? 'p1' : 'p2';
          bracket[clearRound + 1][nextClearMatch][nextSlot] = null;
          bracket[clearRound + 1][nextClearMatch].winner = null;
          clearRound++;
          clearMatch = nextClearMatch;
        }
      }

      // Check if tournament is complete (final has a winner)
      const finalMatch = bracket[bracket.length - 1][0];
      const champion = finalMatch.winner || null;

      return {
        ...t,
        bracket,
        champion,
        status: champion ? 'completed' : 'active',
      };
    }));
  }, []);

  // Delete a tournament
  const deleteTournament = useCallback((id) => {
    setTournaments(prev => prev.filter(t => t.id !== id));
    if (activeTournamentId === id) setActiveTournamentId(null);
  }, [activeTournamentId]);

  // Reset a tournament bracket (re-shuffle)
  const resetTournament = useCallback((id) => {
    setTournaments(prev => prev.map(t => {
      if (t.id !== id) return t;
      const bracket = buildBracket(t.participants);
      return { ...t, bracket, champion: null, status: 'active' };
    }));
  }, []);

  // Set which tournament is actively viewed
  const setActive = useCallback((id) => {
    setActiveTournamentId(id);
  }, []);

  // Go back to list
  const clearActive = useCallback(() => {
    setActiveTournamentId(null);
  }, []);

  return {
    tournaments,
    activeTournament,
    createTournament,
    selectWinner,
    deleteTournament,
    resetTournament,
    setActive,
    clearActive,
    getRoundName,
  };
}

export default useTournament;
