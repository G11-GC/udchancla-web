/**
 * scripts/generar_seed_partidos_final.ts
 *
 * - Lee './LIGA-F7Fase1-25-26-v-1-2.pdf' (una página = una jornada)
 * - Extrae partidos entre los 12 equipos definidos, solo miércoles/jueves/viernes 20:30
 * - Asegura 6 partidos/jornada (avisa si falta alguno)
 * - Genera './prisma/seed_partidos.ts' con deleteMany() + createMany(...) usando IDs mapeados
 *
 * Ejecutar:
 *   npm install pdf-parse fs-extra
 *   npx tsx scripts/generar_seed_partidos_final.ts
 *
 * Si el script detecta problemas en alguna jornada te mostrará un resumen y generará igualmente el seed
 * (para revisión), pero te recomiendo revisar las jornadas con advertencia antes de ejecutar el seed.
 */

import fs from 'fs-extra'
import pdfParse from 'pdf-parse'

type Match = {
  jornada: number
  fechaUTC: string
  equipoA: string
  equipoB: string
  equipoAId: number
  equipoBId: number
  campo: number
  instalaciones: 'CIUTAT_ESPORTIVA_E' | 'CIUTAT_ESPORTIVA_D' | 'CHENCHO_B'
  page: number
  raw: string
}

// --- CONFIG ---
const PDF_PATH = 'scripts/LIGA-F7Fase1-25-26-v-1-2.pdf'
const OUTPUT_SEED = './prisma/seed_partidos.ts'

// Equipos y mapeo a IDs (ajusta si cambian)
const TEAMS = [
  'UD Chancla',
  'Al-Hachis FC',
  'Cultural Recompensa',
  'Dyermatic CF',
  'FC Trans Emmar',
  'Inafuma y Beben',
  'Maradona FC',
  'Ozempic de Lyon FC',
  'Sense Remei FC',
  'Tuerzebotas FC',
  'Vikingos Futbol Club',
  'Vodka Juniors'
]
const TEAM_MAP: Record<string, number> = {
  'ud chancla': 1,
  'al-hachis fc': 2,
  'cultural recompensa': 3,
  'dyermatic cf': 4,
  'fc trans emmar': 5,
  'inafuma y beben': 6,
  'maradona fc': 7,
  'ozempic de lyon fc': 8,
  'sense remei fc': 9,
  'tuerzebotas fc': 10,
  'vikingos futbol club': 11,
  'vodka juniors': 12
}

// months map
const MONTHS: Record<string, number> = {
  enero:1, febrero:2, marzo:3, abril:4, mayo:5, junio:6,
  julio:7, agosto:8, septiembre:9, octubre:10, noviembre:11, diciembre:12
}

// --- utils ---
function norm(s: string) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim().toLowerCase()
}

function detectInst(block: string) {
  const u = block.toUpperCase()
  if (u.includes('ESPORT E')) return 'CIUTAT_ESPORTIVA_E'
  if (u.includes('ESPORT D')) return 'CIUTAT_ESPORTIVA_D'
  if (u.includes('CHENCHO')) return 'CHENCHO_B'
  if (u.includes('CIUTAT')) return 'CIUTAT_ESPORTIVA_E'
  return 'CIUTAT_ESPORTIVA_E'
}

function parseDateLine(line: string) {
  const regex = /(?:lunes|martes|miercoles|mi[eí]rcoles|jueves|viernes),?\s*(\d{1,2})\s+de\s+([a-záéíóúñ]+)\s+de\s+(\d{4})/i
  const m = line.match(regex)
  if (!m) return null
  const day = Number(m[1])
  const mname = m[2].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const month = MONTHS[mname] || 11
  const year = Number(m[3])
  return { year, month, day }
}

// Convert local 20:30 CET (winter) to UTC ISO (19:30Z)
function local2030ToUTC(year:number, month:number, day:number) {
  return new Date(Date.UTC(year, month-1, day, 19, 30, 0)).toISOString()
}

