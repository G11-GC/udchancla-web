import 'dotenv/config'
import BetterSqlite3 from 'better-sqlite3'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from '@prisma/client'
import path from 'path'

const dbUrl    = process.env.DATABASE_URL!.replace('file:', '')
// Conexión directa para leer/escribir valores crudos
const db       = new BetterSqlite3(path.resolve(dbUrl))
const adapter  = new PrismaBetterSqlite3({ url: dbUrl })
const prisma   = new PrismaClient({ adapter })

async function main() {
  // Leer fechas crudas directamente de SQLite
  const rows = db.prepare('SELECT id, fecha FROM partidos').all() as { id: number, fecha: unknown }[]

  let actualizados = 0

  for (const row of rows) {
    const raw = row.fecha

    // Si es un número entero (Unix ms) → convertir a ISO string
    if (typeof raw === 'number') {
      const iso = new Date(raw).toISOString()
      db.prepare('UPDATE partidos SET fecha = ? WHERE id = ?').run(iso, row.id)
      console.log(`✅ id=${row.id}  ${raw} → ${iso}`)
      actualizados++
    }
  }

  console.log(`\n🏁 ${actualizados} partidos actualizados.`)
}

main()
  .then(() => {
    db.close()
    return prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    db.close()
    await prisma.$disconnect()
    process.exit(1)
  })