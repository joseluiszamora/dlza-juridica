import React, { useState, useCallback } from 'react';
import { useDropzone, Accept } from 'react-dropzone';
import Image from 'next/image';

// Tipos para el preview del archivo
type FilePreviewType = 
  | { type: 'image'; url: string }
  | { type: 'pdf' | 'word' | 'excel' | 'document'; name: string; size: string };

// Interfaz para las props del componente
interface FileUploadFormProps {
  maxFileSize?: number; // en bytes
  onUploadSuccess?: (data: unknown) => void;
  apiEndpoint?: string;
}

export default function DropzoneContratos({
  maxFileSize = 10 * 1024 * 1024, // 10MB por defecto
  onUploadSuccess,
  apiEndpoint = '/api/upload',
}: FileUploadFormProps) {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<FilePreviewType | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  // Tipos de archivos aceptados
  const acceptedFileTypes: Accept = {
    'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    'application/pdf': ['.pdf'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'application/msword': ['.doc'],
    'application/vnd.ms-excel': ['.xls']
  };

  // Función para manejar el drop de archivos
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      
      // Crear preview dependiendo del tipo de archivo
      if (selectedFile.type.startsWith('image/')) {
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview({
          type: 'image',
          url: objectUrl
        });
      } else {
        // Para documentos no imagen, mostramos un icono específico
        const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase() || '';
        let fileType: 'pdf' | 'word' | 'excel' | 'document' = 'document';
        
        if (fileExtension === 'pdf') {
          fileType = 'pdf';
        } else if (['doc', 'docx'].includes(fileExtension)) {
          fileType = 'word';
        } else if (['xls', 'xlsx'].includes(fileExtension)) {
          fileType = 'excel';
        }
        
        setPreview({
          type: fileType,
          name: selectedFile.name,
          size: formatFileSize(selectedFile.size)
        });
      }
    }
  }, []);

  // Configuración de Dropzone
  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxFiles: 1,
    maxSize: maxFileSize,
  });

  // Formatear tamaño de archivo para mostrar
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Función para subir el archivo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !title) {
      setUploadError('Por favor, añade un título y selecciona un archivo.');
      return;
    }
    
    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('file', file);
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al subir el archivo');
      }
      
      const data = await response.json();
      console.log('Archivo subido correctamente:', data);
      
      // Limpiar formulario después de éxito
      setUploadSuccess(true);
      setTitle('');
      setDescription('');
      setFile(null);
      setPreview(null);
      
      // Llamar al callback si existe
      if (onUploadSuccess) {
        onUploadSuccess(data);
      }
      
    } catch (error) {
      console.error('Error:', error);
      setUploadError(error instanceof Error ? error.message : 'Ha ocurrido un error al subir el archivo');
    } finally {
      setUploading(false);
    }
  };

  // Componente para renderizar la previsualización según el tipo
  const FilePreview = () => {
    if (!preview) return null;
    
    if (preview.type === 'image') {
      return (
        <div className="relative h-48 w-full">
          <Image 
            src={preview.url} 
            alt="Vista previa" 
            fill 
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-contain rounded-md" 
          />
        </div>
      );
    }
    
    // Iconos y previews para otros tipos de documentos
    const iconMap: Record<string, string> = {
      'pdf': '📄',
      'word': '📝',
      'excel': '📊',
      'document': '📃'
    };
    
    return (
      <div className="flex items-center p-4 border rounded-md bg-gray-50">
        <span className="text-3xl mr-3">{iconMap[preview.type]}</span>
        <div>
          <p className="font-medium truncate">{preview.name}</p>
          <p className="text-sm text-gray-500">{preview.size}</p>
        </div>
      </div>
    );
  };

  // Limpiar URL de objeto al desmontar componente
  React.useEffect(() => {
    return () => {
      if (preview?.type === 'image') {
        URL.revokeObjectURL(preview.url);
      }
    };
  }, [preview]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Subir ArchivoX2</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Título *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-5">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-5">
          <p className="block text-sm font-medium text-gray-700 mb-1">
            Archivo *
          </p>
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center cursor-pointer transition-colors ${
              isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
            }`}
          >
            <input {...getInputProps()} />
            
            {!file ? (
              <>
                <div className="text-4xl mb-2">📂</div>
                <p className="text-center text-gray-600">
                  {isDragActive 
                    ? 'Suelta el archivo aquí' 
                    : 'Arrastra y suelta un archivo aquí, o haz clic para seleccionarlo'
                  }
                </p>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Formatos permitidos: JPG, PNG, GIF, PDF, DOC, DOCX, XLS, XLSX (máx. {formatFileSize(maxFileSize)})
                </p>
              </>
            ) : (
              <FilePreview />
            )}
          </div>
          
          {fileRejections.length > 0 && (
            <p className="mt-2 text-sm text-red-600">
              {fileRejections[0]?.errors[0]?.message || 'Archivo no válido.'}
            </p>
          )}
        </div>
        
        {uploadError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {uploadError}
          </div>
        )}
        
        {uploadSuccess && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
            ¡Archivo subido con éxito!
          </div>
        )}
        
        <button
          type="submit"
          disabled={uploading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            uploading 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {uploading ? 'Subiendo...' : 'Subir Archivo'}
        </button>
      </form>
    </div>
  );
}