import React, { useState, useEffect, ChangeEvent } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { PencilIcon, FileIcon } from "@/icons";
import Marca from "@/data/Marca";
import { SpinnerLoader } from "@/components/ui/loader/loaders";
import { uploadImageToSupabase } from "@/services/supabaseClient";
import Image from "next/image";

interface EditarMarcaProps {
  marca: Marca;
  onSave: () => void;
}

interface FormData {
  nombre: string;
  estado: string;
  logotipoUrl: string;
  genero: string;
  tipo: string;
  claseNiza: string;
  numeroRegistro: string;
  fechaRegistro: string;
  tramiteArealizar: string;
  fechaExpiracionRegistro: string;
  fechaLimiteRenovacion: string;
  titular: string;
  apoderado: string;
}

export default function EditarMarca({ marca, onSave }: EditarMarcaProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    estado: "renovada",
    logotipoUrl: "",
    genero: "marca producto",
    tipo: "mixta",
    claseNiza: "",
    numeroRegistro: "",
    fechaRegistro: "",
    tramiteArealizar: "",
    fechaExpiracionRegistro: "",
    fechaLimiteRenovacion: "",
    titular: "",
    apoderado: "",
  });

  const optionsEstado = [
    { value: "registrada", label: "Registrada" },
    { value: "vigente", label: "Vigente" },
    { value: "renovada", label: "Renovada" },
    { value: "caducada", label: "Caducada" },
  ];

  const optionsGenero = [
    { value: "marca producto", label: "Marca Producto" },
    { value: "marca servicio", label: "Marca Servicio" },
    { value: "lema comercial", label: "Lema Comercial" },
  ];

  const optionsTipo = [
    { value: "mixta", label: "Mixta" },
    { value: "figurativa", label: "Figurativa" },
    { value: "nominativa", label: "Nominativa" },
    { value: "denominacion", label: "Denominación" },
    { value: "tridimensional", label: "Tridimensional" },
    { value: "sonora", label: "Sonora" },
    { value: "olfativa", label: "Olfativa" },
  ];

  useEffect(() => {
    if (marca) {
      setFormData({
        nombre: marca.nombre || "",
        estado: marca.estado || "renovada",
        logotipoUrl: marca.logotipoUrl || "",
        genero: marca.genero || "marca producto",
        tipo: marca.tipo || "mixta",
        claseNiza: marca.claseNiza || "",
        numeroRegistro: marca.numeroRegistro || "",
        fechaRegistro: marca.fechaRegistro ? 
          new Date(marca.fechaRegistro).toISOString().split('T')[0] : "",
        tramiteArealizar: marca.tramiteArealizar || "",
        fechaExpiracionRegistro: marca.fechaExpiracionRegistro ? 
          new Date(marca.fechaExpiracionRegistro).toISOString().split('T')[0] : "",
        fechaLimiteRenovacion: marca.fechaLimiteRenovacion ? 
          new Date(marca.fechaLimiteRenovacion).toISOString().split('T')[0] : "",
        titular: marca.titular || "",
        apoderado: marca.apoderado || "",
      });
      
      // Establecer imagen de previsualización si existe logotipoUrl
      if (marca.logotipoUrl) {
        setPreviewUrl(marca.logotipoUrl);
      }
    }
  }, [marca]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar la selección de imagen
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Verificar tipo de archivo
      if (!file.type.match('image.*')) {
        alert("Por favor seleccione una imagen válida (JPG, PNG, GIF)");
        return;
      }
      
      // Verificar tamaño (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("La imagen no puede superar los 5MB");
        return;
      }
      
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Limpiar el formulario al cerrar modal
  const handleCloseModal = () => {
    setSelectedImage(null);
    if (marca.logotipoUrl) {
      setPreviewUrl(marca.logotipoUrl);
    } else {
      setPreviewUrl(null);
    }
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let logotipoUrl = formData.logotipoUrl;
      
      // Si se seleccionó una nueva imagen, subirla
      if (selectedImage) {
        const uploadedUrl = await uploadImageToSupabase(selectedImage, `marca-${formData.nombre}`, 'marcas');
        if (uploadedUrl) {
          logotipoUrl = uploadedUrl;
        } else {
          alert('Error al subir la imagen. Inténtelo de nuevo.');
          setIsLoading(false);
          return;
        }
      } else if (previewUrl === null) {
        // Si se eliminó la imagen (previewUrl es null), limpiar la URL
        logotipoUrl = '';
      }
      // Si no se hizo ningún cambio en la imagen, mantener el valor actual

      const response = await fetch(`/api/marcas/${marca.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          logotipoUrl
        }),
      });

      if (response.ok) {
        onSave();
        setIsOpen(false);
        alert('Marca actualizada exitosamente');
      } else {
        const errorData = await response.json();
        alert(`Error al actualizar la marca: ${errorData.message || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar la marca. Inténtelo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        size="sm" 
        variant="primary" 
        startIcon={<PencilIcon />} 
        onClick={() => setIsOpen(true)}
      >
        Editar
      </Button>

      <Modal isOpen={isOpen} onClose={handleCloseModal} className="max-w-4xl p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Editar Marca
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre de la Marca *
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  defaultValue={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Nombre de la marca"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="numeroRegistro" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Número de Registro *
                </label>
                <input
                  id="numeroRegistro"
                  name="numeroRegistro"
                  type="text"
                  defaultValue={formData.numeroRegistro}
                  onChange={handleInputChange}
                  placeholder="Ej: 153423"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="estado" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Estado
                </label>
                <select
                  id="estado"
                  name="estado"
                  defaultValue={formData.estado}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {optionsEstado.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="genero" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Género *
                </label>
                <select
                  id="genero"
                  name="genero"
                  defaultValue={formData.genero}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {optionsGenero.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tipo *
                </label>
                <select
                  id="tipo"
                  name="tipo"
                  defaultValue={formData.tipo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {optionsTipo.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="claseNiza" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Clase Niza *
                </label>
                <input
                  id="claseNiza"
                  name="claseNiza"
                  type="text"
                  defaultValue={formData.claseNiza}
                  onChange={handleInputChange}
                  placeholder="Ej: 29, 30, 32, 43"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="fechaRegistro" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fecha de Registro *
                </label>
                <input
                  id="fechaRegistro"
                  name="fechaRegistro"
                  type="date"
                  defaultValue={formData.fechaRegistro}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="fechaExpiracionRegistro" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fecha de Expiración
                </label>
                <input
                  id="fechaExpiracionRegistro"
                  name="fechaExpiracionRegistro"
                  type="date"
                  defaultValue={formData.fechaExpiracionRegistro}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="fechaLimiteRenovacion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fecha Límite de Renovación
                </label>
                <input
                  id="fechaLimiteRenovacion"
                  name="fechaLimiteRenovacion"
                  type="date"
                  defaultValue={formData.fechaLimiteRenovacion}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="titular" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Titular *
                </label>
                <input
                  id="titular"
                  name="titular"
                  type="text"
                  defaultValue={formData.titular}
                  onChange={handleInputChange}
                  placeholder="Nombre del titular"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="apoderado" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Apoderado *
                </label>
                <input
                  id="apoderado"
                  name="apoderado"
                  type="text"
                  defaultValue={formData.apoderado}
                  onChange={handleInputChange}
                  placeholder="Nombre del apoderado"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Selector de imagen para logotipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Logotipo de la Marca
              </label>
              
              <div className="space-y-4">
                {/* Botón para seleccionar imagen */}
                <div className="flex items-center gap-4">
                  <label
                    htmlFor="logotipo-upload"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                  >
                    <FileIcon className="w-4 h-4 mr-2" />
                    {selectedImage ? 'Cambiar imagen' : (previewUrl ? 'Cambiar imagen' : 'Seleccionar imagen')}
                  </label>
                  <input
                    id="logotipo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  {(selectedImage || previewUrl) && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImage(null);
                        setPreviewUrl(null);
                        setFormData(prev => ({ ...prev, logotipoUrl: '' }));
                      }}
                      className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Eliminar imagen
                    </button>
                  )}
                </div>
                
                {/* Preview de la imagen */}
                {previewUrl && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Vista previa:</p>
                    <div className="relative w-32 h-32 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800">
                      <Image
                        src={previewUrl}
                        alt="Preview del logotipo"
                        fill
                        style={{ objectFit: 'contain' }}
                        className="p-2"
                        onError={() => {
                          console.error('Error cargando imagen de preview');
                          setPreviewUrl(null);
                        }}
                      />
                    </div>
                  </div>
                )}
                
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Formatos soportados: JPG, PNG, GIF. Tamaño máximo: 5MB
                </p>
              </div>
            </div>

            <div>
              <label htmlFor="tramiteArealizar" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Trámite a Realizar
              </label>
              <textarea
                id="tramiteArealizar"
                name="tramiteArealizar"
                defaultValue={formData.tramiteArealizar}
                onChange={handleInputChange}
                rows={3}
                placeholder="Ej: renovación de marca 2025, modificación de marca"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-vertical"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button disabled={isLoading}>
                {isLoading ? <SpinnerLoader /> : "Actualizar Marca"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
