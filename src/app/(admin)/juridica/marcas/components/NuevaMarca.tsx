"use client";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { PlusIcon, FileIcon } from "@/icons";
import { useState, ChangeEvent } from "react";
import { SpinnerLoader } from "@/components/ui/loader/loaders";
import { uploadImageToSupabase } from "@/services/supabaseClient";
import Image from "next/image";

interface Props {
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

const NuevaMarca: React.FC<Props> = ({ onSave }) => {
  const { isOpen, openModal, closeModal } = useModal();
  const [loading, setLoading] = useState(false);
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
        console.error("Por favor seleccione una imagen válida");
        return;
      }
      
      // Verificar tamaño (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        console.error("La imagen no puede superar los 5MB");
        return;
      }
      
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let logotipoUrl = formData.logotipoUrl;
      
      // Subir imagen si se seleccionó una
      if (selectedImage) {
        const uploadedUrl = await uploadImageToSupabase(selectedImage, `marca-${formData.nombre}`, 'marcas');
        if (uploadedUrl) {
          logotipoUrl = uploadedUrl;
        }
      }

      const response = await fetch('/api/marcas', {
        method: 'POST',
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
        closeModal();
        resetForm();
      } else {
        console.error('Error creating marca');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
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
    setSelectedImage(null);
    setPreviewUrl(null);
  };

  return (
    <>
      <Button onClick={openModal} className="flex items-center gap-2">
        <PlusIcon size={16} />
        Nueva Marca
      </Button>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-4xl p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Nueva Marca
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Sección de imagen del logotipo */}
            <div className="flex flex-col items-center mb-6">
              <div 
                className="relative w-32 h-32 mb-3 overflow-hidden bg-gray-100 rounded-lg dark:bg-gray-700"
              >
                {previewUrl ? (
                  <div className="w-full h-full relative">
                    <Image 
                      src={previewUrl} 
                      alt="Vista previa del logotipo" 
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-400">
                    <FileIcon className="w-12 h-12" />
                  </div>
                )}
              </div>
              
              <label 
                htmlFor="logotipo-image" 
                className="px-4 py-2 text-sm font-medium text-white transition bg-brand-500 rounded-lg cursor-pointer hover:bg-brand-600"
              >
                Seleccionar Logotipo
              </label>
              <input
                id="logotipo-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              {previewUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedImage(null);
                    setPreviewUrl(null);
                  }}
                  className="mt-2 text-sm text-gray-500 underline dark:text-gray-400"
                >
                  Eliminar imagen
                </button>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Formatos permitidos: JPG, PNG, GIF. Máximo 5MB.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre de la Marca *
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Nombre de la marca"
                  required
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
                  value={formData.numeroRegistro}
                  onChange={handleInputChange}
                  placeholder="Ej: 153423"
                  required
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
                  value={formData.estado}
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
                  value={formData.genero}
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
                  value={formData.tipo}
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
                  value={formData.claseNiza}
                  onChange={handleInputChange}
                  placeholder="Ej: 29, 30, 32, 43"
                  required
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
                  value={formData.fechaRegistro}
                  onChange={handleInputChange}
                  required
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
                  value={formData.fechaExpiracionRegistro}
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
                  value={formData.fechaLimiteRenovacion}
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
                  value={formData.titular}
                  onChange={handleInputChange}
                  placeholder="Nombre del titular"
                  required
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
                  value={formData.apoderado}
                  onChange={handleInputChange}
                  placeholder="Nombre del apoderado"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="tramiteArealizar" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Trámite a Realizar
              </label>
              <textarea
                id="tramiteArealizar"
                name="tramiteArealizar"
                value={formData.tramiteArealizar}
                onChange={handleInputChange}
                rows={3}
                placeholder="Ej: renovación de marca 2025, modificación de marca"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-vertical"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={closeModal}>
                Cancelar
              </Button>
              <Button disabled={loading}>
                {loading ? <SpinnerLoader /> : "Crear Marca"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default NuevaMarca;
