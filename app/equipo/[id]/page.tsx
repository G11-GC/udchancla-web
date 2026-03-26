import { Suspense } from "react";
import LoadingMain from "@/components/loaders-anim/loading-main";
import EquipoWrapper from "@/components/equipo/equipo-wrapper";

interface Props {
  params:       Promise<{ id: string }>
  searchParams: Promise<{ temporada?: string; fase?: string }>
}

export default async function EquipoPage({ params, searchParams }: Props) {
  const { id } = await params

  return (
    <div className="flex items-center justify-center w-full">
      <Suspense fallback={<LoadingMain />}>
        <EquipoWrapper equipoId={Number(id)} searchParams={searchParams} />
      </Suspense>
    </div>
  )
}