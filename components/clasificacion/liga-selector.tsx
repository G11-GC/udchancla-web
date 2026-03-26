'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const TEMPORADA_LABELS: Record<string, string> = {
    TEMPORADA_2025_2026: '2025 / 2026',
    TEMPORADA_2026_2027: '2026 / 2027',
    TEMPORADA_2027_2028: '2027 / 2028',
    TEMPORADA_2028_2029: '2028 / 2029',
    TEMPORADA_2029_2030: '2029 / 2030',
}

const FASE_LABELS: Record<string, string> = {
    PRIMERA: 'Fase 1',
    SEGUNDA: 'Fase 2',
    VERANO: 'Verano',
    AMISTOSO: 'Amistoso',
    OTRO: 'Otro',
}

interface Liga {
    id: number
    temporada: string
    fase: string
}

interface LigaSelectorProps {
    ligas: Liga[]
    temporadaActual: string
    faseActual: string
}

export default function LigaSelector({ ligas, temporadaActual, faseActual }: LigaSelectorProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const temporadas = [...new Set(ligas.map(l => l.temporada))]
    const fasesDisponibles = ligas.filter(l => l.temporada === temporadaActual).map(l => l.fase)

    function navigate(temporada: string, fase: string) {
        const params = new URLSearchParams(searchParams.toString())
        params.set('temporada', temporada)
        params.set('fase', fase)
        router.push(`?${params.toString()}`)
    }

    function onTemporadaChange(temporada: string) {
        // Primera fase disponible de la nueva temporada
        const primeraFase = ligas.find(l => l.temporada === temporada)?.fase ?? faseActual
        navigate(temporada, primeraFase)
    }

    function onFaseChange(fase: string) {
        console.log(`LigaSelector: cambiando a fase=${fase} dentro de temporada=${temporadaActual}`)
        navigate(temporadaActual, fase)
    }

    return (
        <div className="flex items-center gap-1">
            {/* Selector temporada */}
            <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-xs md:btn-sm font-semibold text-base-content/60 hover:text-base-content gap-1">
                    {TEMPORADA_LABELS[temporadaActual] ?? temporadaActual}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                <ul tabIndex={0} className="dropdown-content z-20 menu menu-sm bg-base-200 rounded-box shadow-lg p-1 min-w-36 mt-1">
                    {temporadas.map(t => (
                        <li key={t}>
                            <button
                                className={t === temporadaActual ? 'active font-semibold' : ''}
                                onClick={() => onTemporadaChange(t)}
                            >
                                {TEMPORADA_LABELS[t] ?? t}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <span className="text-base-content/30 text-sm">·</span>

            {/* Selector fase */}
            <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-xs md:btn-sm font-bold text-primary gap-1">
                    {FASE_LABELS[faseActual] ?? faseActual}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                <ul tabIndex={0} className="dropdown-content z-20 menu menu-sm bg-base-200 rounded-box shadow-lg p-1 min-w-32 mt-1">
                    {fasesDisponibles.map(f => (
                        <li key={f}>
                            <button
                                className={f === faseActual ? 'active font-semibold' : ''}
                                onClick={() =>
                                    onFaseChange(f)
                                }
                            >
                                {FASE_LABELS[f] ?? f}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}