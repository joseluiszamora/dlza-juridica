import { createClient } from '@supabase/supabase-js';

// Obtener las variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Crear el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Función para subir una imagen al bucket especificado
export async function uploadImageToSupabase(file: File, name: string, bucket: string = 'agentes'): Promise<string | null> {
  try {
    // Crear un nombre de archivo único basado en el timestamp y el nombre
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}-${name.replace(/\s+/g, '-').toLowerCase()}`;
    const fileExt = file.name.split('.').pop();
    const filePath = `${fileName}.${fileExt}`;
    
    // Subir el archivo al bucket específico
    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Error al subir la imagen:', error);
      return null;
    }
    
    // Obtener la URL pública de la imagen
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error en uploadImageToSupabase:', error);
    return null;
  }
}
