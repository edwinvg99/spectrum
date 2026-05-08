import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import anime from "animejs";
import "./HomePage.css";

const QUICK_NAV = [
  { to: "/integrantes", label: "EQUIPO"   },
  { to: "/torneos",     label: "TORNEOS"  },
  { to: "/jugadas",     label: "JUGADAS"  },
  { to: "/mapas",       label: "MAPAS"    },
  { to: "/agentes",     label: "AGENTES"  },
  { to: "/arsenal",     label: "ARSENAL"  },
];

function HomePage() {
  const [phase, setPhase] = useState("intro"); // "intro" | "done"
  const introRef = useRef(null);

  /* ── Step 1: draw SPECTRUM stroke animation ── */
  useEffect(() => {
    const draw = anime({
      targets: "#sp-svg .lp",
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: "easeInOutSine",
      duration: 1600,
      delay: anime.stagger(130),
    });

    draw.finished.then(() => {
      // Brief glow hold, then fade out intro
      anime({
        targets: "#sp-svg .lp",
        stroke: ["#00f7ff", "#ffffff"],
        duration: 500,
        easing: "easeOutQuad",
      });
      setTimeout(() => {
        anime({
          targets: introRef.current,
          opacity: [1, 0],
          duration: 650,
          easing: "easeInQuad",
          complete: () => setPhase("done"),
        });
      }, 900);
    });
  }, []);

  /* ── Step 2: animate hero elements in ── */
  useEffect(() => {
    if (phase !== "done") return;
    anime.timeline({ easing: "easeOutExpo" })
      .add({ targets: ".hp-badge",  opacity: [0, 1], translateY: [20, 0], duration: 500 })
      .add({ targets: ".hp-title",  opacity: [0, 1], translateY: [30, 0], duration: 600 }, "-=200")
      .add({ targets: ".hp-desc",   opacity: [0, 1], translateY: [20, 0], duration: 500 }, "-=300")
      .add({ targets: ".hp-actions",opacity: [0, 1], translateY: [20, 0], duration: 500 }, "-=300")
      .add({ targets: ".hp-stat",   opacity: [0, 1], translateY: [20, 0], duration: 400, delay: anime.stagger(80) }, "-=400")
      .add({ targets: ".hp-qcard",  opacity: [0, 1], translateY: [12, 0], duration: 350, delay: anime.stagger(50) }, "-=200");
  }, [phase]);

  return (
    <div className="hp-root">

      {/* ── Intro overlay ── */}
      {phase !== "done" && (
        <div ref={introRef} className="hp-intro">
          <div className="hp-grid-bg" />
          <div className="hp-scanline" />

          <div className="hp-intro-center">
            <svg
              id="sp-svg"
              viewBox="0 0 700 160"
              className="hp-svg"
              fill="none"
              stroke="#00f7ff"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* S */}
              <path className="lp" d="M75,20 L15,20 L15,80 L75,80 L75,140 L15,140" />
              {/* P */}
              <path className="lp" d="M100,140 L100,20 L160,20 L160,80 L100,80" />
              {/* E */}
              <path className="lp" d="M245,20 L185,20 L185,140 L245,140 M185,80 L235,80" />
              {/* C */}
              <path className="lp" d="M330,20 L270,20 L270,140 L330,140" />
              {/* T */}
              <path className="lp" d="M355,20 L415,20 M385,20 L385,140" />
              {/* R */}
              <path className="lp" d="M440,140 L440,20 L500,20 L500,80 L440,80 M470,80 L500,140" />
              {/* U */}
              <path className="lp" d="M525,20 L525,140 L585,140 L585,20" />
              {/* M */}
              <path className="lp" d="M610,140 L610,20 L642,80 L675,20 L675,140" />
            </svg>
            <p className="hp-intro-tagline">GAMING CLAN · VALORANT · EST. 2024</p>
          </div>
        </div>
      )}

      {/* ── Hero section ── */}
      <div className={`hp-hero ${phase === "done" ? "hp-hero--on" : "hp-hero--off"}`}>
        <video autoPlay muted loop playsInline className="hp-video">
          <source src="/videos/valoFONDO.webm" type="video/webm" />
        </video>
        <div className="hp-voverlay" />
        <div className="hp-hero-grid" />

        {/* Corner brackets */}
        <div className="hp-corner hp-corner--tl" />
        <div className="hp-corner hp-corner--tr" />
        <div className="hp-corner hp-corner--bl" />
        <div className="hp-corner hp-corner--br" />

        {/* Glow accent line */}
        <div className="hp-accent-line" />

        <div className="hp-hero-body">
          {/* Left column */}
          <div className="hp-hero-left">
            <div className="hp-badge" style={{ opacity: 0 }}>
              <span className="hp-badge-dot" />
              CLAN ACTIVO · TEMPORADA 2026
            </div>

            <h1 className="hp-title" style={{ opacity: 0 }}>
              <span className="hp-title-top">SOMOS</span>
              <span className="hp-title-main">SPECTRUM</span>
            </h1>

            <p className="hp-desc" style={{ opacity: 0 }}>
            
              Estrategia, precisión y trabajo en equipo.
            </p>

            <div className="hp-actions" style={{ opacity: 0 }}>
              <Link to="/integrantes" className="hp-btn-primary">VER EQUIPO</Link>
              <Link to="/torneos"     className="hp-btn-ghost">TORNEOS</Link>
            </div>
          </div>

          {/* Right column – stats */}
          <div className="hp-hero-right">
            <div className="hp-stats">
              <div className="hp-stat hp-stat--cyan" style={{ opacity: 0 }}>
                <span className="hp-stat-num">11</span>
                <span className="hp-stat-lbl">INTEGRANTES</span>
              </div>
              <div className="hp-stat hp-stat--gold" style={{ opacity: 0 }}>
                <span className="hp-stat-num">TOP 5%</span>
                <span className="hp-stat-lbl">RANKING</span>
              </div>
              <div className="hp-stat hp-stat--purple" style={{ opacity: 0 }}>
                <span className="hp-stat-num">2024</span>
                <span className="hp-stat-lbl">FUNDACIÓN</span>
              </div>
              <div className="hp-stat hp-stat--blue" style={{ opacity: 0 }}>
                <span className="hp-stat-num">VAL</span>
                <span className="hp-stat-lbl">PLATFORM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick navigation */}
        <nav className="hp-qnav">
          {QUICK_NAV.map(({ to, label }) => (
            <Link key={to} to={to} className="hp-qcard" style={{ opacity: 0 }}>
              <span className="hp-qcard-label">{label}</span>
              <span className="hp-qcard-arrow">›</span>
              <span className="hp-qcard-shine" />
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default HomePage;
