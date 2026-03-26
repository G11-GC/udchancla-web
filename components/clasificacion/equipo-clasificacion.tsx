import type { equipos, equipos_stats } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import TrendBadge from "./trend-badge"
;

type EquipoConStats = equipos_stats & { equipo: equipos }

export default function EquipoClasificacion({ equipo, index }: { equipo: EquipoConStats; index: number }) {
  const { equipo: info, ...stats } = equipo

  return (
    <Link href={`/equipo/${info.id}`}>
      <li
        key={info.id}
        className={`p-3 md:p-4 
          ${index < 6 ? "hover:bg-accent/10" : "hover:bg-primary/10"}
          transition-colors flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-0 bg-transparent cursor-pointer`}
      >
        {/* BLOQUE IZQUIERDO */}
        <div className="flex items-center md:items-start w-full md:w-auto flex-1 min-w-0 md:flex-nowrap flex-nowrap">
          {/* Posición */}
          <div
            className={`text-2xl md:text-3xl w-8 md:w-10 text-center tabular-nums shrink-0 ${
              index < 6 ? "text-accent" : index === 11 ? "text-warning" : "opacity-30"
            }`}
          >
            {index + 1}
          </div>

          {/* Escudo */}
          <div className="shrink-0 mx-2 md:mx-4">
            {info.escudo ? (
              <Image
                width={40}
                height={40}
                className="rounded-box md:w-12 md:h-12"
                src={`/images/${info.escudo}`}
                alt={info.nombre}
                loading="lazy"
              />
            ) : (
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-box bg-neutral/20 flex items-center justify-center">
                <span className="font-bold text-xs md:text-sm">{info.nombre.substring(0, 2).toUpperCase()}</span>
              </div>
            )}
          </div>

          {/* Nombre + stats en desktop */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="font-semibold text-base md:text-lg line-clamp-2 md:line-clamp-2 truncate">
              {info.nombre}
            </div>

            <div className="hidden md:flex gap-3 md:gap-4 text-xs opacity-80 mt-1 overflow-x-auto overflow-y-hidden pb-1 md:pb-0">
              <span className="font-semibold whitespace-nowrap">PJ: {stats.partidosJugados}</span>
              <span className="text-success font-semibold whitespace-nowrap">G: {stats.victorias}</span>
              <span className="whitespace-nowrap">E: {stats.empates}</span>
              <span className="text-error font-semibold whitespace-nowrap">P: {stats.derrotas}</span>
              <span className="whitespace-nowrap">GF: {stats.golesAFavor}</span>
              <span className="whitespace-nowrap">GC: {stats.golesEnContra}</span>
              <span
                className={`font-semibold whitespace-nowrap ${
                  stats.diferenciaGoles > 0 ? "text-success" : stats.diferenciaGoles < 0 ? "text-error" : ""
                }`}
              >
                DG: {stats.diferenciaGoles > 0 ? "+" : ""}
                {stats.diferenciaGoles}
              </span>
            </div>
          </div>

          {/* Puntos + trend */}
          <div className="flex items-center md:gap-4 gap-2 shrink-0 ml-auto pl-2">
            <div className="text-right">
              <div className={`text-xl md:text-2xl font-bold ${index < 6 ? "text-accent" : "text-primary"} leading-none`}>
                {stats.puntos}
              </div>
              <div className="hidden md:block text-[10px] md:text-xs uppercase font-semibold text-neutral">Puntos</div>
            </div>

            <Suspense fallback={<div className="badge badge-sm md:badge-lg badge-ghost animate-pulse w-8" />}>
              <TrendBadge equipoId={info.id} ligaId={stats.ligaId} />
            </Suspense>
          </div>
        </div>

        {/* Stats SOLO en móvil */}
        <div className="flex md:hidden gap-3 text-xs opacity-80 mt-1 overflow-x-auto pb-1 items-center justify-center w-full">
          <span className="font-semibold whitespace-nowrap">PJ: {stats.partidosJugados}</span>
          <span className="text-success font-semibold whitespace-nowrap">G: {stats.victorias}</span>
          <span className="whitespace-nowrap">E: {stats.empates}</span>
          <span className="text-error font-semibold whitespace-nowrap">P: {stats.derrotas}</span>
          <span className="whitespace-nowrap">GF: {stats.golesAFavor}</span>
          <span className="whitespace-nowrap">GC: {stats.golesEnContra}</span>
          <span
            className={`font-semibold whitespace-nowrap ${
              stats.diferenciaGoles > 0 ? "text-success" : stats.diferenciaGoles < 0 ? "text-error" : ""
            }`}
          >
            DG: {stats.diferenciaGoles > 0 ? "+" : ""}
            {stats.diferenciaGoles}
          </span>
        </div>
      </li>
    </Link>
  );
}