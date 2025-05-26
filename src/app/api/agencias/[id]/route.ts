import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PUT - Actualizar una agencia
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    const body = await request.json();

    // Extraer y convertir fechas si están presentes
    const updateData: Record<string, unknown> = {
      nombre: body.nombre,
      direccion: body.direccion,
      codigoContratoVigente: body.codigoContratoVigente,
      nitAgencia: body.nitAgencia,
      contratoAlquiler: body.contratoAlquiler,
      observaciones: body.observaciones,
      agenteId: body.agenteId,
      ciudadId: body.ciudadId,
    };

    // Convertir fechas si están presentes
    if (body.inicioContratoVigente) {
      updateData.inicioContratoVigente = new Date(body.inicioContratoVigente);
    }
    
    if (body.finContratoVigente) {
      updateData.finContratoVigente = new Date(body.finContratoVigente);
    }

    const agenciaActualizada = await prisma.agencia.update({
      where: { id },
      data: updateData,
      include: {
        agente: true,
        ciudad: true,
      }
    });

    return NextResponse.json({ 
      success: true,
      data: agenciaActualizada 
    });

  } catch (error) {
    console.error("Error al actualizar agencia:", error);
    return NextResponse.json(
      { error: "Error al actualizar la agencia" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar una agencia
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    await prisma.agencia.delete({
      where: { id }
    });

    return NextResponse.json({ 
      success: true,
      message: "Agencia eliminada correctamente" 
    });

  } catch (error) {
    console.error("Error al eliminar agencia:", error);
    return NextResponse.json(
      { error: "Error al eliminar la agencia" },
      { status: 500 }
    );
  }
}
