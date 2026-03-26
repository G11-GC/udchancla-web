import LoadingMain from "@/components/loaders-anim/loading-main";
import { MatchListWrapper } from "@/components/partidos/match-day-list-wrapper";
import { Suspense } from "react";

interface Props {
  searchParams: Promise<{ temporada?: string; fase?: string }>
}

export default function Partidos({ searchParams }: Props) {
  return (
    <div className="flex items-center justify-center">
      <Suspense fallback={<LoadingMain />}>
        <MatchListWrapper searchParams={searchParams} />
      </Suspense>
    </div>
  );
}