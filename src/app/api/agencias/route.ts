import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Obtener todas las agencias o una específica por ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      // Obtener una agencia específica con sus relaciones
      const agencia = await prisma.agencia.findUnique({
        where: { id: parseInt(id) },
        include: {
          agente: true,
          ciudad: true,
        }
      });

      if (!agencia) {
        return NextResponse.json(
          { error: "Agencia no encontrada" },
          { status: 404 }
        );
      }

      return NextResponse.json({ data: agencia });
    } else {
      // Obtener todas las agencias con sus relaciones
      const agencias = await prisma.agencia.findMany({
        include: {
          agente: true,
          ciudad: true,
        }
      });
      return NextResponse.json({ data: agencias });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error al obtener agencias: " },
      { status: 500 }
    );
  }
}

// POST - Crear una nueva agencia
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Convertir fechas de string a Date si existen
    if (body.vigenciaLicenciaFuncionamiento) {
      body.vigenciaLicenciaFuncionamiento = new Date(body.vigenciaLicenciaFuncionamiento);
    }
    if (body.inicioContratoVigente) {
      body.inicioContratoVigente = new Date(body.inicioContratoVigente);
    }
    if (body.finContratoVigente) {
      body.finContratoVigente = new Date(body.finContratoVigente);
    }

    // Asegurarse de que agenteId y ciudadId sean enteros
    if (body.agenteId) {
      body.agenteId = parseInt(body.agenteId);
    }
    if (body.ciudadId) {
      body.ciudadId = parseInt(body.ciudadId);
    }

    // Crear la agencia con sus relaciones
    const agencia = await prisma.agencia.create({
      data: body,
      include: {
        agente: true,
        ciudad: true,
      }
    });

    return NextResponse.json({ data: agencia }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error al crear agencia: "},
      { status: 500 }
    );
  }
}

// PUT - Actualizar una agencia existente
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "ID de agencia requerido" },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Convertir fechas de string a Date si existen
    if (body.vigenciaLicenciaFuncionamiento) {
      body.vigenciaLicenciaFuncionamiento = new Date(body.vigenciaLicenciaFuncionamiento);
    }
    if (body.inicioContratoVigente) {
      body.inicioContratoVigente = new Date(body.inicioContratoVigente);
    }
    if (body.finContratoVigente) {
      body.finContratoVigente = new Date(body.finContratoVigente);
    }

    // Asegurarse de que agenteId y ciudadId sean enteros
    if (body.agenteId) {
      body.agenteId = parseInt(body.agenteId);
    }
    if (body.ciudadId) {
      body.ciudadId = parseInt(body.ciudadId);
    }

    // Verificar si la agencia existe
    const agenciaExistente = await prisma.agencia.findUnique({
      where: { id: parseInt(id) }
    });

    if (!agenciaExistente) {
      return NextResponse.json(
        { error: "Agencia no encontrada" },
        { status: 404 }
      );
    }

    // Actualizar la agencia
    const agenciaActualizada = await prisma.agencia.update({
      where: { id: parseInt(id) },
      data: body,
      include: {
        agente: true,
        ciudad: true,
      }
    });

    return NextResponse.json({ data: agenciaActualizada });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error al actualizar agencia: " },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar una agencia (podría ser baja lógica si se modifica el modelo)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "ID de agencia requerido" },
        { status: 400 }
      );
    }

    // Verificar si la agencia existe
    const agenciaExistente = await prisma.agencia.findUnique({
      where: { id: parseInt(id) }
    });

    if (!agenciaExistente) {
      return NextResponse.json(
        { error: "Agencia no encontrada" },
        { status: 404 }
      );
    }

    // Eliminar la agencia
    await prisma.agencia.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json(
      { message: "Agencia eliminada correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error al eliminar agencia: " },
      { status: 500 }
    );
  }
}
