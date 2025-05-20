import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Obtener todas las ciudades o una específica por ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      // Obtener una ciudad específica con sus agencias relacionadas
      const ciudad = await prisma.ciudad.findUnique({
        where: { id: parseInt(id) },
        include: {
          agencias: true,
        },
      });

      if (!ciudad) {
        return NextResponse.json(
          { error: "Ciudad no encontrada" },
          { status: 404 }
        );
      }

      return NextResponse.json({ data: ciudad });
    } else {
      // Obtener todas las ciudades
      const ciudades = await prisma.ciudad.findMany({
        include: {
          agencias: {
            select: {
              id: true,
              nombre: true,
            },
          },
        },
      });
      return NextResponse.json({ data: ciudades });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error al obtener ciudades" },
      { status: 500 }
    );
  }
}

// POST - Crear una nueva ciudad
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validación básica
    if (!body.nombre) {
      return NextResponse.json(
        { error: "El nombre de la ciudad es requerido" },
        { status: 400 }
      );
    }

    // Crear la ciudad
    const ciudad = await prisma.ciudad.create({
      data: {
        nombre: body.nombre,
        pais: body.pais || "Bolivia", // Valor por defecto si no se proporciona
      },
    });

    return NextResponse.json({ data: ciudad }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error al crear ciudad" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar una ciudad existente
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "ID de ciudad requerido" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validación básica
    if (!body.nombre) {
      return NextResponse.json(
        { error: "El nombre de la ciudad es requerido" },
        { status: 400 }
      );
    }

    // Verificar si la ciudad existe
    const ciudadExistente = await prisma.ciudad.findUnique({
      where: { id: parseInt(id) }
    });

    if (!ciudadExistente) {
      return NextResponse.json(
        { error: "Ciudad no encontrada" },
        { status: 404 }
      );
    }

    // Actualizar la ciudad
    const ciudadActualizada = await prisma.ciudad.update({
      where: { id: parseInt(id) },
      data: {
        nombre: body.nombre,
        pais: body.pais || ciudadExistente.pais, // Mantener el valor existente si no se proporciona
      },
    });

    return NextResponse.json({ data: ciudadActualizada });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error al actualizar ciudad" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar una ciudad
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "ID de ciudad requerido" },
        { status: 400 }
      );
    }

    // Verificar si la ciudad existe
    const ciudadExistente = await prisma.ciudad.findUnique({
      where: { id: parseInt(id) },
      include: {
        agencias: true,
      },
    });

    if (!ciudadExistente) {
      return NextResponse.json(
        { error: "Ciudad no encontrada" },
        { status: 404 }
      );
    }

    // Verificar si hay agencias asociadas a esta ciudad
    if (ciudadExistente.agencias.length > 0) {
      return NextResponse.json(
        { 
          error: "No se puede eliminar la ciudad porque tiene agencias asociadas",
          agencias: ciudadExistente.agencias
        },
        { status: 400 }
      );
    }

    // Eliminar la ciudad
    await prisma.ciudad.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json(
      { message: "Ciudad eliminada correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error al eliminar ciudad" },
      { status: 500 }
    );
  }
}
