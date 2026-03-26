import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const equipos = await prisma.equipo.findMany({
    select: { id: true, nombre: true },
    orderBy: { id: 'asc' },
  })

  // Muestra en formato JSON legible
  console.log(JSON.stringify(equipos, null, 2))

  // O si prefieres un mapeo simple tipo objeto JS:
  // console.log(
  //   equipos.reduce((acc, e) => ({ ...acc, [e.nombre]: e.id }), {})
  // )
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
