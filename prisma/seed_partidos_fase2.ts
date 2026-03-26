import 'dotenv/config'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient, Instalaciones, Temporada, Fase } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import readline from 'readline'

const dbUrl   = process.env.DATABASE_URL!.replace('file:', '')
const adapter = new PrismaBetterSqlite3({ url: dbUrl })
const prisma  = new PrismaClient({ adapter })

const CSV_PATH = path.join(__dirname, '..', 'scripts', 'partidos_fase2.csv')

const INSTALACIONES_MAP: Record<string, string> = {
  'CIUTAT_ESPORTIVA':   'CIUTAT_ESPORTIVA',
  'CIUTAT_ESPORTIVA_D': Instalaciones.CIUTAT_ESPORTIVA_D,
  'CIUTAT_ESPORTIVA_E': Instalaciones.CIUTAT_ESPORTIVA_E,
  'CHENCHO_B':            Instalaciones.CHENCHO_B,
}

function parseDateTime(fechaStr: string, horaStr: string): Date {
  const [day, month, year] = fechaStr.split('/').map(Number)
  const [hh, mm, ss]       = horaStr.split(':').map(Number)
  return new Date(Date.UTC(year, month - 1, day, hh, mm, ss))
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
  // La liga SEGUNDA ya existe con id=2, la recuperamos sin crear
  const liga = await prisma.ligas.findFirstOrThrow({
    where: { temporada: Temporada.TEMPORADA_2025_2026, fase: Fase.SEGUNDA },
  })
  const ligaId = liga.id
  console.log(`🏆 [Fase 2] Liga id=${ligaId}`)

  const rows = await readCsv(CSV_PATH)
  console.log(`📂 [Fase 2] ${rows.length} partidos encontrados`)

  let creados = 0

  for (const row of rows) {
    const jornada       = Number(row['Jornada'])
    const fecha         = parseDateTime(row['fechaUTC'], row['Hora'])
    const equipoANombre = row['Equipo A']
    const equipoBNombre = row['Equipo B']
    const equipoAId     = Number(row['equipoAId'])
    const equipoBId     = Number(row['equipoBId'])
    const instalaciones = INSTALACIONES_MAP[row['instalaciones']]

    if (!instalaciones) {
      console.warn(`⚠️  Instalación desconocida: "${row['instalaciones']}" — omitiendo fila`)
      continue
    }

    await prisma.equipos.upsert({
      where:  { id: equipoAId },
      update: {},
      create: { id: equipoAId, nombre: equipoANombre },
    })
    await prisma.equipos.upsert({
      where:  { id: equipoBId },
      update: {},
      create: { id: equipoBId, nombre: equipoBNombre },
    })

    const existing = await prisma.partidos.findFirst({
      where: { jornada, equipoAId, equipoBId, ligaId },
    })

    if (existing) {
      console.log(`⚠️  Ya existe J${jornada}: ${equipoANombre} vs ${equipoBNombre} — omitido`)
      continue
    }

    await prisma.partidos.create({
      data: { jornada, fecha, instalaciones, campo: 1, ligaId, equipoAId, equipoBId },
    })

    console.log(`✅ J${jornada} ${row['fechaUTC']} — ${equipoANombre} vs ${equipoBNombre}`)
    creados++
  }

  console.log(`🏁 [Fase 2] Listo. ${creados} partidos creados.`)
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })