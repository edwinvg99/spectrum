import { usePersonajes } from "../hooks/usePersonajes";
import AgentCard from "./AgentCard";
export default function PersonajesValorant() {
  const { personajes, cargando, error } = usePersonajes();

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="flex flex-col justify-center items-center  text-center">
          <div className="f w-12 h-12 border-3 border-slate-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300 text-lg font-semibold"></p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 text-center max-w-md">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-red-400 text-lg font-semibold">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')] bg-repeat">

      
      {/* Agents Grid - Ahora 1 o 2 columnas dependiendo del tamaño */}
      <div className="flex flex-col items-center justify-cente">
        <div className="flex flex-wrap justify-center gap-6 p-6 max-w-7xl m">
          {personajes.map((agente, idx) => (
            <AgentCard key={idx} agente={agente} />
          ))}
        </div>
      </div>
    </div>
  );
}

// const AgentCard = ({ agente }) => {
//   return (
//     <div className="group relative overflow-hidden border border-slate-700/50 backdrop-blur-md transition-all duration-300 bg-[#0F1923] min-h-[320px] rounded-xl">
//       {/* Fondo con patrón */}
//       <div className="absolute inset-0 opacity-10 pointer-events-none">
//         <div
//           className="absolute inset-0 bg-repeat bg-cover bg-center opacity-20"
//           style={{ backgroundImage: `url(${agente.fondo})` }}
//         ></div>
//       </div>

//       {/* Contenido principal */}
//       <div className="relative h-full z-10 p-6 flex flex-col">
//         {/* Encabezado con nombre */}
//         <div className="flex justify-start align-center ">
//           <h2 className="text-4xl font-black text-cyan-500 ml-4">
//             {agente.nombre}
//           </h2>

//           {/* Icono de rol */}
//           {agente.iconoRol && (
//             <div className="w-10 h-10 opacity-50">
//               <img
//                 src={agente.iconoRol}
//                 alt={agente.rol}
//                 className="w-full h-full object-contain"
//               />
//             </div>
//           )}
//         </div>

//         {/* Layout de 2 columnas */}
//         <div className="flex mt-2 gap-8 min-h-[220px] ">
//           {/* Imagen del agente */}
//           <div className="w-1/2 relative">
//             <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#0F1923] to-transparent"></div>
//             <img
//               src={agente.imagen}
//               alt={agente.nombre}
//               className="h-full w-full object-cover object-top"
//             />
//           </div>

//           {/* Habilidades */}
//           <div className="w-2/3 grid grid-cols-1 gap-4">
//             {agente.habilidades.slice(0, 4).map((habilidad, i) => (
//               <ValorantAbility key={i} habilidad={habilidad} />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ValorantAbility = ({ habilidad }) => {
//   return (
//     <div className="group flex gap-2">
//       {/* Icono de habilidad */}
//       <div className="flex-shrink-0">
//         <div className="w-10 h-10 rounded-md overflow-hidden bg-[#1A2733]">
//           <img
//             src={habilidad.icono}
//             alt={habilidad.nombre}
//             className="w-full h-full object-contain p-1"
//           />
//         </div>
//       </div>

//       {/* Información de habilidad */}
//       <div className="flex-1">
//         <h3 className="text-sm font-bold text-white mb-0.5">
//           {habilidad.nombre}
//         </h3>
//         <p className="text-xs text-slate-400 leading-snug">
//           {habilidad.descripcion}
//         </p>
//       </div>
//     </div>
//   );
// };
