import 'dotenv/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient, Resultado, equipos_stats } from '@prisma/client';

const dbUrl = process.env.DATABASE_URL!;
const adapter = new PrismaBetterSqlite3({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  const LIGA_ID = 1; 
  console.log(`📊 Procesando estadísticas para Liga ID: ${LIGA_ID}`);

  const partidosRaw = await prisma.partidos.findMany({
    where: { ligaId: LIGA_ID },
    include: { partidos_stats: true },
  });

  // Usamos el tipo generado por Prisma directamente
  // Omitimos 'id' porque el Map solo guarda los acumuladores
  const statsMap = new Map<number, Omit<equipos_stats, 'id'>>();

  const getInitStats = (equipoId: number): Omit<equipos_stats, 'id'> => ({
    partidosJugados: 0,
    victorias: 0,
    empates: 0,
    derrotas: 0,
    puntos: 0,
    golesAFavor: 0,
    golesEnContra: 0,
    diferenciaGoles: 0,
    descalificado: false, // Incluido por el tipo de Prisma
    equipoId,
    ligaId: LIGA_ID
  });

  for (const partido of partidosRaw) {
    const s = partido.partidos_stats[0];
    if (!s) continue;

    const idA = partido.equipoAId;
    const idB = partido.equipoBId;

    if (!statsMap.has(idA)) statsMap.set(idA, getInitStats(idA));
    if (!statsMap.has(idB)) statsMap.set(idB, getInitStats(idB));

    const statsA = statsMap.get(idA)!;
    const statsB = statsMap.get(idB)!;

    statsA.golesAFavor += s.golesA;
    statsA.golesEnContra += s.golesB;
    statsB.golesAFavor += s.golesB;
    statsB.golesEnContra += s.golesA;
    statsA.partidosJugados++;
    statsB.partidosJugados++;

    if (s.resultado === Resultado.A || s.golesA > s.golesB) {
      statsA.victorias++; statsA.puntos += 3;
      statsB.derrotas++;
    } else if (s.resultado === Resultado.B || s.golesB > s.golesA) {
      statsB.victorias++; statsB.puntos += 3;
      statsA.derrotas++;
    } else {
      statsA.empates++; statsB.empates++;
      statsA.puntos += 1; statsB.puntos += 1;
    }
  }

  console.log("💾 Sincronizando con la base de datos...");
  
  for (const [equipoId, data] of statsMap) {
    data.diferenciaGoles = data.golesAFavor - data.golesEnContra;

    // Prisma ya sabe que 'data' cumple con casi todo el modelo equipos_stats
    await prisma.equipos_stats.upsert({
      where: {
        equipoId_ligaId: { equipoId, ligaId: LIGA_ID }
      },
      update: {
        partidosJugados: data.partidosJugados,
        victorias: data.victorias,
        empates: data.empates,
        derrotas: data.derrotas,
        puntos: data.puntos,
        golesAFavor: data.golesAFavor,
        golesEnContra: data.golesEnContra,
        diferenciaGoles: data.diferenciaGoles,
      },
      create: data,
    });
  }

  console.log("✅ Tabla de clasificación actualizada.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());