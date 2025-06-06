import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import SpectrumLogo from "../assets/images/spectrumLOGO.svg?react";

function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const baseLinkClasses = `
    text-white font-bold tracking-wider transition-all duration-300 ease-in-out
    hover:text-sky-400 hover:scale-105 hover:drop-shadow-lg
    text-lg sm:text-xl md:text-xl lg:text-2xl xl:text-2xl
  `;

  const activeLinkClasses =
    "font-extrabold text-sky-400 border-b-2 border-sky-400";

  const getLinkClass = (path) => {
    return `${baseLinkClasses} ${
      location.pathname === path ? activeLinkClasses : ""
    }`;
  };

  return (
    <nav className="bg-gradient-to-r from-black via-slate-900 to-black shadow-2xl fixed w-full top-0 z-50 border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Lado izquierdo con Spectrum SVG */}
          <Link
            to="/"
            className="flex items-center space-x-3 transition-all duration-300 ease-in-out hover:scale-105 group"
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

              {/* Logo SVG */}
              <div className="relative">
                <SpectrumLogo
                  className="h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-110"
                  fill="url(#navSpectrumGradient)"
                  stroke="rgba(132, 215, 203, 0.8)"
                  strokeWidth="1"
                />
              </div>

              {/* SVG Gradient para el navbar */}
              <svg width="0" height="0" className="absolute">
                <defs>
                  <linearGradient
                    id="navSpectrumGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#84d7cb" />
                    <stop offset="50%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

     
          </Link>

          {/* Menú Desktop - Centro */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                to="/"
                className={`${getLinkClass("/")} px-3 py-2 rounded-md`}
              >
                Home
              </Link>
              <Link
                to="/jugadas"
                className={`${getLinkClass("/jugadas")} px-3 py-2 rounded-md`}
              >
                Jugadas
              </Link>
              <Link
                to="/mapas"
                className={`${getLinkClass("/mapas")} px-3 py-2 rounded-md`}
              >
                Mapas
              </Link>
              <Link
                to="/tienda"
                className={`${getLinkClass("/tienda")} px-3 py-2 rounded-md`}
              >
                Tienda
              </Link>
              <Link
                to="/valorant"
                className={`${getLinkClass("/valorant")} px-3 py-2 rounded-md`}
              >
                Noticias
              </Link>
              <Link
                to="/agentes"
                className={`${getLinkClass("/agentes")} px-3 py-2 rounded-md`}
              >
                Agentes
              </Link>
            </div>
          </div>

          {/* Botón CTA Desktop - Lado derecho */}
          <div className="hidden md:block">
            <Link
              to="/integrantes"
              className="bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 
                         text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 
                         hover:scale-105 hover:shadow-lg border border-sky-500/50"
            >
              Integrantes
            </Link>
          </div>

          {/* Botón menú móvil */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="bg-slate-800 inline-flex items-center justify-center p-2 rounded-md 
                         text-slate-300 hover:text-white hover:bg-slate-700 
                         focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500
                         transition-all duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menú principal</span>
              {!isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Móvil */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-md border-t border-slate-700/50">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className={`${getLinkClass("/")}
              block px-3 py-2 rounded-md`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/jugadas"
              className={`${getLinkClass("/jugadas")} block px-3 py-2 rounded-md`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Jugadas
            </Link>
            <Link
              to="/mapas"
              className={`${getLinkClass("/mapas")} block px-3 py-2 rounded-md`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Mapas
            </Link>
            <Link
              to="/tienda"
              className={`${getLinkClass("/tienda")} block px-3 py-2 rounded-md`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Tienda
            </Link>
            <Link
              to="/valorant"
              className={`${getLinkClass("/valorant")} block px-3 py-2 rounded-md`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Noticias
            </Link>
            <Link
              to="/agentes"
              className={`${getLinkClass("/agentes")} block px-3 py-2 rounded-md`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Agentes
            </Link>
            <Link
              to="/integrantes"
              className="bg-gradient-to-r from-sky-600 to-sky-700 text-white font-semibold 
                         block px-3 py-2 rounded-md mt-4 text-center
                         hover:from-sky-700 hover:to-sky-800 transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
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
