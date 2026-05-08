import React from 'react';
import { useNoticiasValorant }  from '../hooks/useNews';
import { NewsLoadingSkeleton }  from '../../../sharred/loadingSkeletons';

function NoticiasValorantSection() {
  const { noticias, cargando, error } = useNoticiasValorant();

  if (cargando) return <NewsLoadingSkeleton />;

  if (error) {
    return (
      <div style={{
        padding: "32px 20px", textAlign: "center",
        background: "rgba(248,113,113,0.06)",
        border: "1px solid rgba(248,113,113,0.2)",
        borderRadius: 12,
      }}>
        <p style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, color: "#fca5a5", marginBottom: 4 }}>
          Error al cargar noticias
        </p>
        <p style={{ fontSize: "0.78rem", color: "rgba(248,113,113,0.6)" }}>{error}</p>
      </div>
    );
  }

  if (noticias.length === 0) {
    return (
      <p style={{
        textAlign: "center",
        fontFamily: "'Rajdhani', sans-serif",
        color: "rgba(255,255,255,0.3)",
        letterSpacing: "0.08em",
        padding: "40px 0",
      }}>
        No se encontraron noticias en este momento.
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {noticias.map((noticia, index) => (
        <a
          key={index}
          href={noticia.url_path}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            background: "rgba(10,18,32,0.75)",
            border: "1px solid rgba(0,247,255,0.1)",
            borderRadius: 12,
            padding: "18px 20px",
            textDecoration: "none",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = "rgba(0,247,255,0.28)";
            e.currentTarget.style.boxShadow   = "0 0 20px rgba(0,247,255,0.06)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "rgba(0,247,255,0.1)";
            e.currentTarget.style.boxShadow   = "none";
          }}
        >
          {/* Title */}
          <h3 style={{
            margin: "0 0 6px",
            fontFamily: "'Rajdhani', 'Impact', sans-serif",
            fontSize: "0.95rem",
            fontWeight: 700,
            letterSpacing: "0.02em",
            color: "#e2e8f0",
            lineHeight: 1.35,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {noticia.title}
          </h3>

          {/* Description */}
          {noticia.description && (
            <p style={{
              margin: "0 0 10px",
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.35)",
              lineHeight: 1.6,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}>
              {noticia.description}
            </p>
          )}

          {/* Footer row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontSize: "0.65rem",
              color: "rgba(255,255,255,0.22)",
              letterSpacing: "0.04em",
            }}>
              {new Date(noticia.date).toLocaleDateString('es-CO', {
                year: 'numeric', month: 'short', day: 'numeric',
              })}
            </span>
            <span style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(0,247,255,0.6)",
            }}>
              Leer más &rarr;
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}

export default NoticiasValorantSection;
