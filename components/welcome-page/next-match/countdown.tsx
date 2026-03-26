"use client";
import { useState, useEffect, useMemo, memo } from "react";

interface CountdownProps {
  fecha: string | Date;
}

type TimeState = {
  dias: number; horas: number; minutos: number; segundos: number; hasEnded: boolean
} | null

function getTimeLeft(target: string | Date): Omit<NonNullable<TimeState>, never> {
  const diferencia = new Date(target).getTime() - Date.now();
  if (diferencia <= 0) return { dias: 0, horas: 0, minutos: 0, segundos: 0, hasEnded: true };
  const s = Math.floor(diferencia / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  return { dias: Math.floor(h / 24), horas: h % 24, minutos: m % 60, segundos: s % 60, hasEnded: false };
}

const Countdown = memo(function Countdown({ fecha }: CountdownProps) {
  // null en SSR → hidrata sin mismatch
  const [time, setTime] = useState<TimeState>(null)

  useEffect(() => {
    // Un único setState en el efecto inicial
    const tick = () => setTime(getTimeLeft(fecha))

    tick()
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [fecha])

  const display = useMemo(() => {
    if (!time) return null
    const f = (n: number) => n.toString().padStart(2, '0')
    return { dias: f(time.dias), horas: f(time.horas), minutos: f(time.minutos), segundos: f(time.segundos) }
  }, [time])

  if (time?.hasEnded) return <div className="text-center text-xl font-bold">🎉 ¡Empezó!</div>

  if (!display) return (
    <div className="grid grid-flow-col gap-3 text-center auto-cols-max">
      {["Días", "Horas", "Min", "Seg"].map(label => (
        <div key={label} className="flex flex-col items-center">
          <div className="text-3xl md:text-4xl --font-montserrat bg-linear-to-b from-red-600 to-red-700 text-transparent bg-clip-text animate-pulse">00</div>
          <div className="text-xs text-gray-500 mt-1">{label}</div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="grid grid-flow-col gap-3 text-center auto-cols-max">
      <TimeUnitDisplay label="Días"  value={display.dias}     />
      <TimeUnitDisplay label="Horas" value={display.horas}    />
      <TimeUnitDisplay label="Min"   value={display.minutos}  />
      <TimeUnitDisplay label="Seg"   value={display.segundos} />
    </div>
  )
})

const TimeUnitDisplay = memo(function TimeUnitDisplay({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-3xl md:text-4xl --font-montserrat bg-linear-to-b from-red-600 to-red-700 text-transparent bg-clip-text">
        {value}
      </div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  )
})

export default Countdown