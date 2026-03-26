import MatchCard, { MatchCardProps } from "./match-card";

interface MatchDayGrouperProps {
  jornada: number;
  partidos: MatchCardProps["partido"][];
}

export default function MatchDayGrouper({ jornada, partidos }: MatchDayGrouperProps) {
  return (
    <div className="flex-auto collapse collapse-arrow bg-lineal-to-r from-transparent to-primary/30 rounded-box">
      <input type="checkbox" />
      <div className="collapse-title justify-center font-semibold">Jornada {jornada}</div>
      <div className="collapse-content text-sm">
        <div className="items-center justify-center flex flex-row flex-2 flex-wrap gap-6 transition">
          {partidos.map((partido, index) => (
            <MatchCard key={index} partido={partido} showResult={true} />
          ))}
        </div>
      </div>
    </div>
  );
}