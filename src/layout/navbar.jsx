import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const baseLinkClasses = `
    text-white
    font-bold
    tracking-wider
    transition-all
    duration-300
    ease-in-out
    hover:text-sky-400
    hover:scale-105
    hover:drop-shadow-lg
    text-xl
    sm:text-1xl
    md:text-1xl
    lg:text-2xl
    xl:text-2xl
  `;

  const activeLinkClasses =
    "font-extrabold text-sky-400 border-b-1 border-sky-400";
  const inactiveLinkClasses = "";

  const getLinkClass = (path) => {
    return `${baseLinkClasses} ${
      location.pathname === path ? activeLinkClasses : inactiveLinkClasses
    }`;
  };

  return (
    <nav className="bg-gradient-to-t from-black to-slate-900 shadow-xl fixed w-full top-0 z-50">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo - Lado izquierdo */}
        <Link
          to="/"
          className="
            flex items-center space-x-3
            text-white            
            font-bold          
            tracking-wider          
            transition-all          
            duration-300            
            ease-in-out             
            hover:text-sky-400      
            hover:scale-105         
            hover:drop-shadow-lg    
            text-xl                
            sm:text-2xl            
            md:text-3xl             
            lg:text-4xl             
            xl:text-4xl            
          "
        >
          SPECTRUM
        </Link>

        {/* Botón CTA y Menú móvil - Lado derecho */}
        <div className="flex md:order-2 space-x-3 md:space-x-0">
          {/* Botón CTA - Solo visible en desktop */}
          <button
            type="button"
            className="
              hidden md:block
              text-white bg-slate-800 hover:bg-sky-700 
              focus:ring-4 focus:outline-none focus:ring-sky-300 
              font-medium rounded-lg text-sm px-4 py-2 text-center
              transition-all duration-300 ease-in-out
              hover:scale-105
            "
          >
            <Link
              to="/integrantes"
              className={`${getLinkClass(
                "/integrantes"
              )} block py-2 px-3 md:p-0 rounded-sm hover:text-white `}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Integrantes
            </Link>
          </button>

          {/* Botón de menú móvil */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="
              inline-flex items-center p-2 w-10 h-10 justify-center 
              text-sm text-slate-400 rounded-lg md:hidden 
              hover:bg-slate-700 focus:outline-none focus:ring-2 
              focus:ring-slate-600 hover:text-white
              transition-all duration-300
            "
            aria-controls="navbar-menu"
            aria-expanded={isMobileMenuOpen ? "true" : "false"}
          >
            <span className="sr-only">Abrir menú principal</span>
            {!isMobileMenuOpen ? (
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Menú de navegación - Centro */}
        <div
          className={`
            items-center justify-between w-full md:flex md:w-auto md:order-1
            ${isMobileMenuOpen ? "block" : "hidden"}
          `}
          id="navbar-menu"
        >
          <ul
            className="
            flex flex-col font-medium p-4 md:p-0 mt-4 
            border border-slate-700 rounded-lg bg-slate-800/50 
            md:space-x-8 md:flex-row md:mt-0 md:border-0 md:bg-transparent
            backdrop-blur-sm
          "
          >
            <li>
              <Link
                to="/"
                className={`${getLinkClass(
                  "/"
                )} block py-2 px-3 md:p-0 rounded-sm`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className={`${getLinkClass(
                  "/integrantes"
                )} block py-2 px-3 md:p-0 rounded-sm`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Mapas
              </Link>
            </li>
            <li>
              <Link
                to="/agentes"
                className={`${getLinkClass(
                  "/agentes"
                )} block py-2 px-3 md:p-0 rounded-sm`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Agentes
              </Link>
            </li>
            {/* Botón CTA en móvil */}
            <li className="md:hidden mt-2">
              <button
                type="button"
                className="
                  w-full text-white bg-slate-600 hover:bg-sky-700 hover:text-slate-900
                  focus:ring-4 focus:outline-none 
                  font-medium rounded-lg text-sm px-4 py-2 text-center
                  transition-all duration-300 ease-in-out
                "
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link
                  to="/integrantes"
                  className={`${getLinkClass(
                    "/integrantes"
                  )} block py-2 px-3 md:p-0 rounded-sm`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  integrantes
                </Link>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
