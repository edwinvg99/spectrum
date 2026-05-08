import React from 'react';

const HeaderSection = ({
  serverStatus,
  cacheStatus,
  isUpdatingCache,
  loadingState,
  onRefresh,
  onClearCache,
  tournamentMode,
  onToggleTournament,
}) => {
  const isLoading = loadingState === 'loading';
  const serverOk  = serverStatus?.status === 'OK';

  return (
    <header className="relative flex flex-col items-center text-center pt-10 pb-6">

      {/* ── Title ── */}
      <h1 style={styles.title}>
        Estadísticas en tiempo real
        <span style={styles.titleAccent}> de nuestros jugadores.</span>
      </h1>

      {/* ── Slim status toolbar ── */}
      <div style={styles.toolbar}>

        {/* Server pill */}
        {serverStatus && (
          <span style={serverOk ? styles.pillOnline : styles.pillOffline}>
            <span style={serverOk ? styles.dotOnline : styles.dotOffline} />
            {serverOk ? 'Server online' : 'Server offline'}
          </span>
        )}

        {/* Separator */}
        {serverStatus && (cacheStatus?.hasCache || true) && (
          <span style={styles.sep}>·</span>
        )}

        {/* Cache time */}
        {cacheStatus?.hasCache && (
          <span style={styles.cacheText}>
            {isUpdatingCache
              ? 'actualizando…'
              : (() => {
                  const ageMs = cacheStatus.age || 0;
                  const ageMin = Math.round(ageMs / 60000);
                  const ageH   = Math.floor(ageMs / 3600000);
                  if (ageMin < 2)  return 'caché reciente';
                  if (ageMin < 60) return `caché hace ${ageMin}m`;
                  return `caché hace ${ageH}h`;
                })()
            }
          </span>
        )}

        {/* Refresh button */}
        <button
          style={isLoading ? { ...styles.btnGhost, opacity: 0.4, cursor: 'not-allowed' } : styles.btnGhost}
          onClick={() => !isLoading && onRefresh(true)}
          disabled={isLoading}
          aria-label="Forzar actualización"
        >
          <svg
            style={{ width: 13, height: 13, ...(isLoading ? styles.spinning : {}) }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {isLoading ? 'Actualizando…' : 'Actualizar'}
        </button>

        {/* Clear cache */}
        {cacheStatus?.hasCache && (
          <>
            <span style={styles.sep}>·</span>
            <button style={styles.btnDanger} onClick={onClearCache} aria-label="Limpiar caché">
              Limpiar caché
            </button>
          </>
        )}

        {/* Mode toggle */}
        <span style={styles.sep}>·</span>
        <div style={styles.modeToggle}>
          <button
            style={!tournamentMode ? styles.modeActive : styles.modeInactive}
            onClick={() => tournamentMode && onToggleTournament?.()}
          >
            Ranking
          </button>
          <button
            style={tournamentMode ? styles.modeActive : styles.modeInactive}
            onClick={() => !tournamentMode && onToggleTournament?.()}
          >
            Torneo
          </button>
        </div>
      </div>

    </header>
  );
};

/* ── Inline styles (keeps all design in one file) ─────────────────── */
const CYAN = 'rgba(0,247,255,0.9)';
const CYAN_DIM = 'rgba(0,247,255,0.18)';
const CYAN_BORDER = 'rgba(0,247,255,0.22)';

const styles = {
  title: {
    fontFamily: "'Rajdhani', 'Impact', sans-serif",
    fontSize: 'clamp(1.6rem, 4vw, 2.6rem)',
    fontWeight: 700,
    color: '#ffffff',
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
    textShadow: '0 0 22px rgba(0,247,255,0.35), 0 0 60px rgba(0,247,255,0.1)',
    margin: '0 0 1.4rem',
    lineHeight: 1.15,
  },
  titleAccent: {
    color: CYAN,
  },

  /* Slim single-row toolbar */
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.55rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
    background: 'rgba(4,11,20,0.55)',
    border: `1px solid ${CYAN_BORDER}`,
    borderRadius: '8px',
    padding: '0.45rem 1rem',
    backdropFilter: 'blur(10px)',
    fontSize: '0.7rem',
    letterSpacing: '0.06em',
    fontFamily: "'Rajdhani', sans-serif",
    fontWeight: 600,
    textTransform: 'uppercase',
    maxWidth: 760,
    width: '90vw',
  },

  /* Server pills */
  pillOnline: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    color: 'rgba(52,211,153,0.9)',
  },
  pillOffline: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    color: 'rgba(248,113,113,0.9)',
  },
  dotOnline: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#34d399',
    boxShadow: '0 0 6px #34d399',
    flexShrink: 0,
    animation: 'pulse 1.6s ease-in-out infinite',
  },
  dotOffline: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#f87171',
    boxShadow: '0 0 6px #f87171',
    flexShrink: 0,
  },

  sep: {
    color: 'rgba(255,255,255,0.15)',
    fontWeight: 400,
    userSelect: 'none',
  },

  cacheText: {
    color: 'rgba(255,255,255,0.35)',
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontSize: '0.65rem',
    textTransform: 'none',
    letterSpacing: '0.03em',
  },

  btnGhost: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.3rem',
    background: 'transparent',
    border: 'none',
    color: CYAN,
    cursor: 'pointer',
    padding: '0.2rem 0',
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    transition: 'opacity 0.15s',
  },

  btnDanger: {
    display: 'inline-flex',
    alignItems: 'center',
    background: 'transparent',
    border: 'none',
    color: 'rgba(248,113,113,0.7)',
    cursor: 'pointer',
    padding: '0.2rem 0',
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    transition: 'opacity 0.15s',
  },

  /* Mode toggle — two-button pill */
  modeToggle: {
    display: 'inline-flex',
    background: 'rgba(0,0,0,0.3)',
    border: `1px solid ${CYAN_BORDER}`,
    borderRadius: 6,
    overflow: 'hidden',
  },
  modeActive: {
    background: CYAN_DIM,
    color: CYAN,
    border: 'none',
    padding: '0.2rem 0.7rem',
    cursor: 'default',
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  modeInactive: {
    background: 'transparent',
    color: 'rgba(255,255,255,0.3)',
    border: 'none',
    padding: '0.2rem 0.7rem',
    cursor: 'pointer',
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    transition: 'color 0.15s',
  },

  /* CSS animation for the refresh spinner (applied inline via style prop) */
  spinning: {
    animation: 'spin 1s linear infinite',
  },
};

export default HeaderSection;
