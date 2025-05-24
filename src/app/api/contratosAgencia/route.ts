import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    const agenciaId = req.nextUrl.searchParams.get("agenciaId");
    
    if (id) {
      // Obtener un contrato específico por ID
      const contrato = await prisma.contratoAgencia.findUnique({
        where: {
          id: parseInt(id)
        },
        include: {
          agencia: true // Incluir información de la agencia relacionada
        }
      });
      
      if (!contrato) {
        return NextResponse.json(
          { message: "Contrato no encontrado" },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ data: contrato });
    } else if (agenciaId) {
      // Obtener todos los contratos de una agencia específica
      const contratos = await prisma.contratoAgencia.findMany({
        where: {
          agenciaId: parseInt(agenciaId)
        },
        include: {
          agencia: true
        },
        orderBy: {
          createdAt: "desc"
        }
      });
      
      return NextResponse.json({ data: contratos });
    } else {
      // Obtener todos los contratos
      const contratos = await prisma.contratoAgencia.findMany({
        include: {
          agencia: true // Incluir información de la agencia relacionada
        },
        orderBy: {
          createdAt: "desc" // Ordenar por fecha de creación descendente
        }
      });
      
      return NextResponse.json({ data: contratos });
    }
  } catch (error) {
    console.error("Error en GET /api/contratosAgencia:", error);
    return NextResponse.json(
      { message: "Error al obtener datos de contratos" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Validar datos requeridos
    if (!data.codigoContrato || !data.agenciaId) {
      return NextResponse.json(
        { message: "Faltan campos requeridos: código de contrato y agencia" },
        { status: 400 }
      );
    }
    
    // Formatear fechas si existen
    const contratoInicio = data.contratoInicio ? new Date(data.contratoInicio) : null;
    const contratoFin = data.contratoFin ? new Date(data.contratoFin) : null;
    
    // Crear el nuevo contrato
    const nuevoContrato = await prisma.contratoAgencia.create({
      data: {
        codigoContrato: data.codigoContrato,
        contratoInicio: contratoInicio,
        contratoFin: contratoFin,
        tipoGarantia: data.tipoGarantia || null,
        montoGarantia: data.montoGarantia || null,
        testimonioNotarial: data.testimonioNotarial || null,
        estado: data.estado || "vigente",
        observaciones: data.observaciones || null,
        activo: data.activo !== undefined ? data.activo : false,
        agenciaId: parseInt(data.agenciaId)
      }
    });
    
    return NextResponse.json(
      { message: "Contrato creado exitosamente", data: nuevoContrato },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en POST /api/contratosAgencia:", error);
    return NextResponse.json(
      { message: "Error al crear el contrato" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    
    if (!data.id) {
      return NextResponse.json(
        { message: "ID de contrato requerido" },
        { status: 400 }
      );
    }
    
    // Formatear fechas si existen
    const contratoInicio = data.contratoInicio ? new Date(data.contratoInicio) : null;
    const contratoFin = data.contratoFin ? new Date(data.contratoFin) : null;
    
    // Actualizar el contrato
    const contratoActualizado = await prisma.contratoAgencia.update({
      where: {
        id: parseInt(data.id)
      },
      data: {
        codigoContrato: data.codigoContrato,
        contratoInicio: contratoInicio,
        contratoFin: contratoFin,
        tipoGarantia: data.tipoGarantia || null,
        montoGarantia: data.montoGarantia || null,
        testimonioNotarial: data.testimonioNotarial || null,
        estado: data.estado || "vigente",
        observaciones: data.observaciones || null,
        activo: data.activo !== undefined ? data.activo : false,
        agenciaId: parseInt(data.agenciaId)
      }
    });
    
    return NextResponse.json({ 
      message: "Contrato actualizado exitosamente", 
      data: contratoActualizado 
    });
  } catch (error) {
    console.error("Error en PUT /api/contratosAgencia:", error);
    return NextResponse.json(
      { message: "Error al actualizar el contrato" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { message: "ID de contrato requerido" },
        { status: 400 }
      );
    }
    
    // Eliminar el contrato
    await prisma.contratoAgencia.delete({
      where: {
        id: parseInt(id)
      }
    });
    
    return NextResponse.json({ 
      message: "Contrato eliminado exitosamente" 
    });
  } catch (error) {
    console.error("Error en DELETE /api/contratosAgencia:", error);
    return NextResponse.json(
      { message: "Error al eliminar el contrato" },
      { status: 500 }
    );
  }
}
