import Image from "next/image";
import Escudo from "@/components/partidos/match-badge";
import Countdown from "./countdown";
import { Calendar, ChevronRight } from "lucide-react";
import MatchDate from "@/lib/partidos/match-date";
import { Suspense } from "react";
import Link from "next/link";
import { equipos, partidos } from "@prisma/client";

function CountdownFallback() {
  return (
    <div className="grid grid-flow-col gap-4 text-center auto-cols-max">
      {["Días", "Horas", "Minutos", "Segundos"].map((label) => (
        <div key={label} className="flex flex-col items-center">
          <div className="text-4xl md:text-5xl font-bold font-mono tracking-tight bg-lineal-to-b from-gray-300 to-gray-200 bg-clip-text text-transparent animate-pulse">
            00
          </div>
          <div className="text-xs md:text-sm mt-1 text-gray-400 font-medium">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}

type EquipoResumen = Pick<equipos, 'nombre' | 'escudo'>

export type NextMatchProps = Partial<partidos> & {
  equipos_partidosA: EquipoResumen
  equipos_partidosB: EquipoResumen
}

export default function NextMatchCard({ nextMatch }: { nextMatch: NextMatchProps }) {
  const rival = nextMatch.equipos_partidosA?.nombre === 'UD Chancla'
    ? nextMatch.equipos_partidosB
    : nextMatch.equipos_partidosA

  const [dia, hora] = MatchDate(nextMatch.fecha as Date) ?? ["", ""]

  return (
    <div className="flex flex-col card card-border border-primary/40 bg-base-200/40">
      <div className="mx-6 my-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg shadow-lg shadow-red-500/20">
              <Image
                src="/icons/ball.svg"
                alt="Pelota"
                width={20}
                height={20}
                className="invert"
                priority
              />
            </div>
            <div>
              <p className="text-xs uppercase text-primary">Próximo Encuentro</p>
              <h3 className="font-medium text-sm">Jornada {nextMatch.jornada}</h3>
            </div>
          </div>
          <div className="inline-flex flex-col items-end gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              vs {rival?.nombre}
              <Escudo nombre={rival?.nombre ?? ''} escudo={rival?.escudo} size="xs" />
            </div>
            <div className="flex items-center capitalize">
              {dia} - {hora}
              <Calendar className="text-primary ml-2 size-4" />
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-center items-center">
          <div className="container">
            <Suspense fallback={<CountdownFallback />}>
              <Countdown fecha={nextMatch.fecha as Date} />
            </Suspense>
          </div>
          <div className="card-actions justify-end">
            <Link href={`partidos/${nextMatch.id}`} className="btn btn-primary">
              Ir al partido <ChevronRight className="inline-block" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}