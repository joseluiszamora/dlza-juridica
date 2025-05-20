import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Obtener todos los agentes o uno específico por ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      // Obtener un agente específico con sus agencias relacionadas
      const agente = await prisma.agente.findUnique({
        where: { id: parseInt(id) },
        include: {
          agencias: true,
        },
      });

      if (!agente) {
        return NextResponse.json(
          { error: "Agente no encontrado" },
          { status: 404 }
        );
      }

      return NextResponse.json({ data: agente });
    } else {
      // Obtener todos los agentes
      const agentes = await prisma.agente.findMany({
        include: {
          agencias: {
            select: {
              id: true,
              nombre: true,
            },
          },
        },
        orderBy: {
          apellidos: 'asc',
        },
      });
      return NextResponse.json({ data: agentes });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error al obtener agentes" },
      { status: 500 }
    );
  }
}

// POST - Crear un nuevo agente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validación básica
    if (!body.nombres || !body.apellidos || !body.documento || !body.celular) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // Convertir fechas de string a Date si existen
    if (body.fechaNacimiento) {
      body.fechaNacimiento = new Date(body.fechaNacimiento);
    }

    // Crear el agente
    const agente = await prisma.agente.create({
      data: body,
    });

    return NextResponse.json({ data: agente }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error al crear agente" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar un agente existente
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "ID de agente requerido" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validación básica
    if (!body.nombres || !body.apellidos || !body.documento || !body.celular) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // Convertir fechas de string a Date si existen
    if (body.fechaNacimiento) {
      body.fechaNacimiento = new Date(body.fechaNacimiento);
    }

    // Verificar si el agente existe
    const agenteExistente = await prisma.agente.findUnique({
      where: { id: parseInt(id) }
    });

    if (!agenteExistente) {
      return NextResponse.json(
        { error: "Agente no encontrado" },
        { status: 404 }
      );
    }

    // Actualizar el agente
    const agenteActualizado = await prisma.agente.update({
      where: { id: parseInt(id) },
      data: body,
    });

    return NextResponse.json({ data: agenteActualizado });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error al actualizar agente" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un agente
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "ID de agente requerido" },
        { status: 400 }
      );
    }

    // Verificar si el agente existe
    const agenteExistente = await prisma.agente.findUnique({
      where: { id: parseInt(id) },
      include: {
        agencias: true,
      },
    });

    if (!agenteExistente) {
      return NextResponse.json(
        { error: "Agente no encontrado" },
        { status: 404 }
      );
    }

    // Verificar si hay agencias asociadas a este agente
    if (agenteExistente.agencias.length > 0) {
      return NextResponse.json(
        { 
          error: "No se puede eliminar el agente porque tiene agencias asociadas",
          agencias: agenteExistente.agencias
        },
        { status: 400 }
      );
    }

    // Eliminar el agente
    await prisma.agente.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json(
      { message: "Agente eliminado correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error al eliminar agente" },
      { status: 500 }
    );
  }
}
