import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Params {
  id: string;
}

export async function GET(
  request: NextRequest, 
  context: { params: Promise<Params> }
) {
  try {
    const { id: idParam } = await context.params;
    const id = parseInt(idParam);

    const renovacion = await prisma.renovacionMarca.findUnique({
      where: { id },
      include: {
        marca: true
      }
    });

    if (!renovacion) {
      return NextResponse.json(
        { error: 'Renovación no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(renovacion);
  } catch (error) {
    console.error('Error al obtener renovación:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest, 
  context: { params: Promise<Params> }
) {
  try {
    const { id: idParam } = await context.params;
    const id = parseInt(idParam);
    const body = await request.json();
    
    const {
      numeroDeSolicitud,
      numeroDeRenovacion,
      marcaId,
      estadoRenovacion,
      fechaParaRenovacion,
      titular,
      apoderado,
      procesoSeguidoPor
    } = body;

    // Verificar que la renovación existe
    const renovacionExists = await prisma.renovacionMarca.findUnique({
      where: { id }
    });

    if (!renovacionExists) {
      return NextResponse.json(
        { error: 'Renovación no encontrada' },
        { status: 404 }
      );
    }

    // Validaciones básicas
    if (!numeroDeSolicitud || !marcaId || !estadoRenovacion || !fechaParaRenovacion || !titular || !apoderado) {
      return NextResponse.json(
        { error: 'Campos requeridos faltantes' },
        { status: 400 }
      );
    }

    // Verificar que la marca existe
    const marcaExists = await prisma.marca.findUnique({
      where: { id: parseInt(marcaId) }
    });

    if (!marcaExists) {
      return NextResponse.json(
        { error: 'La marca especificada no existe' },
        { status: 400 }
      );
    }

    // Verificar que no exista otra renovación con el mismo número de solicitud
    const existingRenovacion = await prisma.renovacionMarca.findFirst({
      where: { 
        numeroDeSolicitud,
        NOT: { id }
      }
    });

    if (existingRenovacion) {
      return NextResponse.json(
        { error: 'Ya existe otra renovación con este número de solicitud' },
        { status: 400 }
      );
    }

    const renovacionActualizada = await prisma.renovacionMarca.update({
      where: { id },
      data: {
        numeroDeSolicitud,
        numeroDeRenovacion: numeroDeRenovacion || null,
        marcaId: parseInt(marcaId),
        estadoRenovacion,
        fechaParaRenovacion: new Date(fechaParaRenovacion),
        titular,
        apoderado,
        procesoSeguidoPor: procesoSeguidoPor || null
      },
      include: {
        marca: true
      }
    });

    return NextResponse.json(renovacionActualizada);
  } catch (error) {
    console.error('Error al actualizar renovación:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest, 
  context: { params: Promise<Params> }
) {
  try {
    const { id: idParam } = await context.params;
    const id = parseInt(idParam);

    // Verificar que la renovación existe
    const renovacionExists = await prisma.renovacionMarca.findUnique({
      where: { id }
    });

    if (!renovacionExists) {
      return NextResponse.json(
        { error: 'Renovación no encontrada' },
        { status: 404 }
      );
    }

    await prisma.renovacionMarca.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: 'Renovación eliminada exitosamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al eliminar renovación:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
