import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import { confettiBurst, championReveal, staggerGrid } from '../../utils/animations';
import MatchCard from './MatchCard';

/* ── Star icon ── */
const Star = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3 6.5L22 10l-5 5 1.5 7L12 18.5 5.5 22 7 15l-5-5 7-1.5L12 2z"/>
  </svg>
);

/* ── Champion Banner ── */
function ChampionBanner({ champion }) {
  const bannerRef    = useRef(null);
  const containerRef = useRef(null);
  const triggered    = useRef(false);

  useEffect(() => {
    if (!champion || triggered.current || !bannerRef.current) return;
    triggered.current = true;

    /* stagger the inner children */
    anime({
      targets:    bannerRef.current.querySelectorAll('.champ-part'),
      translateY: [30, 0],
      opacity:    [0, 1],
      duration:   700,
      delay:      anime.stagger(120, { start: 200 }),
      easing:     'easeOutExpo',
    });

    /* spin the stars */
    anime({
      targets:  bannerRef.current.querySelectorAll('.star-spin'),
      rotate:   [0, 360],
      duration: 1200,
      delay:    anime.stagger(80, { start: 400 }),
      easing:   'easeOutExpo',
    });

    /* confetti burst after 600ms */
    setTimeout(() => {
      if (containerRef.current) confettiBurst(containerRef.current, 28);
    }, 600);
  }, [champion]);

  if (!champion) return null;

  return (
    <div ref={containerRef} className="mb-10 relative">
      <div
        ref={bannerRef}
        className="max-w-lg mx-auto text-center relative overflow-hidden"
      >
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-yellow-400/20 to-yellow-600/10
                        rounded-2xl blur-xl pointer-events-none" />

        <div className="relative bg-gradient-to-br from-slate-800/80 via-slate-900/90 to-slate-800/80
                        border border-yellow-500/40 rounded-2xl p-8 backdrop-blur-sm
                        shadow-[0_0_60px_-10px_rgba(255,215,0,0.4)]">

          {/* Stars row */}
          <div className="champ-part flex items-center justify-center gap-3 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`star-spin w-5 h-5 text-yellow-400
                ${i === 2 ? 'w-8 h-8 text-yellow-300' : ''}`} />
            ))}
          </div>

          {/* Label */}
          <p className="champ-part text-[11px] font-black text-yellow-400/80 tracking-[0.4em] uppercase mb-3">
            🏆 Campeón del Torneo 🏆
          </p>

          {/* Name */}
          <h2 className="champ-part text-4xl font-display font-black uppercase tracking-widest
                         text-yellow-300 text-glow-gold">
            {champion}
          </h2>

          {/* Bottom stars */}
          <div className="champ-part flex items-center justify-center gap-2 mt-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />
            <Star className="w-4 h-4 text-yellow-500/60" />
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main bracket ── */
function TournamentBracket({ tournament, onSelectWinner, getRoundName }) {
  const { bracket, champion } = tournament;
  const bracketRef = useRef(null);
  const totalRounds = bracket.length;

  /* stagger match cards on mount */
  useEffect(() => {
    if (!bracketRef.current) return;
    const cards = bracketRef.current.querySelectorAll('.match-card-anim');
    if (cards.length) {
      anime({
        targets:    cards,
        translateX: [-20, 0],
        opacity:    [0, 1],
        duration:   500,
        delay:      anime.stagger(50),
        easing:     'easeOutExpo',
      });
    }
  }, [bracket]);

  if (!bracket.length) return null;

  return (
    <div className="w-full">
      <ChampionBanner champion={champion} />

      {/* Instruction tip */}
      {!champion && (
        <div className="mb-6 bg-slate-800/20 border border-slate-700/20 rounded-lg px-4 py-3
                        flex items-center gap-3 animate-fade-in-up max-w-2xl mx-auto">
          <div className="w-2 h-2 rounded-full bg-spectrum-cyan animate-pulse flex-shrink-0" />
          <p className="text-xs text-slate-500">
            <span className="text-spectrum-cyan font-semibold">Tip:</span>{' '}
            Haz clic en el nombre del ganador de cada partido para avanzarlo a la siguiente ronda.
          </p>
        </div>
      )}

      {/* Bracket scroll area */}
      <div ref={bracketRef} className="overflow-x-auto pb-6">
        <div className="flex items-stretch gap-3 min-w-max px-2">
          {bracket.map((round, roundIdx) => {
            const roundName = getRoundName(roundIdx, totalRounds);
            const isFinale  = roundIdx === totalRounds - 1;
            const isSemi    = roundIdx === totalRounds - 2;

            return (
              <div key={roundIdx} className="flex flex-col items-center min-w-[220px]">
                {/* Round header */}
                <div className={`mb-5 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.25em] uppercase
                  ${isFinale
                    ? 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/40 shadow-gold'
                    : isSemi
                    ? 'bg-spectrum-purple/10 text-spectrum-purple border border-spectrum-purple/30'
                    : 'bg-slate-800/50 text-slate-500 border border-slate-700/30'}`}>
                  {roundName}
                </div>

                {/* Matches */}
                <div
                  className="flex flex-col items-center justify-center flex-1"
                  style={{
                    gap: `${Math.pow(2, roundIdx) * 16 + 16}px`,
                    paddingTop: `${roundIdx * 28}px`,
                  }}
                >
                  {round.map((match) => (
                    <div key={match.id} className="match-card-anim" style={{ opacity: 0 }}>
                      <MatchCard
                        match={match}
                        onSelectWinner={onSelectWinner}
                        tournamentId={tournament.id}
                        isFinale={isFinale}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TournamentBracket;
