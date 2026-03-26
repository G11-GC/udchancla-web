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

// Función para normalizar fecha a UTC
function normalizeToUTC(raw: unknown): string | null {
  if (!raw) return null

  try {
    let date: Date

    // Caso 1: Es un número (Unix timestamp en ms)
    if (typeof raw === 'number') {
      date = new Date(raw)
    }
    // Caso 2: Es un string
    else if (typeof raw === 'string') {
      // Reemplazar +00:00 con Z para consistencia
      const normalizedStr = raw.replace('+00:00', 'Z')
      date = new Date(normalizedStr)
    }
    // Caso 3: Es un objeto Date (poco probable desde SQLite)
    else if (raw instanceof Date) {
      date = raw
    }
    // Caso 4: Otros tipos no válidos
    else {
      console.warn(`⚠️  Tipo de dato no soportado: ${typeof raw} para valor: ${raw}`)
      return null
    }

    // Validar si la fecha es válida
    if (isNaN(date.getTime())) {
      console.warn(`⚠️  Fecha inválida: ${raw}`)
      return null
    }

    // Obtener componentes UTC
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const day = String(date.getUTCDate()).padStart(2, '0')
    const hours = String(date.getUTCHours()).padStart(2, '0')
    const minutes = String(date.getUTCMinutes()).padStart(2, '0')
    const seconds = String(date.getUTCSeconds()).padStart(2, '0')
    const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0')

    // Formato ISO estricto con Z (UTC)
    const isoUTC = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`

    return isoUTC
  } catch (error) {
    console.warn(`⚠️  Error procesando fecha: ${raw}`, error)
    return null
  }
}

// Función para mostrar fecha legible
function formatDateForLog(isoString: string): string {
  const match = isoString.match(/(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/)
  if (match) {
    return `${match[1]} ${match[2]} UTC`
  }
  return isoString
}

async function main() {
  console.log('🔍 Leyendo fechas de la tabla "partidos"...\n')
  
  // Leer fechas crudas directamente de SQLite
  const rows = db.prepare('SELECT id, fecha FROM partidos').all() as { id: number, fecha: unknown }[]
  
  let actualizados = 0
  let omitidos = 0

  for (const row of rows) {
    const raw = row.fecha
    const fechaActual = raw as string

    // Normalizar a UTC
    const fechaNormalizada = normalizeToUTC(raw)

    if (!fechaNormalizada) {
      console.log(`⏭️  id=${row.id}  omitido (fecha inválida o nula)`)
      omitidos++
      continue
    }

    // Si ya está en formato UTC con Z y la hora es correcta, omitir
    const yaEsUTC = typeof fechaActual === 'string' && 
                    fechaActual.endsWith('Z') && 
                    !fechaActual.includes('+')

    if (yaEsUTC) {
      // Verificar si la hora UTC ya es correcta
      const horaActual = fechaActual.match(/T(\d{2}:\d{2})/)?.[1]
      const horaNormalizada = fechaNormalizada.match(/T(\d{2}:\d{2})/)?.[1]
      
      if (horaActual === horaNormalizada) {
        console.log(`✓  id=${row.id}  ya está normalizado: ${formatDateForLog(fechaNormalizada)}`)
        continue
      }
    }

    // Actualizar con la fecha normalizada
    db.prepare('UPDATE partidos SET fecha = ? WHERE id = ?').run(fechaNormalizada, row.id)
    
    // Mostrar cambio
    console.log(`🔄 id=${row.id}`)
    console.log(`   Antes: ${raw}`)
    console.log(`   Ahora: ${formatDateForLog(fechaNormalizada)}`)
    console.log()
    
    actualizados++
  }

  // Resumen final
  console.log('═'.repeat(50))
  console.log(`📊 Resumen:`)
  console.log(`   ✅ Actualizados: ${actualizados}`)
  console.log(`   ⏭️  Omitidos: ${omitidos}`)
  console.log(`   📝 Total procesados: ${rows.length}`)
  console.log('═'.repeat(50))

  if (actualizados > 0) {
    console.log('\n✨ Verifica que las fechas ahora muestren la hora correcta:')
    const muestras = db.prepare('SELECT id, fecha FROM partidos LIMIT 3').all() as { id: number, fecha: string }[]
    muestras.forEach(m => {
      const hora = m.fecha.match(/T(\d{2}:\d{2})/)?.[1] || 'N/A'
      console.log(`   id=${m.id} → ${m.fecha} (hora: ${hora} UTC)`)
    })
  }
}

main()
  .then(() => {
    db.close()
    return prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error:', e)
    db.close()
    await prisma.$disconnect()
    process.exit(1)
  })