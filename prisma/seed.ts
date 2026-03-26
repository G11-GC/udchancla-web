import { execSync } from 'child_process'
import path from 'path'

function run(script: string) {
  console.log(`\n▶ Ejecutando ${script}...`)
  execSync(`tsx ${path.join('prisma', script)}`, { stdio: 'inherit' })
}
run('seed_partidos_fase2.ts')