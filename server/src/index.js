const path = require("path");
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

// El .env se ignora en git, así que si falta se usan los valores por defecto
try {
  process.loadEnvFile(path.join(__dirname, "..", ".env"));
} catch (e) {
  process.env.DATABASE_URL = process.env.DATABASE_URL || "file:./dev.db";
}

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3002;
const raiz = path.join(__dirname, "..", "..");

app.use(cors());
app.use(express.json());

// Tapa la carpeta server y los archivos ocultos para que no se vea el .env
app.use((req, res, next) => {
  const partes = req.path.split("/").filter(Boolean);
  const tapado = partes.some((p) => p === "server" || p.startsWith("."));
  if (tapado) {
    return res.status(403).json({ error: "Acceso denegado" });
  }
  next();
});

app.use(express.static(raiz));

app.get("/api/tarjetas", async (req, res) => {
  const tarjetas = await prisma.tarjeta.findMany({ orderBy: { id: "asc" } });
  res.json(tarjetas);
});

app.get("/api/tarjetas/:id", async (req, res) => {
  const id = Number(req.params.id);
  const tarjeta = await prisma.tarjeta.findUnique({ where: { id } });
  if (!tarjeta) {
    return res.status(404).json({ error: "Tarjeta no encontrada" });
  }
  res.json(tarjeta);
});

app.post("/api/tarjetas", async (req, res) => {
  const tarjeta = await prisma.tarjeta.create({
    data: {
      nombre: req.body.nombre,
      tipo: req.body.tipo,
      numero: req.body.numero,
      serial: req.body.serial,
      activa: req.body.activa,
    },
  });
  res.status(201).json(tarjeta);
});

app.put("/api/tarjetas/:id", async (req, res) => {
  const id = Number(req.params.id);
  const existe = await prisma.tarjeta.findUnique({ where: { id } });
  if (!existe) {
    return res.status(404).json({ error: "Tarjeta no encontrada" });
  }
  const tarjeta = await prisma.tarjeta.update({
    where: { id },
    data: {
      nombre: req.body.nombre,
      tipo: req.body.tipo,
      numero: req.body.numero,
      serial: req.body.serial,
      activa: req.body.activa,
    },
  });
  res.json(tarjeta);
});

app.delete("/api/tarjetas/:id", async (req, res) => {
  const id = Number(req.params.id);
  const existe = await prisma.tarjeta.findUnique({ where: { id } });
  if (!existe) {
    return res.status(404).json({ error: "Tarjeta no encontrada" });
  }
  await prisma.tarjeta.delete({ where: { id } });
  res.json({ ok: true });
});

async function iniciar() {
  const total = await prisma.tarjeta.count();
  if (total === 0) {
    await prisma.tarjeta.createMany({
      data: [
        { nombre: "Samuel", tipo: "Personalizada", numero: "100123456789", serial: "A1B2C3D4" },
        { nombre: "Samuel", tipo: "Estudiante", numero: "100987654321", serial: "E5F6G7H8" },
        { nombre: "Samuel", tipo: "Básica", numero: "100555444333", serial: "B9C8D7E6" },
      ],
    });
  }
  app.listen(PORT, () => {
    console.log(`Servidor civica en http://localhost:${PORT}`);
    console.log("Base de datos lista (Prisma + SQLite)");
  });
}

iniciar();
