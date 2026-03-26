import { PrismaClient, Instalaciones } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'

const prisma = new PrismaClient()

// Convierte fecha local (Europa/Madrid) a UTC real
function localToUTC(dateStr: string, timeStr: string): Date {
  const [day, month, year] = dateStr.split('/')
  const [hour, minute, second] = timeStr.split(':').map(Number)
  // Creamos la fecha en zona horaria local (CET/CEST)
  const localDate = new Date(Number(year), Number(month) - 1, Number(day), hour, minute, second)
  // Restamos el offset local → UTC
  return new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60_000)
}

async function main() {
  console.log('🧹 Borrando partidos anteriores...')
  await prisma.partido.deleteMany()

  const csvPath = path.resolve(__dirname, './matches.csv')
  if (!fs.existsSync(csvPath)) throw new Error(`❌ No se encontró el archivo CSV en: ${csvPath}`)

  console.log('📖 Leyendo', csvPath)
  const csvContent = fs.readFileSync(csvPath, 'utf-8')

  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  })

  const data = records.map((row: any, i: number) => {
    const fecha = localToUTC(row.fechaUTC, row.Hora)

    const instalacionesKey = row.instalaciones
      .replace(/\s+/g, '_')
      .toUpperCase() as keyof typeof Instalaciones

    if (!Instalaciones[instalacionesKey]) {
      throw new Error(`Instalación inválida en fila ${i + 2}: ${row.instalaciones}`)
    }

    return {
      jornada: Number(row.Jornada),
      fecha,
      equipoAId: Number(row.equipoAId),
      equipoBId: Number(row.equipoBId),
      instalaciones: Instalaciones[instalacionesKey],
      campo: Number(row.campo),
    }
  })

  console.log(`📦 Insertando ${data.length} partidos...`)
  await prisma.partido.createMany({ data })

  console.log('✅ Partidos insertados correctamente desde CSV (hora local → UTC)')
}

main()
  .catch((err) => {
    console.error('❌ Error al ejecutar el seed:', err)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
