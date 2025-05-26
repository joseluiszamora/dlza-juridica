import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const marca = await prisma.marca.findUnique({
      where: { id: parseInt(id) },
      include: {
        renovaciones: true
      }
    });

    if (!marca) {
      return NextResponse.json(
        { error: "Marca no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Marca obtenida correctamente",
      data: marca
    });
  } catch (error) {
    console.error("Error al obtener marca:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const marcaActualizada = await prisma.marca.update({
      where: { id: parseInt(id) },
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
      message: "Marca actualizada correctamente",
      data: marcaActualizada
    });
  } catch (error) {
    console.error("Error al actualizar marca:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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
