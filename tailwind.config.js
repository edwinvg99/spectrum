/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        spectrum: {
          darker:  '#040b14',
          dark:    '#0a1628',
          cyan:    '#00f7ff',
          blue:    '#3b82f6',
          purple:  '#a855f7',
          pink:    '#ec4899',
          gold:    '#FFD700',
        },
      },
      fontFamily: {
        display: ['Rajdhani', 'Impact', 'Arial Narrow', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'spectrum-gradient': 'linear-gradient(135deg, #040b14 0%, #0a1628 50%, #040b14 100%)',
        'cyan-glow':         'radial-gradient(ellipse at center, rgba(0,247,255,0.15) 0%, transparent 70%)',
        'gold-glow':         'radial-gradient(ellipse at center, rgba(255,215,0,0.2) 0%, transparent 70%)',
      },
      animation: {
        'fade-in-up':     'fadeInUp 0.6s ease-out both',
        'fade-in':        'fadeIn 0.4s ease-out both',
        'glow-pulse':     'glowPulse 2s ease-in-out infinite',
        'slide-in-right': 'slideInRight 0.5s ease-out both',
        'scale-in':       'scaleIn 0.4s ease-out both',
        'shimmer':        'shimmer 2s linear infinite',
        'float':          'float 3s ease-in-out infinite',
        'spin-slow':      'spin 8s linear infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0,247,255,0.2), 0 0 20px rgba(0,247,255,0.1)' },
          '50%':      { boxShadow: '0 0 20px rgba(0,247,255,0.6), 0 0 60px rgba(0,247,255,0.3)' },
        },
        slideInRight: {
          '0%':   { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.85)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },
      boxShadow: {
        'cyan':   '0 0 20px rgba(0,247,255,0.35)',
        'blue':   '0 0 20px rgba(59,130,246,0.35)',
        'purple': '0 0 20px rgba(168,85,247,0.35)',
        'gold':   '0 0 20px rgba(255,215,0,0.35)',
        'glow-cyan':   '0 0 40px rgba(0,247,255,0.25), 0 0 80px rgba(0,247,255,0.1)',
        'glow-gold':   '0 0 40px rgba(255,215,0,0.25), 0 0 80px rgba(255,215,0,0.1)',
      },
      dropShadow: {
        'cyan':   '0 0 8px rgba(0,247,255,0.6)',
        'gold':   '0 0 8px rgba(255,215,0,0.6)',
        'purple': '0 0 8px rgba(168,85,247,0.6)',
      },
    },
  },
  plugins: [],
};
