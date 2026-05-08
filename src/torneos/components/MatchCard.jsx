import React, { useRef } from 'react';
import anime from 'animejs';

function MatchCard({ match, onSelectWinner, tournamentId, isFinale }) {
  const { p1, p2, winner } = match;
  const canPick = p1 && p2 && !winner;
  const cardRef = useRef(null);

  const handleClick = (name) => {
    if (!canPick || !name) return;

    /* winner flash animation */
    if (cardRef.current) {
      const color = isFinale ? '#FFD700' : '#00f7ff';
      anime({
        targets:   cardRef.current,
        boxShadow: [
          `0 0 0px ${color}00`,
          `0 0 30px ${color}80`,
          `0 0 0px ${color}00`,
        ],
        duration: 600,
        easing:   'easeOutExpo',
      });
    }

    onSelectWinner(tournamentId, match.id, name);
  };

  const slotBase =
    'relative flex items-center gap-2 px-3 py-2.5 text-sm font-medium transition-all duration-200';

  const slotCls = (name, isTop) => {
    const rounded = isTop ? 'rounded-t-lg border-b border-slate-700/30' : 'rounded-b-lg';
    if (!name)         return `${slotBase} ${rounded} bg-slate-800/20 text-slate-600 italic cursor-default`;
    if (winner === name) return `${slotBase} ${rounded} bg-spectrum-cyan/10 text-spectrum-cyan border-spectrum-cyan/20 ring-1 ring-inset ring-spectrum-cyan/30`;
    if (winner && winner !== name) return `${slotBase} ${rounded} bg-slate-900/40 text-slate-600 line-through opacity-50 cursor-default`;
    if (canPick)       return `${slotBase} ${rounded} bg-slate-800/40 text-slate-300 hover:bg-spectrum-cyan/10 hover:text-white cursor-pointer`;
    return               `${slotBase} ${rounded} bg-slate-800/30 text-slate-400 cursor-default`;
  };

  return (
    <div
      ref={cardRef}
      className={`w-52 rounded-xl border overflow-hidden shadow-xl transition-all duration-300
        ${isFinale
          ? 'border-yellow-500/50 bg-slate-800/60 shadow-[0_0_20px_rgba(255,215,0,0.1)]'
          : winner
          ? 'border-spectrum-cyan/25 bg-slate-800/50 shadow-[0_0_12px_rgba(0,247,255,0.05)]'
          : 'border-slate-700/30 bg-slate-800/30 hover:border-slate-600/50'}`}
    >
      {/* P1 */}
      <button
        onClick={() => handleClick(p1)}
        disabled={!canPick}
        className={`${slotCls(p1, true)} w-full text-left`}
      >
        {winner === p1 && (
          <svg className="w-3.5 h-3.5 text-spectrum-cyan flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
          </svg>
        )}
        <span className="truncate">{p1 || 'BYE'}</span>
      </button>

      {/* VS divider */}
      <div className="flex items-center justify-center py-1 bg-slate-900/60 gap-2">
        <div className="flex-1 h-px bg-slate-700/30" />
        <span className="text-[9px] font-black text-slate-600 tracking-widest">VS</span>
        <div className="flex-1 h-px bg-slate-700/30" />
      </div>

      {/* P2 */}
      <button
        onClick={() => handleClick(p2)}
        disabled={!canPick}
        className={`${slotCls(p2, false)} w-full text-left`}
      >
        {winner === p2 && (
          <svg className="w-3.5 h-3.5 text-spectrum-cyan flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
          </svg>
        )}
        <span className="truncate">{p2 || 'BYE'}</span>
      </button>
    </div>
  );
}

export default MatchCard;
