import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import anime from "animejs";
import SpectrumLogo from "../assets/images/spectrumLOGO.svg?react";

const NAV_LINKS = [
  { to: "/",          label: "Inicio"    },
  { to: "/jugadas",   label: "Jugadas"   },
  { to: "/mapas",     label: "Mapas"     },
  { to: "/tienda",    label: "Tienda"    },
  { to: "/valorant",  label: "Noticias"  },
  { to: "/agentes",   label: "Agentes"   },
  { to: "/arsenal",   label: "Arsenal"   },
  { to: "/torneos",     label: "Torneos"    },
  { to: "/accesorios", label: "Accesorios" },
];

function Navbar() {
  const location           = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef             = useRef(null);
  const linksRef           = useRef(null);
  const mounted            = useRef(false);

  /* ── entrance animation on first mount ── */
  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    anime({
      targets: navRef.current,
      translateY: [-64, 0],
      opacity:    [0, 1],
      duration:   700,
      easing:     "easeOutExpo",
    });

    anime({
      targets: linksRef.current?.querySelectorAll("a, button"),
      translateY: [-12, 0],
      opacity:    [0, 1],
      duration:   500,
      delay:      anime.stagger(60, { start: 300 }),
      easing:     "easeOutExpo",
    });
  }, []);

  /* ── active indicator ── */
  const isActive = (path) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  const linkCls = (path) =>
    `relative text-sm font-semibold tracking-wider transition-all duration-200 px-2 py-1
     ${isActive(path)
       ? "text-spectrum-cyan"
       : "text-slate-300 hover:text-white"}`;

  return (
    <nav
      ref={navRef}
      className="fixed w-full top-0 z-50 bg-spectrum-darker/90 backdrop-blur-md border-b border-slate-700/40 shadow-lg"
      style={{ opacity: 0 }}
    >
      {/* subtle top glow line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-spectrum-cyan/60 to-transparent" />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={linksRef} className="flex items-center justify-between h-16 gap-4">

          {/* ── Logo ── */}
          <Link
            to="/"
            className="flex items-center gap-2.5 flex-shrink-0 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-spectrum-cyan/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <SpectrumLogo
                className="h-7 w-7 relative transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-cyan"
                fill="url(#navGrad)"
                stroke="rgba(0,247,255,0.6)"
                strokeWidth="1"
              />
              <svg width="0" height="0" className="absolute">
                <defs>
                  <linearGradient id="navGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%"   stopColor="#00f7ff" />
                    <stop offset="50%"  stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="text-white font-display font-bold text-lg tracking-widest hidden sm:block
                             group-hover:text-spectrum-cyan transition-colors duration-200">
              SPECTRUM
            </span>
          </Link>

          {/* ── Desktop links ── */}
          <div className="hidden md:flex items-center gap-0.5 lg:gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <Link key={to} to={to} className={linkCls(to)}>
                {label}
                {isActive(to) && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-spectrum-cyan rounded-full
                                   animate-fade-in" />
                )}
              </Link>
            ))}
          </div>

          {/* ── CTA button ── */}
          <div className="hidden md:block flex-shrink-0">
            <Link
              to="/integrantes"
              className="relative inline-flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-sm
                         tracking-wider transition-all duration-300 overflow-hidden group
                         bg-transparent border border-spectrum-cyan/50 text-spectrum-cyan
                         hover:bg-spectrum-cyan hover:text-spectrum-darker hover:border-spectrum-cyan
                         hover:shadow-cyan hover:scale-105"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              Integrantes
            </Link>
          </div>

          {/* ── Mobile menu button ── */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {menuOpen && (
        <div className="md:hidden bg-spectrum-darker/98 border-t border-slate-700/40 backdrop-blur-md animate-fade-in">
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
                  ${isActive(to)
                    ? "bg-spectrum-cyan/10 text-spectrum-cyan border border-spectrum-cyan/20"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"}`}
              >
                {label}
              </Link>
            ))}
            <Link
              to="/integrantes"
              onClick={() => setMenuOpen(false)}
              className="block mt-3 px-4 py-2.5 rounded-lg text-sm font-bold text-center
                         bg-spectrum-cyan/10 border border-spectrum-cyan/40 text-spectrum-cyan
                         hover:bg-spectrum-cyan hover:text-spectrum-darker transition-all duration-200"
            >
              Integrantes
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
