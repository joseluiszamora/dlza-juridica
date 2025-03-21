// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { mkdir } from 'fs/promises';

// Interfaz para la respuesta
interface UploadResponse {
  message: string;
  file?: {
    title: string;
    description?: string;
    originalFilename: string;
    filename: string;
    path: string;
    size: number;
    type: string;
  };
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<UploadResponse>> {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string | null;
    const file = formData.get('file') as File | null;

    // Validaciones básicas
    if (!title) {
      return NextResponse.json(
        { message: 'El título es obligatorio', error: 'El título es obligatorio' },
        { status: 400 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { message: 'No se ha proporcionado ningún archivo', error: 'No se ha proporcionado ningún archivo' },
        { status: 400 }
      );
    }

    // Convertir el archivo a un buffer para guardarlo
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Crear un nombre de archivo único con timestamp y un hash aleatorio
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 10);
    const fileExtension = path.extname(file.name);
    const filename = `${timestamp}-${randomString}${fileExtension}`;
    
    // Configurar el directorio de uploads
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    
    // Asegurarse de que el directorio exista (usando fs/promises para async)
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      // Si el directorio ya existe, ignoramos el error
      if ((err as NodeJS.ErrnoException).code !== 'EEXIST') {
        throw err;
      }
    }
    
    // Construir la ruta completa del archivo
    const filepath = path.join(uploadDir, filename);
    
    // Guardar el archivo
    fs.writeFileSync(filepath, buffer);

    // Crear objeto con los datos del archivo
    const fileData = {
      title,
      description: description || undefined,
      originalFilename: file.name,
      filename,
      path: `/uploads/${filename}`,
      size: file.size,
      type: file.type,
    };

    // Aquí podrías guardar los metadatos en una base de datos
    // Por ejemplo: await db.insertFileMetadata(fileData);
    
    return NextResponse.json({
      message: 'Archivo subido correctamente',
      file: fileData
    });
  } catch (error) {
    console.error('Error al subir archivo:', error);
    return NextResponse.json(
      { message: 'Error al procesar la subida del archivo', error: 'Error al procesar la subida del archivo' },
      { status: 500 }
    );
  }
}

// Configuración de límite de tamaño (opcional)
export const config = {
  api: {
    // En Next.js 15 con App Router, esto se gestiona de manera diferente
    // Si es necesario, puedes usar un middleware global o configurar en next.config.js
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};