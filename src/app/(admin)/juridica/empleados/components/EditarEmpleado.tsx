import { useModal } from "@/hooks/useModal";
import { PencilIcon, FileIcon } from '@/icons';
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { FormEvent, useEffect, useState, ChangeEvent } from "react";
import { SpinnerLoader } from "@/components/ui/loader/loaders";
import { uploadImageToSupabase } from "@/services/supabaseClient";
import Image from "next/image";

interface Area {
  id: number;
  nombre: string;
  departamento: string | null;
}

interface Ciudad {
  id: number;
  nombre: string;
  pais: string;
}

interface Empleado {
  id: number;
  nombres: string;
  apellidos: string;
  documento: string;
  tipoDocumento: string;
  fechaNacimiento: Date;
  genero: string | null;
  codigoSap: string | null;
  fechaIngreso: Date;
  activo: boolean;
  telefono: string | null;
  email: string | null;
  direccion: string | null;
  imagenUrl: string | null;
  salario: number;
  vacacionesDisponibles: number;
  cargo: string;
  areaId: number;
  ciudadId: number;
  createdAt: Date;
  area: {
    id: number;
    nombre: string;
  };
  ciudad: {
    id: number;
    nombre: string;
  };
}

interface Props {
  empleado: Empleado;
  onSave: () => void;
}

