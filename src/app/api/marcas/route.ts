import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import Marca from "@/data/Marca";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const marcas = await prisma.marca.findMany({
      include: {
        renovaciones: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const marcasConvertidas = marcas.map(marca => new Marca(
      marca.id,
      marca.nombre,
      marca.estado,
      marca.logotipoUrl,
      marca.genero,
      marca.tipo,
      marca.claseNiza,
      marca.numeroRegistro,
      marca.fechaRegistro,
      marca.tramiteArealizar,
      marca.fechaExpiracionRegistro,
      marca.fechaLimiteRenovacion,
      marca.titular,
      marca.apoderado,
      marca.createdAt,
      marca.renovaciones || []
    ));

    return NextResponse.json({
      message: "Marcas obtenidas correctamente",
      data: marcasConvertidas
    });
  } catch (error) {
    console.error("Error al obtener marcas:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      nombre,
      estado,
      logotipoUrl,
      genero,
      tipo,
      claseNiza,
      numeroRegistro,
      fechaRegistro,
      tramiteArealizar,
      fechaExpiracionRegistro,
      fechaLimiteRenovacion,
      titular,
      apoderado
    } = body;

    // Validaciones básicas
    if (!nombre || !genero || !tipo || !claseNiza || !numeroRegistro || !fechaRegistro || !titular || !apoderado) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    const nuevaMarca = await prisma.marca.create({
      data: {
        nombre,
        estado: estado || "renovada",
        logotipoUrl: logotipoUrl || null,
        genero,
        tipo,
        claseNiza,
        numeroRegistro,
        fechaRegistro: new Date(fechaRegistro),
        tramiteArealizar: tramiteArealizar || null,
        fechaExpiracionRegistro: fechaExpiracionRegistro ? new Date(fechaExpiracionRegistro) : null,
        fechaLimiteRenovacion: fechaLimiteRenovacion ? new Date(fechaLimiteRenovacion) : null,
        titular,
        apoderado
      }
    });

    return NextResponse.json({
      message: "Marca creada correctamente",
      data: nuevaMarca
    }, { status: 201 });
  } catch (error) {
    console.error("Error al crear marca:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID de marca requerido" },
        { status: 400 }
      );
    }

    // Verificar si la marca existe
    const marcaExistente = await prisma.marca.findUnique({
      where: { id: parseInt(id) }
    });

    if (!marcaExistente) {
      return NextResponse.json(
        { error: "Marca no encontrada" },
        { status: 404 }
      );
    }

    // Eliminar renovaciones asociadas primero
    await prisma.renovacionMarca.deleteMany({
      where: { marcaId: parseInt(id) }
    });

    // Eliminar la marca
    await prisma.marca.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({
      message: "Marca eliminada correctamente"
    });
  } catch (error) {
    console.error("Error al eliminar marca:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
