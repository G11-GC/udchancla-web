import 'dotenv/config'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient, Instalaciones, Resultado } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import readline from 'readline'

const dbUrl   = process.env.DATABASE_URL!.replace('file:', '')
const adapter = new PrismaBetterSqlite3({ url: dbUrl })
const prisma  = new PrismaClient({ adapter })

const CSV_PATH = path.join(__dirname, '..', 'scripts', 'resultados_fase1.csv');

const RESULTADO_MAP: Record<string, Resultado> = {
  'A':               Resultado.A,
  'B':               Resultado.B,
  'EMPATE':          Resultado.EMPATE,
  'A_NO_PRESENTADO': Resultado.A_NO_PRESENTADO,
  'B_NO_PRESENTADO': Resultado.B_NO_PRESENTADO,
}

async function readCsv(filePath: string): Promise<Record<string, string>[]> {
  const rows: Record<string, string>[] = []
  const rl = readline.createInterface({ input: fs.createReadStream(filePath), crlfDelay: Infinity })
  let headers: string[] | null = null
  for await (const line of rl) {
    if (!headers) { headers = line.split(','); continue }
    const values = line.split(',')
    const row: Record<string, string> = {}
    headers.forEach((h, i) => { row[h.trim()] = (values[i] ?? '').trim() })
    rows.push(row)
  }
  return rows
}

async function main() {
  const rows = await readCsv(CSV_PATH)
  console.log(`📂 [Fase 1] ${rows.length} resultados encontrados`)

  const PARTIDOS_POR_JORNADA = 6

  for (let i = 0; i < rows.length; i++) {
    const row     = rows[i]
    const jornada = Math.floor(i / PARTIDOS_POR_JORNADA) + 1

    const equipoAId = Number(row['idA'])
    const equipoBId = Number(row['idB'])
    const golesA    = row['golesA'] !== '' ? Number(row['golesA']) : 0
    const golesB    = row['golesB'] !== '' ? Number(row['golesB']) : 0
    const ganador   = row['ganador']

    await prisma.equipos.upsert({
      where:  { id: equipoAId },
      update: {},
      create: { id: equipoAId, nombre: row['equipoA'] },
    })
    await prisma.equipos.upsert({
      where:  { id: equipoBId },
      update: {},
      create: { id: equipoBId, nombre: row['equipoB'] },
    })

    let partido = await prisma.partidos.findFirst({
      where: { jornada, equipoAId, equipoBId },
    })

    if (!partido) {
      const fecha = new Date(Date.UTC(2026, 0, 1 + (jornada - 1) * 7))
      partido = await prisma.partidos.create({
        data: { jornada, fecha, instalaciones: Instalaciones.CHENCHO_B, campo: 1, equipoAId, equipoBId },
      })
    }

    const resultado      = RESULTADO_MAP[ganador] ?? null
    const no_presentadoA = ganador === 'A_NO_PRESENTADO'
    const no_presentadoB = ganador === 'B_NO_PRESENTADO'

    await prisma.partidos_stats.upsert({
      where:  { partidoId: partido.id },
      update: { golesA, golesB, no_presentadoA, no_presentadoB, resultado },
      create: { partidoId: partido.id, golesA, golesB, no_presentadoA, no_presentadoB, resultado },
    })

    console.log(`✅ J${jornada} ${row['equipoA']} ${golesA} - ${golesB} ${row['equipoB']}  → ${ganador}`)
  }

  console.log('🏁 [Fase 1] Listo.')
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })