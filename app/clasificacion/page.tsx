import { ClasificacionWrapper } from "@/components/clasificacion/classif-wrapper";
import LoadingMain from "@/components/loaders-anim/loading-main";
import { Suspense } from "react";

interface Props {
  searchParams: Promise<{ temporada?: string; fase?: string }>
}

export default function Clasificacion({ searchParams }: Props) {
  return (
    <div className="flex items-center justify-center">
      <Suspense fallback={<LoadingMain />}>
        <ClasificacionWrapper searchParams={searchParams} />
      </Suspense>
    </div>
  );
}