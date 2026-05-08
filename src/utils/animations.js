/**
 * animations.js
 * Reusable anime.js animation helpers for Spectrum
 */
import anime from "animejs";

/* ── Entrance animations ── */
export const fadeInUp = (targets, { delay = 0, duration = 600, stagger = 0 } = {}) =>
  anime({
    targets,
    translateY: [32, 0],
    opacity:    [0, 1],
    duration,
    delay:      stagger ? anime.stagger(stagger, { start: delay }) : delay,
    easing:     "easeOutExpo",
  });

export const fadeIn = (targets, { delay = 0, duration = 400 } = {}) =>
  anime({
    targets,
    opacity:  [0, 1],
    duration,
    delay,
    easing:   "easeOutQuad",
  });

export const scaleIn = (targets, { delay = 0, duration = 500 } = {}) =>
  anime({
    targets,
    scale:    [0.85, 1],
    opacity:  [0, 1],
    duration,
    delay,
    easing:   "easeOutBack",
  });

export const slideInRight = (targets, { delay = 0, duration = 500 } = {}) =>
  anime({
    targets,
    translateX: [40, 0],
    opacity:    [0, 1],
    duration,
    delay,
    easing:     "easeOutExpo",
  });

/* ── Stagger grid entrance ── */
export const staggerGrid = (targets, { delay = 0, stagger = 60 } = {}) =>
  anime({
    targets,
    translateY: [24, 0],
    opacity:    [0, 1],
    duration:   550,
    delay:      anime.stagger(stagger, { start: delay }),
    easing:     "easeOutExpo",
  });

/* ── Number counter ── */
export const countUp = (el, { from = 0, to, duration = 1200, suffix = "", decimals = 0 } = {}) => {
  const obj = { val: from };
  return anime({
    targets:  obj,
    val:      to,
    duration,
    easing:   "easeOutExpo",
    update: () => {
      if (el) el.textContent = obj.val.toFixed(decimals) + suffix;
    },
  });
};

/* ── Animated progress bar ── */
export const fillBar = (target, { percent = 0, delay = 0, duration = 900, color = "#00f7ff" } = {}) =>
  anime({
    targets:  target,
    width:    [`0%`, `${percent}%`],
    duration,
    delay,
    easing:   "easeOutExpo",
  });

/* ── Champion celebration ── */
export const championReveal = (container) => {
  const tl = anime.timeline({ easing: "easeOutExpo" });

  tl.add({
    targets:   container,
    scale:     [0.3, 1.08],
    opacity:   [0, 1],
    duration:  600,
    easing:    "easeOutBack",
  })
  .add({
    targets:   container,
    scale:     [1.08, 1],
    duration:  200,
    easing:    "easeInOutQuad",
  });

  return tl;
};

/* ── Confetti burst ── */
export const confettiBurst = (parent, count = 20) => {
  const colors = ["#00f7ff", "#FFD700", "#a855f7", "#f97316", "#4ade80", "#f43f5e"];
  const particles = [];

  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    const angle  = (360 / count) * i;
    const dist   = 60 + Math.random() * 80;
    const rad    = (angle * Math.PI) / 180;
    el.className = "particle";
    el.style.cssText = `
      position:absolute; width:${4+Math.random()*6}px; height:${4+Math.random()*6}px;
      border-radius:${Math.random()>0.5?'50%':'2px'};
      background:${colors[i % colors.length]};
      top:50%; left:50%; transform:translate(-50%,-50%);
      pointer-events:none; z-index:100;
    `;
    parent.appendChild(el);
    particles.push({ el, tx: Math.cos(rad) * dist, ty: Math.sin(rad) * dist });
  }

  anime({
    targets:   particles.map(p => p.el),
    translateX: (el, i) => particles[i].tx,
    translateY: (el, i) => particles[i].ty,
    opacity:   [1, 0],
    scale:     [1, 0],
    duration:  900,
    delay:     anime.stagger(20),
    easing:    "easeOutExpo",
    complete:  () => particles.forEach(p => p.el.remove()),
  });
};

/* ── Hover glow ── */
export const hoverGlow = (el, color = "rgba(0,247,255,0.4)") => {
  const enter = () =>
    anime({ targets: el, boxShadow: `0 0 24px ${color}`, duration: 300, easing: "easeOutQuad" });
  const leave = () =>
    anime({ targets: el, boxShadow: "0 0 0px transparent", duration: 300, easing: "easeOutQuad" });
  el.addEventListener("mouseenter", enter);
  el.addEventListener("mouseleave", leave);
  return () => { el.removeEventListener("mouseenter", enter); el.removeEventListener("mouseleave", leave); };
};

/* ── Modal open/close ── */
export const modalOpen = (overlay, panel) => {
  anime({ targets: overlay, opacity: [0, 1], duration: 250, easing: "easeOutQuad" });
  anime({ targets: panel, scale: [0.92, 1], opacity: [0, 1], duration: 350, easing: "easeOutBack" });
};

export const modalClose = (overlay, panel, cb) => {
  anime({ targets: overlay, opacity: [1, 0], duration: 200, easing: "easeInQuad", complete: cb });
  anime({ targets: panel, scale: [1, 0.92], opacity: [1, 0], duration: 200, easing: "easeInQuad" });
};

/* ── Pulse ring ── */
export const pulseRing = (el, color = "#00f7ff") =>
  anime({
    targets:   el,
    boxShadow: [`0 0 0 0 ${color}60`, `0 0 0 12px ${color}00`],
    duration:  1000,
    loop:      true,
    easing:    "easeOutQuad",
  });

export default anime;
