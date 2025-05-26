import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const estado = searchParams.get('estado') || '';
    const marcaId = searchParams.get('marcaId') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Construir filtros de búsqueda
    const where: {
      OR?: Array<{
        numeroDeSolicitud?: { contains: string; mode: 'insensitive' };
        numeroDeRenovacion?: { contains: string; mode: 'insensitive' };
        titular?: { contains: string; mode: 'insensitive' };
        apoderado?: { contains: string; mode: 'insensitive' };
        procesoSeguidoPor?: { contains: string; mode: 'insensitive' };
      }>;
      estadoRenovacion?: string;
      marcaId?: number;
    } = {};

    if (search) {
      where.OR = [
        { numeroDeSolicitud: { contains: search, mode: 'insensitive' } },
        { numeroDeRenovacion: { contains: search, mode: 'insensitive' } },
        { titular: { contains: search, mode: 'insensitive' } },
        { apoderado: { contains: search, mode: 'insensitive' } },
        { procesoSeguidoPor: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (estado) {
      where.estadoRenovacion = estado;
    }

    if (marcaId) {
      where.marcaId = parseInt(marcaId);
    }

    // Obtener renovaciones con marca relacionada
    const renovaciones = await prisma.renovacionMarca.findMany({
      where,
      include: {
        marca: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });

    // Contar total para paginación
    const total = await prisma.renovacionMarca.count({ where });

    return NextResponse.json({
      renovaciones,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error al obtener renovaciones:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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

    // Verificar que no exista ya una renovación con el mismo número de solicitud
    const existingRenovacion = await prisma.renovacionMarca.findFirst({
      where: { numeroDeSolicitud }
    });

    if (existingRenovacion) {
      return NextResponse.json(
        { error: 'Ya existe una renovación con este número de solicitud' },
        { status: 400 }
      );
    }

    const nuevaRenovacion = await prisma.renovacionMarca.create({
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

    return NextResponse.json(nuevaRenovacion, { status: 201 });
  } catch (error) {
    console.error('Error al crear renovación:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id');

    if (!idParam) {
      return NextResponse.json(
        { error: 'ID de renovación requerido' },
        { status: 400 }
      );
    }

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
