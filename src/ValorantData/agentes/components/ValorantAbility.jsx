export default function ValorantAbility({ habilidad }) {
  return (
    <div className=" flex flex-row w-10 h-10 rounded-md bg-slate-700  ">
      {/* Icono de habilidad */}
          <img
            src={habilidad.icono}
            alt={habilidad.nombre}
            className="w-auto h-auto "
          />
    </div>
  );
}