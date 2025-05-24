import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    
    if (id) {
      // Obtener un empleado específico por ID
      const empleado = await prisma.empleado.findUnique({
        where: {
          id: parseInt(id)
        },
        include: {
          area: {
            select: {
              id: true,
              nombre: true
            }
          },
          ciudad: {
            select: {
              id: true,
              nombre: true
            }
          }
        }
      });
      
      if (!empleado) {
        return NextResponse.json(
          { message: "Empleado no encontrado" },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ data: empleado });
    } else {
      // Obtener todos los empleados
      const empleados = await prisma.empleado.findMany({
        orderBy: {
          createdAt: "desc" // Ordenar por fecha de creación descendente
        },
        include: {
          area: {
            select: {
              id: true,
              nombre: true
            }
          },
          ciudad: {
            select: {
              id: true,
              nombre: true
            }
          }
        }
      });
      
      return NextResponse.json({ data: empleados });
    }
  } catch (error) {
    console.error("Error en GET /api/empleados:", error);
    return NextResponse.json(
      { message: "Error al obtener datos de empleados" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Validar datos requeridos
    if (!data.nombres || !data.apellidos || !data.documento || !data.fechaNacimiento || !data.fechaIngreso || !data.cargo || !data.areaId || !data.ciudadId) {
      return NextResponse.json(
        { message: "Faltan datos requeridos" },
        { status: 400 }
      );
    }
    
    // Verificar que el área existe
    const area = await prisma.area.findUnique({
      where: { id: parseInt(data.areaId.toString()) }
    });
    
    if (!area) {
      return NextResponse.json(
        { message: "El área seleccionada no existe" },
        { status: 400 }
      );
    }
    
    // Verificar que la ciudad existe
    const ciudad = await prisma.ciudad.findUnique({
      where: { id: parseInt(data.ciudadId.toString()) }
    });
    
    if (!ciudad) {
      return NextResponse.json(
        { message: "La ciudad seleccionada no existe" },
        { status: 400 }
      );
    }
    
    // Crear el empleado
    const nuevoEmpleado = await prisma.empleado.create({
      data: {
        nombres: data.nombres,
        apellidos: data.apellidos,
        documento: data.documento,
        tipoDocumento: data.tipoDocumento || "CI",
        fechaNacimiento: new Date(data.fechaNacimiento),
        genero: data.genero || null,
        codigoSap: data.codigoSap || null,
        fechaIngreso: new Date(data.fechaIngreso),
        activo: data.activo !== undefined ? data.activo : true,
        telefono: data.telefono || null,
        email: data.email || null,
        direccion: data.direccion || null,
        imagenUrl: data.imagenUrl || null,
        salario: data.salario || 0,
        vacacionesDisponibles: data.vacacionesDisponibles || 0,
        cargo: data.cargo,
        areaId: parseInt(data.areaId.toString()),
        ciudadId: parseInt(data.ciudadId.toString())
      },
      include: {
        area: true,
        ciudad: true
      }
    });
    
    return NextResponse.json(
      { message: "Empleado creado exitosamente", data: nuevoEmpleado },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en POST /api/empleados:", error);
    return NextResponse.json(
      { message: "Error al crear el empleado" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    
    if (!data.id) {
      return NextResponse.json(
        { message: "ID de empleado requerido" },
        { status: 400 }
      );
    }
    
    // Validar datos requeridos
    if (!data.nombres || !data.apellidos || !data.documento || !data.fechaNacimiento || !data.fechaIngreso || !data.cargo || !data.areaId || !data.ciudadId) {
      return NextResponse.json(
        { message: "Faltan datos requeridos" },
        { status: 400 }
      );
    }
    
    // Verificar que el empleado existe
    const empleadoExistente = await prisma.empleado.findUnique({
      where: { id: parseInt(data.id.toString()) }
    });
    
    if (!empleadoExistente) {
      return NextResponse.json(
        { message: "El empleado no existe" },
        { status: 404 }
      );
    }
    
    // Verificar que el área existe
    const area = await prisma.area.findUnique({
      where: { id: parseInt(data.areaId.toString()) }
    });
    
    if (!area) {
      return NextResponse.json(
        { message: "El área seleccionada no existe" },
        { status: 400 }
      );
    }
    
    // Verificar que la ciudad existe
    const ciudad = await prisma.ciudad.findUnique({
      where: { id: parseInt(data.ciudadId.toString()) }
    });
    
    if (!ciudad) {
      return NextResponse.json(
        { message: "La ciudad seleccionada no existe" },
        { status: 400 }
      );
    }
    
    // Actualizar el empleado
    const empleadoActualizado = await prisma.empleado.update({
      where: {
        id: parseInt(data.id.toString())
      },
      data: {
        nombres: data.nombres,
        apellidos: data.apellidos,
        documento: data.documento,
        tipoDocumento: data.tipoDocumento || "CI",
        fechaNacimiento: new Date(data.fechaNacimiento),
        genero: data.genero || null,
        codigoSap: data.codigoSap || null,
        fechaIngreso: new Date(data.fechaIngreso),
        activo: data.activo !== undefined ? data.activo : true,
        telefono: data.telefono || null,
        email: data.email || null,
        direccion: data.direccion || null,
        imagenUrl: data.imagenUrl || null,
        salario: data.salario || 0,
        vacacionesDisponibles: data.vacacionesDisponibles || 0,
        cargo: data.cargo,
        areaId: parseInt(data.areaId.toString()),
        ciudadId: parseInt(data.ciudadId.toString())
      },
      include: {
        area: true,
        ciudad: true
      }
    });
    
    return NextResponse.json({ 
      message: "Empleado actualizado exitosamente", 
      data: empleadoActualizado 
    });
  } catch (error) {
    console.error("Error en PUT /api/empleados:", error);
    return NextResponse.json(
      { message: "Error al actualizar el empleado" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { message: "ID de empleado requerido" },
        { status: 400 }
      );
    }
    
    // Verificar que el empleado existe
    const empleado = await prisma.empleado.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!empleado) {
      return NextResponse.json(
        { message: "El empleado no existe" },
        { status: 404 }
      );
    }
    
    // Eliminar el empleado
    await prisma.empleado.delete({
      where: { id: parseInt(id) }
    });
    
    return NextResponse.json({ 
      message: "Empleado eliminado exitosamente" 
    });
  } catch (error) {
    console.error("Error en DELETE /api/empleados:", error);
    return NextResponse.json(
      { message: "Error al eliminar el empleado" },
      { status: 500 }
    );
  }
}
