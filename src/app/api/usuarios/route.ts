import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "@/services/passwordUtils";

const prisma = new PrismaClient();

// GET - Obtener todos los usuarios o uno específico por ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      // Obtener un usuario específico
      const usuario = await prisma.usuario.findUnique({
        where: { id: parseInt(id) },
        select: {
          id: true,
          username: true,
          email: true,
          nombres: true,
          apellidos: true,
          documento: true,
          imagenUrl: true,
          createdAt: true,
          // No incluir el password por seguridad
        }
      });

      if (!usuario) {
        return NextResponse.json(
          { error: "Usuario no encontrado" },
          { status: 404 }
        );
      }

      return NextResponse.json({ data: usuario });
    } else {
      // Obtener todos los usuarios
      const usuarios = await prisma.usuario.findMany({
        select: {
          id: true,
          username: true,
          email: true,
          nombres: true,
          apellidos: true,
          documento: true,
          imagenUrl: true,
          createdAt: true,
          // No incluir el password por seguridad
        },
        orderBy: {
          username: 'asc',
        },
      });
      return NextResponse.json({ data: usuarios });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error al obtener usuarios" },
      { status: 500 }
    );
  }
}

// POST - Crear un nuevo usuario
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validación básica
    if (!body.username || !body.password || !body.email || !body.nombres || !body.apellidos || !body.documento) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const existingUsername = await prisma.usuario.findUnique({
      where: { username: body.username }
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: "El nombre de usuario ya está en uso" },
        { status: 400 }
      );
    }

    // Encriptar la contraseña
    const hashedPassword = await hashPassword(body.password);

    // Crear el usuario
    const usuario = await prisma.usuario.create({
      data: {
        username: body.username,
        password: hashedPassword,
        email: body.email,
        nombres: body.nombres,
        apellidos: body.apellidos,
        documento: body.documento,
        imagenUrl: body.imagenUrl
      },
      select: {
        id: true,
        username: true,
        email: true,
        nombres: true,
        apellidos: true,
        documento: true,
        imagenUrl: true,
        createdAt: true,
        // No incluir el password por seguridad
      }
    });

    return NextResponse.json({ data: usuario }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error al crear usuario" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar un usuario existente
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "ID de usuario requerido" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validación básica
    if (!body.username || !body.email || !body.nombres || !body.apellidos || !body.documento) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // Verificar si el usuario existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id: parseInt(id) }
    });

    if (!usuarioExistente) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Verificar si el nuevo username ya está en uso por otro usuario
    if (body.username !== usuarioExistente.username) {
      const existingUsername = await prisma.usuario.findUnique({
        where: { username: body.username }
      });

      if (existingUsername && existingUsername.id !== parseInt(id)) {
        return NextResponse.json(
          { error: "El nombre de usuario ya está en uso" },
          { status: 400 }
        );
      }
    }

    // Preparar datos para actualizar
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
      username: body.username,
      email: body.email,
      nombres: body.nombres,
      apellidos: body.apellidos,
      documento: body.documento,
      imagenUrl: body.imagenUrl,
    };

    // Si se proporciona una nueva contraseña, encriptarla
    if (body.password) {
      updateData.password = await hashPassword(body.password);
    }

    // Actualizar el usuario
    const usuarioActualizado = await prisma.usuario.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        nombres: true,
        apellidos: true,
        documento: true,
        imagenUrl: true,
        createdAt: true,
        // No incluir el password por seguridad
      }
    });

    return NextResponse.json({ data: usuarioActualizado });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error al actualizar usuario" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un usuario
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "ID de usuario requerido" },
        { status: 400 }
      );
    }

    // Verificar si el usuario existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id: parseInt(id) }
    });

    if (!usuarioExistente) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Eliminar el usuario
    await prisma.usuario.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json(
      { message: "Usuario eliminado correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error al eliminar usuario" },
      { status: 500 }
    );
  }
}
