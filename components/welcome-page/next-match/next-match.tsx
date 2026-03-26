import getNextMatch from "@/lib/partidos/next-match";
import NextMatchCard from "./next-match-card";
import { XCircle } from "lucide-react";

export default async function NextMatch() {
  const nextMatch = await getNextMatch();

  if (!nextMatch) {
    return (
      <div className="p-4 text-center text-muted-foreground text-3xl">
        <XCircle className="inline-block text-red-500" /> Sin partidos programados.
      </div>
    );
  }

  return <NextMatchCard nextMatch={nextMatch} />;
}