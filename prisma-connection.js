import { PrismaClient } from "@prisma/client";

async function testConnection() {
  // Crea un cliente de Prisma con opciones detalladas
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: "postgresql://postgres.kammuhwatpgwkaaoucbm:1trPdujLJZgvK2M1@aws-0-us-west-1.pooler.supabase.com:5432/postgres?sslmode=require",
      },
    },
    log: ["query", "info", "warn", "error"],
  });

  try {
    console.log("Intentando conectar a la base de datos...");
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log("Conexión exitosa:", result);
    return true;
  } catch (error) {
    console.error("Error de conexión detallado:", error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

testConnection().then((success) => {
  console.log(`Test de conexión: ${success ? "EXITOSO" : "FALLIDO"}`);
  process.exit(success ? 0 : 1);
});
