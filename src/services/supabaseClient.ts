import { createClient } from '@supabase/supabase-js';

// Obtener las variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Crear el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Función para subir una imagen al bucket 'agentes'
export async function uploadImageToSupabase(file: File, agenteName: string): Promise<string | null> {
  try {
    // Crear un nombre de archivo único basado en el timestamp y el nombre del agente
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}-${agenteName.replace(/\s+/g, '-').toLowerCase()}`;
    const fileExt = file.name.split('.').pop();
    const filePath = `${fileName}.${fileExt}`;
    
    // Subir el archivo al bucket 'agentes'
    const { data, error } = await supabase.storage
      .from('agentes')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
      console.log('data', data);

    if (error) {
      console.error('Error al subir la imagen:', error);
      return null;
    }
    
    // Obtener la URL pública de la imagen
    const { data: urlData } = supabase.storage
      .from('agentes')
      .getPublicUrl(filePath);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error en uploadImageToSupabase:', error);
    return null;
  }
}