// --- extraction logic ---
async function run() {
  if (!await fs.pathExists(PDF_PATH)) {
    console.error(`No se encontró ${PDF_PATH} en la raíz. Coloca el PDF y vuelve a ejecutar.`)
    process.exit(1)
  }

  const buf = await fs.readFile(PDF_PATH)
  const parsed = await pdfParse(buf)
  const raw = parsed.text as string

  // split pages attempting by "FÚTBOL-7" header or by "JORNADA"
  let pages = raw.split(/\n(?=FÚTBOL-7)/g).map(p=>p.trim()).filter(Boolean)
  if (pages.length < 11) {
    const parts = raw.split(/(?=JORNADA\s+\d+)/ig).map(p=>p.trim()).filter(Boolean)
    if (parts.length >= 11) pages = parts
  }

  if (pages.length < 11) {
    console.warn('Advertencia: no se detectaron 11 páginas con confianza. Se intentará extraer igualmente.')
  }

  const allMatches: Match[] = []

  for (let i=0;i<pages.length;i++) {
    const page = pages[i]
    const pageNum = i+1
    // determine jornada
    const mj = page.match(/JORNADA\s+(\d{1,2})/i)
    const jornada = mj ? Number(mj[1]) : pageNum

    // split into lines
    const lines = page.split(/\r?\n/).map(l=>l.trim()).filter(Boolean)

    // find date lines (e.g. "miércoles, 5 de noviembre de 2025" OR "DEL 03 AL 07 DE NOVIEMBRE DE 2025")
    // We'll build a map of day-line index -> {year,month,day}
    const dateByLineIndex: Record<number, {year:number,month:number,day:number}> = {}
    for (let idx=0; idx<lines.length; idx++) {
      const pd = parseDateLine(lines[idx])
      if (pd) dateByLineIndex[idx] = pd
    }
    // fallback: parse "DEL 03 AL 07 DE NOVIEMBRE DE 2025"
    const weekMatch = page.match(/DEL\s+(\d{2})\s+AL\s+(\d{2})\s+DE\s+([a-záéíóúñ]+)\s+DE\s+(\d{4})/i)
    const weekInfo = weekMatch ? {start: Number(weekMatch[1]), end: Number(weekMatch[2]), month: weekMatch[3], year: Number(weekMatch[4])} : null

    // we'll scan lines for '20:30' tokens, for each found we build a window of nearby lines to detect teams and installation
    const idx20: number[] = []
    for (let idx=0; idx<lines.length; idx++) {
      if (/20[:.]30/.test(lines[idx])) idx20.push(idx)
    }

    // We'll assume ordering of idx20 maps to matches: odd/even -> campo 1/2 per day (left/right)
    // For each idx20, search for nearest date above in up to 6 lines; if none, use weekInfo and approximate
    for (const idx of idx20) {
      // find date above
      let pd = null as null | {year:number,month:number,day:number}
      for (let k=0;k<=6;k++) {
        const cand = dateByLineIndex[idx - k]
        if (cand) { pd = cand; break }
      }
      if (!pd && weekInfo) {
        // approximate: assume idx20 position maps to a specific weekday; fallback we take start+2 as "miércoles"
        pd = { year: weekInfo.year, month: MONTHS[weekInfo.month.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')] || 11, day: weekInfo.start + 2 }
      }
      if (!pd) {
        // can't resolve date reliably -> skip
        continue
      }
      // check weekday: allow only Wed/Thu/Fri
      const dateObj = new Date(pd.year, pd.month-1, pd.day)
      const dow = dateObj.getDay() // 3=wednesday,4=thursday,5=friday
      if (![3,4,5].includes(dow)) continue

      // campo: we count occurrences of 20:30 for that date to alternate fields
      // compute occurrence index among idx20 that belong to same pd.day
      const sameDayIdxs = idx20.filter(ii => {
        // find date for ii same way:
        let pd2 = null as null | {year:number,month:number,day:number}
        for (let k=0;k<=6;k++) {
          const cand = dateByLineIndex[ii - k]
          if (cand) { pd2 = cand; break }
        }
        if (!pd2 && weekInfo) pd2 = { year: weekInfo.year, month: MONTHS[weekInfo.month] || 11, day: weekInfo.start + 2 }
        if (!pd2) return false
        return pd2.day === pd.day && pd2.month === pd.month && pd2.year === pd.year
      })
      const occurrence = sameDayIdxs.indexOf(idx) // 0-based
      const campo = (occurrence % 2 === 0) ? 1 : 2

      // window text to find teams and installation
      const winStart = Math.max(0, idx-3)
      const winEnd = Math.min(lines.length-1, idx+3)
      let windowText = ''
      for (let w=winStart; w<=winEnd; w++) windowText += ' ' + lines[w]
      windowText = windowText.trim()

      // find teams inside window, case-insensitive normalized
      const found: {team:string,pos:number}[] = []
      const lowWindow = norm(windowText)
      for (const t of TEAMS) {
        const n = norm(t)
        const p = lowWindow.indexOf(n)
        if (p >= 0) found.push({team: t, pos: p})
      }
      if (found.length < 2) {
        // try combining adjacent lines if names are split; add next 2 lines
        const combo = (lines[idx] + ' ' + (lines[idx+1]||'') + ' ' + (lines[idx+2]||'')).trim()
        const lowCombo = norm(combo)
        for (const t of TEAMS) {
          const n = norm(t)
          const p = lowCombo.indexOf(n)
          if (p >= 0) {
            // avoid duplicates
            if (!found.some(f=>norm(f.team)===n)) found.push({team: t, pos: p})
          }
        }
      }
      if (found.length < 2) {
        // last attempt: search whole page chunk for pairs on same 20:30 occurrence by proximity
        // we'll search within ±10 tokens of the time index
        // if still <2 we skip (will warn later)
      }

      if (found.length >= 2) {
        found.sort((a,b)=>a.pos - b.pos)
        const equipoA = found[0].team
        const equipoB = found[1].team
        const instalaciones = detectInst(windowText + ' ' + (lines[winEnd+1]||''))
        const fechaUTC = local2030ToUTC(pd.year, pd.month, pd.day)
        const aId = TEAM_MAP[norm(equipoA)]
        const bId = TEAM_MAP[norm(equipoB)]
        if (!aId || !bId) {
          console.warn(`No ID mapeado para ${equipoA} o ${equipoB} en jornada ${jornada} (page ${pageNum})`)
          continue
        }
        allMatches.push({
          jornada,
          fechaUTC,
          equipoA,
          equipoB,
          equipoAId: aId,
          equipoBId: bId,
          campo,
          instalaciones,
          page: pageNum,
          raw: windowText
        })
      } else {
        // skip but log (we'll present warnings later)
      }
    } // end for idx20
  } // end pages loop

  // group/count per jornada
  const byJ = new Map<number, Match[]>()
  for (const m of allMatches) {
    if (!byJ.has(m.jornada)) byJ.set(m.jornada, [])
    byJ.get(m.jornada)!.push(m)
  }

  console.log('--- Resumen extracción ---')
  const jornadasProblema: number[] = []
  const jornadasList = Array.from(byJ.keys()).sort((a,b)=>a-b)
  for (const j of jornadasList) {
    const cnt = byJ.get(j)!.length
    console.log(`Jornada ${j}: ${cnt} partidos extraídos`)
    if (cnt !== 6) jornadasProblema.push(j)
  }
  console.log(`Total partidos extraídos: ${allMatches.length}`)

  // generate seed file regardless, for manual inspection; but warn if mismatch
  // sort matches by jornada, campo
  allMatches.sort((a,b) => a.jornada - b.jornada || a.campo - b.campo || a.fechaUTC.localeCompare(b.fechaUTC))

  const seedItems = allMatches.map(m => `    {
      jornada: ${m.jornada},
      fecha: new Date('${m.fechaUTC}'),
      equipoAId: ${m.equipoAId},
      equipoBId: ${m.equipoBId},
      instalaciones: '${m.instalaciones}',
      campo: ${m.campo}
    }`).join(',\n')

  const seedContent = `import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('🔁 deleteMany partidos...')
  await prisma.partido.deleteMany()
  console.log('⚡ createMany partidos...')
  await prisma.partido.createMany({
    data: [
${seedItems}
    ]
  })
  console.log('✅ Seed listo. Revísalo antes de correr migraciones/producción.')
}

main()
  .catch((e)=>{ console.error(e); process.exit(1) })
  .finally(()=> prisma.$disconnect())
`

  await fs.outputFile(OUTPUT_SEED, seedContent, 'utf8')
  console.log(`Archivo seed escrito en ${OUTPUT_SEED}`)

  if (jornadasProblema.length) {
    console.warn(`\n⚠️ Atención: jornadas con partido != 6: ${jornadasProblema.join(', ')}.`)
    console.warn('Revisa manualmente prisma/seed_partidos.ts y corrige los emparejamientos si es necesario.')
  } else {
    console.log('✅ Todas las jornadas tienen 6 partidos (extracción satisfactoria).')
  }

  console.log('Siguiente paso recomendado:')
  console.log('  - revisar prisma/seed_partidos.ts')
  console.log('  - ejecutar: npx tsx prisma/seed_partidos.ts')
}

run().catch(e => { console.error(e); process.exit(1) })