import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    
    if (id) {
      // Obtener un área específica por ID
      const area = await prisma.area.findUnique({
        where: {
          id: parseInt(id)
        }
      });
      
      if (!area) {
        return NextResponse.json(
          { message: "Área no encontrada" },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ data: area });
    } else {
      // Obtener todas las áreas
      const areas = await prisma.area.findMany({
        orderBy: {
          createdAt: "desc" // Ordenar por fecha de creación descendente
        }
      });
      
      return NextResponse.json({ data: areas });
    }
  } catch (error) {
    console.error("Error en GET /api/areas:", error);
    return NextResponse.json(
      { message: "Error al obtener datos de áreas" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Validar datos requeridos
    if (!data.nombre) {
      return NextResponse.json(
        { message: "El nombre del área es requerido" },
        { status: 400 }
      );
    }
    
    // Crear el área
    const nuevaArea = await prisma.area.create({
      data: {
        nombre: data.nombre,
        departamento: data.departamento || null
      }
    });
    
    return NextResponse.json(
      { message: "Área creada exitosamente", data: nuevaArea },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en POST /api/areas:", error);
    return NextResponse.json(
      { message: "Error al crear el área" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    
    if (!data.id) {
      return NextResponse.json(
        { message: "ID de área requerido" },
        { status: 400 }
      );
    }
    
    if (!data.nombre) {
      return NextResponse.json(
        { message: "El nombre del área es requerido" },
        { status: 400 }
      );
    }
    
    // Actualizar el área
    const areaActualizada = await prisma.area.update({
      where: {
        id: parseInt(data.id.toString())
      },
      data: {
        nombre: data.nombre,
        departamento: data.departamento || null
      }
    });
    
    return NextResponse.json({ 
      message: "Área actualizada exitosamente", 
      data: areaActualizada 
    });
  } catch (error) {
    console.error("Error en PUT /api/areas:", error);
    return NextResponse.json(
      { message: "Error al actualizar el área" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { message: "ID de área requerido" },
        { status: 400 }
      );
    }

    // Verificar si hay empleados asociados a esta área
    const empleadosCount = await prisma.empleado.count({
      where: {
        areaId: parseInt(id)
      }
    });

    if (empleadosCount > 0) {
      return NextResponse.json(
        { message: "No se puede eliminar un área con empleados asociados" },
        { status: 400 }
      );
    }
    
    // Eliminar el área
    await prisma.area.delete({
      where: {
        id: parseInt(id)
      }
    });
    
    return NextResponse.json({ 
      message: "Área eliminada exitosamente" 
    });
  } catch (error) {
    console.error("Error en DELETE /api/areas:", error);
    return NextResponse.json(
      { message: "Error al eliminar el área" },
      { status: 500 }
    );
  }
}
