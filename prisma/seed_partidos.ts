import { PrismaClient, Instalaciones } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.partido.deleteMany()

  await prisma.partido.createMany({
    data: [
      // --- Jornada 1 ---
      { jornada: 1, fecha: new Date('2025-10-29T19:30:00Z'), equipoAId: 1, equipoBId: 2, instalaciones: Instalaciones.CIUTAT_ESPORTIVA_E, campo: 1 },
      { jornada: 1, fecha: new Date('2025-10-29T19:30:00Z'), equipoAId: 3, equipoBId: 4, instalaciones: Instalaciones.CIUTAT_ESPORTIVA_D, campo: 2 },
      { jornada: 1, fecha: new Date('2025-10-30T19:30:00Z'), equipoAId: 5, equipoBId: 6, instalaciones: Instalaciones.CHENCHO_B, campo: 1 },
      { jornada: 1, fecha: new Date('2025-10-30T19:30:00Z'), equipoAId: 7, equipoBId: 8, instalaciones: Instalaciones.CIUTAT_ESPORTIVA_E, campo: 2 },
      { jornada: 1, fecha: new Date('2025-10-31T19:30:00Z'), equipoAId: 9, equipoBId: 10, instalaciones: Instalaciones.CIUTAT_ESPORTIVA_D, campo: 1 },
      { jornada: 1, fecha: new Date('2025-10-31T19:30:00Z'), equipoAId: 11, equipoBId: 12, instalaciones: Instalaciones.CHENCHO_B, campo: 2 },

      // --- Jornada 2 ---
      { jornada: 2, fecha: new Date('2025-11-05T19:30:00Z'), equipoAId: 1, equipoBId: 3, instalaciones: Instalaciones.CIUTAT_ESPORTIVA_E, campo: 1 },
      { jornada: 2, fecha: new Date('2025-11-05T19:30:00Z'), equipoAId: 2, equipoBId: 4, instalaciones: Instalaciones.CIUTAT_ESPORTIVA_D, campo: 2 },
      { jornada: 2, fecha: new Date('2025-11-06T19:30:00Z'), equipoAId: 5, equipoBId: 7, instalaciones: Instalaciones.CHENCHO_B, campo: 1 },
      { jornada: 2, fecha: new Date('2025-11-06T19:30:00Z'), equipoAId: 6, equipoBId: 8, instalaciones: Instalaciones.CIUTAT_ESPORTIVA_E, campo: 2 },
      { jornada: 2, fecha: new Date('2025-11-07T19:30:00Z'), equipoAId: 9, equipoBId: 11, instalaciones: Instalaciones.CIUTAT_ESPORTIVA_D, campo: 1 },
      { jornada: 2, fecha: new Date('2025-11-07T19:30:00Z'), equipoAId: 10, equipoBId: 12, instalaciones: Instalaciones.CHENCHO_B, campo: 2 },

      // --- Jornada 3 ---
      { jornada: 3, fecha: new Date('2025-11-12T19:30:00Z'), equipoAId: 1, equipoBId: 4, instalaciones: Instalaciones.CIUTAT_ESPORTIVA_E, campo: 1 },
      { jornada: 3, fecha: new Date('2025-11-12T19:30:00Z'), equipoAId: 2, equipoBId: 5, instalaciones: Instalaciones.CIUTAT_ESPORTIVA_D, campo: 2 },
      { jornada: 3, fecha: new Date('2025-11-13T19:30:00Z'), equipoAId: 3, equipoBId: 6, instalaciones: Instalaciones.CHENCHO_B, campo: 1 },
      { jornada: 3, fecha: new Date('2025-11-13T19:30:00Z'), equipoAId: 7, equipoBId: 9, instalaciones: Instalaciones.CIUTAT_ESPORTIVA_E, campo: 2 },
      { jornada: 3, fecha: new Date('2025-11-14T19:30:00Z'), equipoAId: 8, equipoBId: 10, instalaciones: Instalaciones.CIUTAT_ESPORTIVA_D, campo: 1 },
      { jornada: 3, fecha: new Date('2025-11-14T19:30:00Z'), equipoAId: 11, equipoBId: 12, instalaciones: Instalaciones.CHENCHO_B, campo: 2 },

      // --- Jornada 4 ---
      { jornada: 4, fecha: new Date('2025-11-19T19:30:00Z'), equipoAId: 1, equipoBId: 5, instalaciones: Instalaciones.CIUTAT_ESPORTIVA_E, campo: 1 },
      { jornada: 4, fecha: new Date('2025-11-19T19:30:00Z'), equipoAId: 2, equipoBId: 6, instalaciones: Instalaciones.CIUTAT_ESPORTIVA_D, campo: 2 },
      { jornada: 4, fecha: new Date('2025-11-20T19:30:00Z'), equipoAId: 3, equipoBId: 7, instalaciones: Instalaciones.CHENCHO_B, campo: 1 },
      { jornada: 4, fecha: new Date('2025-11-20T19:30:00Z'), equipoAId: 4, equipoBId: 8, instalaciones: Instalaciones.CIUTAT_ESPORTIVA_E, campo: 2 },
      { jornada: 4, fecha: new Date('2025-11-21T19:30:00Z'), equipoAId: 9, equipoBId: 11, instalaciones: Instalaciones.CIUTAT_ESPORTIVA_D, campo: 1 },
      { jornada: 4, fecha: new Date('2025-11-21T19:30:00Z'), equipoAId: 10, equipoBId: 12, instalaciones: Instalaciones.CHENCHO_B, campo: 2 },

      // --- Jornada 5 ---
      { jornada: 5, fecha: new Date('2025-11-26T19:30:00Z'), equipoAId: 1, equipoBId: 6, instalaciones: Instalaciones.CIUTAT_ESPORTIVA_E, campo: 1 },
      { jornada: 5, fecha: new Date('2025-11-26T19:30:00Z'), equipoAId: 2, equipoBId: 7, instalaciones: Instalaciones.CIUTAT_ESPORTIVA_D, campo: 2 },
      { jornada: 5, fecha: new Date('2025-11-27T19:30:00Z'), equipoAId: 3, equipoBId: 8, instalaciones: Instalaciones.CHENCHO_B, campo: 1 },
      { jornada: 5, fecha: new Date('2025-11-27T19:30:00Z'), equipoAId: 4, equipoBId: 9, instalaciones: Instalaciones.CIUTAT_ESPORTIVA_E, campo: 2 },
      { jornada: 5, fecha: new Date('2025-11-28T19:30:00Z'), equipoAId: 5, equipoBId: 10, instalaciones: Instalaciones.CIUTAT_ESPORTIVA_D, campo: 1 },
      { jornada: 5, fecha: new Date('2025-11-28T19:30:00Z'), equipoAId: 11, equipoBId: 12, instalaciones: Instalaciones.CHENCHO_B, campo: 2 },

      // --- Jornada 6 ---
      { jornada: 6, fecha: new Date('2025-12-03T19:30:00Z'), equipoAId: 1, equipoBId: 7, instalaciones: Instalaciones.CIUTAT_ESPORTIVA_E, campo: 1 },
      { jornada: 6, fecha: new Date('2025-12-03T19:30:00Z'), equipoAId: 2, equipoBId: 8, instalaciones: Instalaciones.CIUTAT_ESPORTIVA_D, campo: 2 },
      { jornada: 6, fecha: new Date('2025-12-04T19:30:00Z'), equipoAId: 3, equipoBId: 9, instalaciones: Instalaciones.CHENCHO_B, campo: 1 },
      { jornada: 6, fecha: new Date('2025-12-04T19:30:00Z'), equipoAId: 4, equipoBId: 10, instalaciones: Instalaciones.CIUTAT_ESPORTIVA_E, campo: 2 },
      { jornada: 6, fecha: new Date('2025-12-05T19:30:00Z'), equipoAId: 5, equipoBId: 11, instalaciones: Instalaciones.CIUTAT_ESPORTIVA_D, campo: 1 },
      { jornada: 6, fecha: new Date('2025-12-05T19:30:00Z'), equipoAId: 6, equipoBId: 12, instalaciones: Instalaciones.CHENCHO_B, campo: 2 },

      // --- Jornada 7 ---
      { jornada: 7, fecha: new Date('2025-12-10T19:30:00Z'), equipoAId: 1, equipoBId: 8, instalaciones: Instalaciones.CIUTAT_ESPORTIVA_E, campo: 1 },
      { jornada: 7, fecha: new Date('2025-12-10T19:30:00Z'), equipoAId: 2, equipoBId: 9, instalaciones: Instalaciones.CIUTAT_ESPORTIVA_D, campo: 2 },
      { jornada: 7, fecha: new Date('2025-12-11T19:30:00Z'), equipoAId: 3, equipoBId: 10, instalaciones: Instalaciones.CHENCHO_B, campo: 1 },
      { jornada: 7, fecha: new Date('2025-12-11T19:30:00Z'), equipoAId: 4, equipoBId: 11, instalaciones: Instalaciones.CIUTAT_ESPORTIVA_E, campo: 2 },
      { jornada: 7, fecha: new Date('2025-12-12T19:30:00Z'), equipoAId: 5, equipoBId: 12, instalaciones: Instalaciones.CIUTAT_ESPORTIVA_D, campo: 1 },
      { jornada: 7, fecha: new Date('2025-12-12T19:30:00Z'), equipoAId: 6, equipoBId: 7, instalaciones: Instalaciones.CHENCHO_B, campo: 2 },

      // --- Jornada 8 ---
      { jornada: 8, fecha: new Date('2025-12-17T19:30:00Z'), equipoAId: 1, equipoBId: 9, instalaciones: Instalaciones.CIUTAT_ESPORTIVA_E, campo: 1 },
      { jornada: 8, fecha: new Date('2025-12-17T19:30:00Z'), equipoAId: 2, equipoBId: 10, instalaciones: Instalaciones.CIUTAT_ESPORTIVA_D, campo: 2 },
      { jornada: 8, fecha: new Date('2025-12-18T19:30:00Z'), equipoAId: 3, equipoBId: 11, instalaciones: Instalaciones.CHENCHO_B, campo: 1 },
      { jornada: 8, fecha: new Date('2025-12-18T19:30:00Z'), equipoAId: 4, equipoBId: 12, instalaciones: Instalaciones.CIUTAT_ESPORTIVA_E, campo: 2 },
      { jornada: 8, fecha: new Date('2025-12-19T19:30:00Z'), equipoAId: 5, equipoBId: 6, instalaciones: Instalaciones.CIUTAT_ESPORTIVA_D, campo: 1 },
      { jornada: 8, fecha: new Date('2025-12-19T19:30:00Z'), equipoAId: 7, equipoBId: 8, instalaciones: Instalaciones.CHENCHO_B, campo: 2 },

      // --- Jornada 9 ---
      { jornada: 9, fecha: new Date('2026-01-07T19:30:00Z'), equipoAId: 1, equipoBId: 10, instalaciones: Instalaciones.CIUTAT_ESPORTIVA_E, campo: 1 },
      { jornada: 9, fecha: new Date('2026-01-07T19:30:00Z'), equipoAId: 2, equipoBId: 11, instalaciones: Instalaciones.CIUTAT_ESPORTIVA_D, campo: 2 },
      { jornada: 9, fecha: new Date('2026-01-08T19:30:00Z'), equipoAId: 3, equipoBId: 12, instalaciones: Instalaciones.CHENCHO_B, campo: 1 },
      { jornada: 9, fecha: new Date('2026-01-08T19:30:00Z'), equipoAId: 4, equipoBId: 5, instalaciones: Instalaciones.CIUTAT_ESPORTIVA_E, campo: 2 },
      { jornada: 9, fecha: new Date('2026-01-09T19:30:00Z'), equipoAId: 6, equipoBId: 7, instalaciones: Instalaciones.CIUTAT_ESPORTIVA_D, campo: 1 },
      { jornada: 9, fecha: new Date('2026-01-09T19:30:00Z'), equipoAId: 8, equipoBId: 9, instalaciones: Instalaciones.CHENCHO_B, campo: 2 },

      // --- Jornada 10 ---
      { jornada: 10, fecha: new Date('2026-01-14T19:30:00Z'), equipoAId: 1, equipoBId: 11, instalaciones: Instalaciones.CIUTAT_ESPORTIVA_E, campo: 1 },
      { jornada: 10, fecha: new Date('2026-01-14T19:30:00Z'), equipoAId: 2, equipoBId: 12, instalaciones: Instalaciones.CIUTAT_ESPORTIVA_D, campo: 2 },
      { jornada: 10, fecha: new Date('2026-01-15T19:30:00Z'), equipoAId: 3, equipoBId: 4, instalaciones: Instalaciones.CHENCHO_B, campo: 1 },
      { jornada: 10, fecha: new Date('2026-01-15T19:30:00Z'), equipoAId: 5, equipoBId: 7, instalaciones: Instalaciones.CIUTAT_ESPORTIVA_E, campo: 2 },
      { jornada: 10, fecha: new Date('2026-01-16T19:30:00Z'), equipoAId: 6, equipoBId: 8, instalaciones: Instalaciones.CIUTAT_ESPORTIVA_D, campo: 1 },
      { jornada: 10, fecha: new Date('2026-01-16T19:30:00Z'), equipoAId: 9, equipoBId: 10, instalaciones: Instalaciones.CHENCHO_B, campo: 2 },

      // --- Jornada 11 ---
      { jornada: 11, fecha: new Date('2026-01-21T19:30:00Z'), equipoAId: 1, equipoBId: 12, instalaciones: Instalaciones.CIUTAT_ESPORTIVA_E, campo: 1 },
      { jornada: 11, fecha: new Date('2026-01-21T19:30:00Z'), equipoAId: 2, equipoBId: 3, instalaciones: Instalaciones.CIUTAT_ESPORTIVA_D, campo: 2 },
      { jornada: 11, fecha: new Date('2026-01-22T19:30:00Z'), equipoAId: 4, equipoBId: 6, instalaciones: Instalaciones.CHENCHO_B, campo: 1 },
      { jornada: 11, fecha: new Date('2026-01-22T19:30:00Z'), equipoAId: 5, equipoBId: 8, instalaciones: Instalaciones.CIUTAT_ESPORTIVA_E, campo: 2 },
      { jornada: 11, fecha: new Date('2026-01-23T19:30:00Z'), equipoAId: 7, equipoBId: 9, instalaciones: Instalaciones.CIUTAT_ESPORTIVA_D, campo: 1 },
      { jornada: 11, fecha: new Date('2026-01-23T19:30:00Z'), equipoAId: 10, equipoBId: 11, instalaciones: Instalaciones.CHENCHO_B, campo: 2 },
    ]
  })

  console.log('✅ Partidos insertados correctamente')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
