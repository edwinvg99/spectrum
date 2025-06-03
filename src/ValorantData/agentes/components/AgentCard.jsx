import ValorantAbility from "./ValorantAbility";

export default function AgentCard({ agente }) {
  // Función para generar un gradiente lineal a partir de los colores
  const generateLinearGradient = (colors) => {
    if (!colors || colors.length === 0) return 'none';
    const formattedColors = colors.map(color => `#${color.substring(0, 6)}`);
    return `linear-gradient(to bottom right, ${formattedColors.join(', ')})`;
  };

  const gradientHoverStyle = agente.gradientColors ? {
    backgroundImage: generateLinearGradient(agente.gradientColors)
  } : {};

  return (
    <div
      className="w-96 group relative overflow-hidden border border-slate-700/50 transition-all duration-300 bg-[#0F1923] min-h-[320px] rounded-xl"
    >
      {/* Capa para el gradiente que se activa solo en hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
        style={gradientHoverStyle}
      ></div>

      {/* Fondo con patrón e imagen */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div
          className="absolute inset-0 bg-repeat bg-cover bg-center opacity-30 blur-[2px] transition-all duration-500 ease-in-out group-hover:scale-125"
          style={{ backgroundImage: `url(${agente.fondo})` }}
        ></div>

        <div className="absolute inset-0 bg-radial-gradient-bottom-right opacity-40 transition-all duration-500 ease-in-out group-hover:opacity-60"></div>

        <div className="w-full absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0F1923] to-transparent">
          <img
            src={agente.imagen}
            alt={agente.nombre}
            className="h-full w-full object-cover object-top saturate-150 shadow-cyan-500/50"
          />
        </div>
      </div>

      {/* Habilidades */}
      <div className="w-full min-h-96 flex flex-col justify-center gap-2 m-5 relative z-20">
        {agente.habilidades.slice(0, 4).map((habilidad, i) => (
          <ValorantAbility key={i} habilidad={habilidad} />
        ))}
      </div>
    </div>
  );
}
