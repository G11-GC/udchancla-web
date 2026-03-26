-- CreateTable
CREATE TABLE "equipos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "escudo" TEXT,
    "partidosJugados" INTEGER NOT NULL DEFAULT 0,
    "victorias" INTEGER NOT NULL DEFAULT 0,
    "empates" INTEGER NOT NULL DEFAULT 0,
    "derrotas" INTEGER NOT NULL DEFAULT 0,
    "puntos" INTEGER NOT NULL DEFAULT 0,
    "golesAFavor" INTEGER NOT NULL DEFAULT 0,
    "golesEnContra" INTEGER NOT NULL DEFAULT 0,
    "diferenciaGoles" INTEGER NOT NULL DEFAULT 0,
    "descalificado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "jugadores" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dorsal" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "apariciones" INTEGER NOT NULL DEFAULT 0,
    "partidosSancionado" INTEGER NOT NULL DEFAULT 0,
    "apercibido" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "JugadoresStats" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "jugadorId" INTEGER NOT NULL,
    "partidos" INTEGER NOT NULL DEFAULT 0,
    "goles" INTEGER NOT NULL DEFAULT 0,
    "asistencias" INTEGER NOT NULL DEFAULT 0,
    "tarjetasAmarillas" INTEGER NOT NULL DEFAULT 0,
    "tarjetasRojas" INTEGER NOT NULL DEFAULT 0,
    "porteriasACero" INTEGER NOT NULL DEFAULT 0,
    "fase" TEXT NOT NULL DEFAULT 'PRIMERA',
    CONSTRAINT "JugadoresStats_jugadorId_fkey" FOREIGN KEY ("jugadorId") REFERENCES "jugadores" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sanciones" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "jugadorId" INTEGER NOT NULL,
    "jornadaInicio" INTEGER NOT NULL,
    "jornadaFin" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "sanciones_jugadorId_fkey" FOREIGN KEY ("jugadorId") REFERENCES "jugadores" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "partidos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "equipoAId" INTEGER NOT NULL,
    "equipoBId" INTEGER NOT NULL,
    "golesA" INTEGER,
    "golesB" INTEGER,
    "amarillasA" INTEGER,
    "amarillasB" INTEGER,
    "rojasA" INTEGER,
    "rojasB" INTEGER,
    "jornada" INTEGER NOT NULL,
    "fecha" DATETIME NOT NULL,
    "instalaciones" TEXT NOT NULL,
    "campo" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fase" TEXT NOT NULL DEFAULT 'PRIMERA',
    CONSTRAINT "partidos_equipoAId_fkey" FOREIGN KEY ("equipoAId") REFERENCES "equipos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "partidos_equipoBId_fkey" FOREIGN KEY ("equipoBId") REFERENCES "equipos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "jugadores_partidos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "jugadorId" INTEGER NOT NULL,
    "partidoId" INTEGER NOT NULL,
    "goles" INTEGER NOT NULL DEFAULT 0,
    "asistencias" INTEGER NOT NULL DEFAULT 0,
    "tarjetasAmarillas" INTEGER NOT NULL DEFAULT 0,
    "tarjetasRojas" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "jugadores_partidos_jugadorId_fkey" FOREIGN KEY ("jugadorId") REFERENCES "jugadores" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "jugadores_partidos_partidoId_fkey" FOREIGN KEY ("partidoId") REFERENCES "partidos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "goles_partidos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orden" INTEGER NOT NULL,
    "goleadorId" INTEGER NOT NULL,
    "partidoId" INTEGER NOT NULL,
    "asistenteId" INTEGER,
    CONSTRAINT "goles_partidos_goleadorId_fkey" FOREIGN KEY ("goleadorId") REFERENCES "jugadores" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "goles_partidos_partidoId_fkey" FOREIGN KEY ("partidoId") REFERENCES "partidos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "goles_partidos_asistenteId_fkey" FOREIGN KEY ("asistenteId") REFERENCES "jugadores" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "jugadores_dorsal_key" ON "jugadores"("dorsal");

-- CreateIndex
CREATE UNIQUE INDEX "JugadoresStats_jugadorId_key" ON "JugadoresStats"("jugadorId");
