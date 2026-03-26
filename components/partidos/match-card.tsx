import Image from "next/image";
import { Timer, Handshake, Trophy, UserX, X, HomeIcon, PlaneIcon } from "lucide-react";
import Escudo from "./match-badge";
import { CalendarFold } from "lucide-react";
import MatchDate from "@/lib/partidos/match-date";
import { Suspense } from "react";
import LoadingMain from "@/components/loaders-anim/loading-main";
import Link from "next/link";

const CHANCLA = 'UD Chancla'

interface PartidoStats {
  golesA:    number | null
  golesB:    number | null
  resultado: string | null
}

export interface MatchCardProps {
  partido: {
    id:           number;
    jornada:       number | null;
    fecha:         Date;
    instalaciones: string;
    campo:         number;
    equipoAId?:    number;
    equipoBId?:    number;
    equipos_partidosA: { nombre: string; escudo?: string | null };
    equipos_partidosB: { nombre: string; escudo?: string | null };
    partidos_stats?:   PartidoStats[];
  };
  showResult?:        boolean
  hideLogistica?:     boolean
  equipoDestacadoId?: number
}

export default function MatchCard({ partido, showResult = false, hideLogistica = false, equipoDestacadoId }: MatchCardProps) {
  const [dia, hora] = MatchDate(partido.fecha);
  const stats       = partido.partidos_stats?.[0]
  const hasResult   = showResult && stats?.resultado

  const esLocal     = equipoDestacadoId !== undefined && partido.equipoAId === equipoDestacadoId
  const esVisitante = equipoDestacadoId !== undefined && partido.equipoBId === equipoDestacadoId

  // Fondo verde al ganador solo cuando se muestran resultados sin equipo destacado
  const ganadorA = !equipoDestacadoId && stats?.resultado === 'A'
  const ganadorB = !equipoDestacadoId && stats?.resultado === 'B'

  
  const nombreA = equipoDestacadoId !== undefined && partido.equipoAId === equipoDestacadoId
  ? 'font-black text-primary'
  : (!equipoDestacadoId && partido.equipos_partidosA.nombre === CHANCLA)
    ? 'font-bold text-primary'
    : 'font-bold'

const nombreB = equipoDestacadoId !== undefined && partido.equipoBId === equipoDestacadoId
  ? 'font-black text-primary'
  : (!equipoDestacadoId && partido.equipos_partidosB.nombre === CHANCLA)
    ? 'font-bold text-primary'
    : 'font-bold'

  const getResultadoPerspectiva = () => {
    if (!stats?.resultado) return null
    const r = stats.resultado
    if (r === 'EMPATE')           return { texto: 'Empate',    color: 'text-gray-500',        bg: 'bg-gray-500/15',     icon: <Handshake size={20} /> }
    if (r === 'A' && esLocal)     return { texto: 'Victoria',  color: 'text-success',         bg: 'bg-success/15',      icon: <Trophy    size={20} /> }
    if (r === 'B' && esVisitante) return { texto: 'Victoria',  color: 'text-success',         bg: 'bg-success/15',      icon: <Trophy    size={20} /> }
    if (r === 'A' && esVisitante) return { texto: 'Derrota',   color: 'text-error',           bg: 'bg-error/15',        icon: <X         size={20} /> }
    if (r === 'B' && esLocal)     return { texto: 'Derrota',   color: 'text-error',           bg: 'bg-error/15',        icon: <X         size={20} /> }
    if (r === 'A_NO_PRESENTADO')  return { texto: 'NP Local',  color: 'text-base-content/50', bg: 'bg-base-content/10', icon: <UserX     size={20} /> }
    if (r === 'B_NO_PRESENTADO')  return { texto: 'NP Visita', color: 'text-base-content/50', bg: 'bg-base-content/10', icon: <UserX     size={20} /> }
    if (r === 'A') return { texto: 'Local',  color: 'text-gray-500', bg: 'bg-gray-500/15', icon: <HomeIcon size={20} /> }
    if (r === 'B') return { texto: 'Visita', color: 'text-gray-500',   bg: 'bg-gray-500/15',   icon: <PlaneIcon size={20} /> }
    return null
  }

  const res = getResultadoPerspectiva()

  const card = (
    <div className="group bg-red-400/10 border border-red-500/30 rounded-xl p-4 transition-all duration-300 hover:bg-red-400/20 hover:border-red-500 hover:shadow-md flex flex-col w-full min-w-0 sm:min-w-90 sm:max-w-[300px] flex-1 cursor-pointer">
      {/* Cabecera */}
      <div className="flex justify-between items-center mb-6 pb-2 border-b border-red-500/20 text-xs uppercase text-red-700 font-semibold">
        <span className="flex items-center gap-1">
          <CalendarFold size={14} /> Jornada {partido.jornada}
        </span>
        <span className="capitalize">{dia}</span>
      </div>

      {/* Cuerpo */}
      <div className="grid grid-cols-3 items-center gap-4 mb-6">
        {/* Equipo A */}
        <div className={`flex flex-col items-center group-hover:scale-105 transition-transform rounded-lg p-1 ${ganadorA ? '' : ''}`}>
          <Suspense fallback={<LoadingMain />}>
            <Escudo nombre={partido.equipos_partidosA.nombre} escudo={partido.equipos_partidosA.escudo} />
          </Suspense>
          <span className={`text-sm mt-2 text-center leading-tight min-h-10 flex items-center ${nombreA}`}>
            {partido.equipos_partidosA.nombre}
          </span>
        </div>

        {/* Centro: resultado o VS */}
        <div className="flex flex-col items-center justify-center gap-3">
          {hasResult && res ? (
            <>
              <div className="text-5xl font-[family-name:var(--font-bitcount)] text-red-600">
                {stats.golesA ?? '?'}-{stats.golesB ?? '?'}
              </div>
              <div className={`flex items-center gap-2 px-2 py-1 rounded-lg text-sm font-bold ${res.color} ${res.bg}`}>
                {res.icon}
                {res.texto}
              </div>
            </>
          ) : (
            <div className="relative h-12 w-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-red-500/40 overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <Image src="/icons/ball.svg" alt="Ball Icon" fill className="object-contain" />
              </div>
              <span className="relative z-10 text-white font-black text-sm tracking-tighter">VS</span>
            </div>
          )}
        </div>

        {/* Equipo B */}
        <div className={`flex flex-col items-center group-hover:scale-105 transition-transform rounded-lg p-1 ${ganadorB ? '' : ''}`}>
          <Suspense fallback={<LoadingMain />}>
            <Escudo nombre={partido.equipos_partidosB.nombre} escudo={partido.equipos_partidosB.escudo} />
          </Suspense>
          <span className={`text-sm mt-2 text-center leading-tight min-h-10 flex items-center ${nombreB}`}>
            {partido.equipos_partidosB.nombre}
          </span>
        </div>
      </div>

      {/* Pie */}
      {!hideLogistica && (
        <div className="mt-auto pt-3 border-t border-red-500/10 flex justify-between items-center text-xs text-gray-700">
          <div className="flex items-center gap-1.5 bg-white/50 px-2 py-1 rounded-md">
            <Timer size={14} className="text-red-600" />
            <span className="font-[family-name:var(--font-7-segment)]">{hora}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/50 px-2 py-1 rounded-md max-w-[60%]">
            <span className="truncate uppercase font-medium">
              {partido.instalaciones.replaceAll("_", " ")} - C{partido.campo}
            </span>
            <Image src="/icons/pitch_edit2.svg" alt="Pitch" width={14} height={14} />
          </div>
        </div>
      )}
    </div>
  )

  if (partido.id) {
    return (
      <Link href={`/partidos/${partido.id}`} className="w-full sm:w-auto sm:min-w-90 sm:max-w-[300px] flex-1">
        {card}
      </Link>
    )
  }

  return <div className="w-full sm:w-auto sm:min-w-90 sm:max-w-[300px] flex-1">{card}</div>
}