const EditarEmpleado: React.FC<Props> = ({ empleado, onSave }) => {
  const { isOpen, openModal, closeModal } = useModal();
  const [loading, setLoading] = useState(false);
  const [areas, setAreas] = useState<Area[]>([]);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(empleado.imagenUrl || null);
  const [formData, setFormData] = useState({
    id: empleado.id,
    nombres: empleado.nombres,
    apellidos: empleado.apellidos,
    documento: empleado.documento,
    tipoDocumento: empleado.tipoDocumento,
    fechaNacimiento: new Date(empleado.fechaNacimiento).toISOString().split('T')[0],
    genero: empleado.genero || "",
    codigoSap: empleado.codigoSap || "",
    fechaIngreso: new Date(empleado.fechaIngreso).toISOString().split('T')[0],
    activo: empleado.activo,
    telefono: empleado.telefono || "",
    email: empleado.email || "",
    direccion: empleado.direccion || "",
    salario: empleado.salario,
    vacacionesDisponibles: empleado.vacacionesDisponibles,
    cargo: empleado.cargo,
    areaId: empleado.areaId,
    ciudadId: empleado.ciudadId
  });

  useEffect(() => {
    if (isOpen) {
      // Cargar áreas y ciudades cuando se abra el modal
      fetchAreas();
      fetchCiudades();
      // Restaurar la imagen previa del empleado
      setPreviewUrl(empleado.imagenUrl || null);
    }
  }, [isOpen, empleado.imagenUrl]);

  const fetchAreas = async () => {
    try {
      const response = await fetch('/api/areas');
      if (response.ok) {
        const data = await response.json();
        setAreas(data.data);
      }
    } catch (error) {
      console.error("Error al cargar áreas:", error);
    }
  };

  const fetchCiudades = async () => {
    try {
      const response = await fetch('/api/ciudades');
      if (response.ok) {
        const data = await response.json();
        setCiudades(data.data);
      }
    } catch (error) {
      console.error("Error al cargar ciudades:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked
      });
    } else if (name === 'areaId' || name === 'ciudadId' || name === 'salario' || name === 'vacacionesDisponibles') {
      setFormData({
        ...formData,
        [name]: parseInt(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
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
        console.error("La imagen debe ser menor a 5MB");
        return;
      }
      
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imagenUrl = empleado.imagenUrl;
      
      // Subir nueva imagen si se seleccionó una
      if (selectedImage) {
        const newImageUrl = await uploadImageToSupabase(
          selectedImage, 
          `${formData.nombres}-${formData.apellidos}`,
          'empleados' // Usar el bucket 'empleados'
        );
        if (newImageUrl) {
          imagenUrl = newImageUrl;
        }
      } else if (previewUrl === null && empleado.imagenUrl) {
        // Si se eliminó la imagen previa pero no se subió una nueva
        imagenUrl = null;
      }

      const response = await fetch(`/api/empleados`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          imagenUrl
        }),
      });

      if (response.ok) {
        closeModal();
        onSave();
      } else {
        const error = await response.json();
        console.error("Error al actualizar el empleado:", error.message);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button 
        size="sm" 
        variant="primary" 
        startIcon={<PencilIcon />} 
        onClick={openModal}
      >
        Editar
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[700px] p-6"
      >
        <div>
          <h2 className="mb-5 text-xl font-semibold text-gray-800 dark:text-white">
            Editar Empleado
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Sección de imagen de perfil */}
            <div className="flex flex-col items-center mb-6">
              <div 
                className="relative w-32 h-32 mb-3 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-700"
              >
                {previewUrl ? (
                  <div className="w-full h-full relative">
                    <Image 
                      src={previewUrl} 
                      alt="Vista previa" 
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
                htmlFor="profile-image-edit" 
                className="px-4 py-2 text-sm font-medium text-white transition bg-brand-500 rounded-lg cursor-pointer hover:bg-brand-600"
              >
                Seleccionar Imagen
              </label>
              <input
                id="profile-image-edit"
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nombres" className="mb-2 block font-medium text-gray-700 dark:text-gray-200">
                  Nombres *
                </label>
                <input
                  type="text"
                  id="nombres"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="apellidos" className="mb-2 block font-medium text-gray-700 dark:text-gray-200">
                  Apellidos *
                </label>
                <input
                  type="text"
                  id="apellidos"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="tipoDocumento" className="mb-2 block font-medium text-gray-700 dark:text-gray-200">
                  Tipo Documento
                </label>
                <select
                  id="tipoDocumento"
                  name="tipoDocumento"
                  value={formData.tipoDocumento}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                >
                  <option value="CI">CI</option>
                  <option value="Pasaporte">Pasaporte</option>
                  <option value="DNI">DNI</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="documento" className="mb-2 block font-medium text-gray-700 dark:text-gray-200">
                  Documento *
                </label>
                <input
                  type="text"
                  id="documento"
                  name="documento"
                  value={formData.documento}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fechaNacimiento" className="mb-2 block font-medium text-gray-700 dark:text-gray-200">
                  Fecha de Nacimiento *
                </label>
                <input
                  type="date"
                  id="fechaNacimiento"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="genero" className="mb-2 block font-medium text-gray-700 dark:text-gray-200">
                  Género
                </label>
                <select
                  id="genero"
                  name="genero"
                  value={formData.genero || ""}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                >
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fechaIngreso" className="mb-2 block font-medium text-gray-700 dark:text-gray-200">
                  Fecha de Ingreso *
                </label>
                <input
                  type="date"
                  id="fechaIngreso"
                  name="fechaIngreso"
                  value={formData.fechaIngreso}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="codigoSap" className="mb-2 block font-medium text-gray-700 dark:text-gray-200">
                  Código SAP
                </label>
                <input
                  type="text"
                  id="codigoSap"
                  name="codigoSap"
                  value={formData.codigoSap || ""}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cargo" className="mb-2 block font-medium text-gray-700 dark:text-gray-200">
                  Cargo *
                </label>
                <input
                  type="text"
                  id="cargo"
                  name="cargo"
                  value={formData.cargo}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="salario" className="mb-2 block font-medium text-gray-700 dark:text-gray-200">
                  Salario
                </label>
                <input
                  type="number"
                  id="salario"
                  name="salario"
                  value={formData.salario}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="areaId" className="mb-2 block font-medium text-gray-700 dark:text-gray-200">
                  Área *
                </label>
                <select
                  id="areaId"
                  name="areaId"
                  value={formData.areaId}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                  required
                >
                  {areas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.nombre}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="ciudadId" className="mb-2 block font-medium text-gray-700 dark:text-gray-200">
                  Ciudad *
                </label>
                <select
                  id="ciudadId"
                  name="ciudadId"
                  value={formData.ciudadId}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                  required
                >
                  {ciudades.map((ciudad) => (
                    <option key={ciudad.id} value={ciudad.id}>
                      {ciudad.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="telefono" className="mb-2 block font-medium text-gray-700 dark:text-gray-200">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono || ""}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="mb-2 block font-medium text-gray-700 dark:text-gray-200">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="direccion" className="mb-2 block font-medium text-gray-700 dark:text-gray-200">
                Dirección
              </label>
              <textarea
                id="direccion"
                name="direccion"
                value={formData.direccion || ""}
                onChange={handleChange}
                rows={2}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="activo"
                name="activo"
                checked={formData.activo}
                onChange={(e) => setFormData({...formData, activo: e.target.checked})}
                className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:focus:ring-brand-500"
              />
              <label htmlFor="activo" className="ml-2 block text-sm text-gray-700 dark:text-gray-200">
                Empleado Activo
              </label>
            </div>

            <div className="flex items-center justify-end mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button
                type="button"
                onClick={closeModal}
                className="mr-3 flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
                disabled={loading}
              >
                {loading ? <SpinnerLoader /> : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default EditarEmpleado;
