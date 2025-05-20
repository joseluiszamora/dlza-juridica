"use client";
import Button from "@/components/ui/button/Button";
import { SpinnerLoader } from "@/components/ui/loader/loaders";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { ChevronDownIcon, PencilIcon } from "@/icons";
import { useEffect, useState, ChangeEvent } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Select from "@/components/form/Select";
import Agente from "@/data/Agente";
import DatePicker from "@/components/form/DatePicker";
// import { useToast } from "@/hooks/useToast";
import { uploadImageToSupabase } from "@/services/supabaseClient";
import { FileIcon } from "@/icons";

type Inputs = {
  nombres: string;
  apellidos: string;
  documento: string;
  expedido: string;
  celular: string;
  email: string;
  direccion: string;
  telefono: string;
};

interface Props {
  agente: Agente;
  onSave: () => void;
}

const EditarAgente: React.FC<Props> = ({ agente, onSave }) => {
  const { isOpen, openModal, closeModal } = useModal();
  const [loading, setLoading] = useState(false);
  const [expedido, setExpedido] = useState(agente.expedido || "La Paz");
  const [genero, setGenero] = useState(agente.genero || "Masculino");
  const [fechaNacimiento, setFechaNacimiento] = useState<Date | null>(
    agente.fechaNacimiento ? new Date(agente.fechaNacimiento) : new Date()
  );
  const [activo, setActivo] = useState(agente.activo !== false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(agente.imagenUrl || null);
  const [documentoCi, setDocumentoCi] = useState(agente.documentoCi === true);
  const [documentoCroquis, setDocumentoCroquis] = useState(agente.documentoCroquis === true);
  const [documentoServicioBasico, setDocumentoServicioBasico] = useState(agente.documentoServicioBasico === true);
  // const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<Inputs>({
    defaultValues: {
      nombres: agente.nombres || "",
      apellidos: agente.apellidos || "",
      documento: agente.documento || "",
      expedido: agente.expedido || "",
      celular: agente.celular || "",
      email: agente.email || "",
      direccion: agente.direccion || "",
      telefono: agente.telefono || "",
    }
  });

  // Actualizar formulario cuando cambia el agente seleccionado
  useEffect(() => {
    reset({
      nombres: agente.nombres || "",
      apellidos: agente.apellidos || "",
      documento: agente.documento || "",
      expedido: agente.expedido || "",
      celular: agente.celular || "",
      email: agente.email || "",
      direccion: agente.direccion || "",
      telefono: agente.telefono || "",
    });
    setExpedido(agente.expedido || "La Paz");
    setGenero(agente.genero || "Masculino");
    setFechaNacimiento(agente.fechaNacimiento ? new Date(agente.fechaNacimiento) : new Date());
    setActivo(agente.activo !== false);
    setDocumentoCi(agente.documentoCi === true);
    setDocumentoCroquis(agente.documentoCroquis === true);
    setDocumentoServicioBasico(agente.documentoServicioBasico === true);
  }, [agente, reset]);

  // Actualizar preview cuando cambia el agente
  useEffect(() => {
    setPreviewUrl(agente.imagenUrl || null);
  }, [agente]);

  const optionsExpedido = [
    { value: "La Paz", label: "La Paz" },
    { value: "Santa Cruz", label: "Santa Cruz" },
    { value: "Cochabamba", label: "Cochabamba" },
    { value: "Oruro", label: "Oruro" },
    { value: "Potosí", label: "Potosí" },
    { value: "Tarija", label: "Tarija" },
    { value: "Chuquisaca", label: "Chuquisaca" },
    { value: "Beni", label: "Beni" },
    { value: "Pando", label: "Pando" },
  ];

  const optionsGenero = [
    { value: "Masculino", label: "Masculino" },
    { value: "Femenino", label: "Femenino" },
    { value: "Otro", label: "Otro" },
  ];

  const optionsActivo = [
    { value: "true", label: "Activo" },
    { value: "false", label: "Inactivo" },
  ];
  
  const handleExpedidoChange = (value: string) => {
    setExpedido(value);
  };

  const handleGeneroChange = (value: string) => {
    setGenero(value);
  };

  const handleActivoChange = (value: string) => {
    setActivo(value === "true");
  };

  // Manejar la selección de imagen
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Verificar tipo de archivo
      if (!file.type.match('image.*')) {
        // toast({
        //   title: "Error",
        //   description: "Por favor seleccione una imagen válida",
        //   variant: "error"
        // });
        return;
      }
      
      // Verificar tamaño (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        // toast({
        //   title: "Error",
        //   description: "La imagen debe ser menor a 5MB",
        //   variant: "error"
        // });
        return;
      }
      
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!fechaNacimiento) {
      return;
    }

    setLoading(true);
    
    try {
      let imagenUrl = agente.imagenUrl;
      
      // Si hay una nueva imagen seleccionada, subirla
      if (selectedImage) {
        const newImageUrl = await uploadImageToSupabase(
          selectedImage, 
          `${data.nombres}-${data.apellidos}`
        );
        if (newImageUrl) {
          imagenUrl = newImageUrl;
        }
      } else if (previewUrl === null && agente.imagenUrl) {
        // Si se eliminó la imagen previamente existente
        imagenUrl = null;
      }
      
      const response = await fetch(`/api/agentes?id=${agente.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombres: data.nombres,
          apellidos: data.apellidos,
          documento: data.documento,
          expedido: expedido,
          fechaNacimiento: fechaNacimiento,
          genero: genero,
          direccion: data.direccion || "",
          telefono: data.telefono || "",
          celular: data.celular,
          email: data.email || "",
          activo: activo,
          imagenUrl: imagenUrl,
          documentoCi: documentoCi,
          documentoCroquis: documentoCroquis,
          documentoServicioBasico: documentoServicioBasico
        }),
      });

      if (response.ok) {
        closeModal();
        setSelectedImage(null);
        onSave();
      } else {
        const errorData = await response.json();
        // toast({
        //   title: "Error",
        //   description: errorData.error || "Error al actualizar agente",
        //   variant: "error"
        // });
        console.error("Error al actualizar agente:", errorData);
        console.error(errorData);
      }
    } catch (error) {
      console.error("Error:", error);
      // toast({
      //   title: "Error",
      //   description: "Ocurrió un error al procesar la solicitud",
      //   variant: "error"
      // });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800";

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
        className="max-w-[700px] p-6 lg:p-10"
      >
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
          <div>
            <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
              {`Editar Agente: ${agente.nombres} ${agente.apellidos}`}
            </h5>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-1">
            {/* Sección de imagen de perfil */}
            <div className="flex flex-col items-center mb-6">
              <div 
                className="relative w-32 h-32 mb-3 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-700"
              >
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Vista previa" 
                    className="object-cover w-full h-full"
                  />
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
                Cambiar Imagen
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
            
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                {fieldTitle('Nombres')}
                <div className="relative">
                  <input
                    id="agente.nombres"
                    type="text"
                    placeholder="Nombres"
                    {...register("nombres", { required: true })}
                    className={`${inputStyle} ${errors.nombres ? "dark:border-red-500 border-red-300" : "dark:border-gray-700 border-gray-300"}`}
                  />
                  {errors.nombres && (
                    <p className="mt-1.5 text-xs text-error-500">
                      El nombre es requerido</p>
                  )}
                </div>
              </div>

              <div>
                {fieldTitle('Apellidos')}
                <div className="relative">
                  <input
                    id="agente.apellidos"
                    type="text"
                    placeholder="Apellidos"
                    {...register("apellidos", { required: true })}
                    className={`${inputStyle} ${errors.apellidos ? "dark:border-red-500 border-red-300" : "dark:border-gray-700 border-gray-300"}`}
                  />
                  {errors.apellidos && (
                    <p className="mt-1.5 text-xs text-error-500">
                      El apellido es requerido</p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 mt-5 md:grid-cols-2">
              <div>
                {fieldTitle('Documento de Identidad')}
                <div className="relative">
                  <input
                    id="agente.documento"
                    type="text"
                    placeholder="Documento de Identidad"
                    {...register("documento", { required: true })}
                    className={`${inputStyle} ${errors.documento ? "dark:border-red-500 border-red-300" : "dark:border-gray-700 border-gray-300"}`}
                  />
                  {errors.documento && (
                    <p className="mt-1.5 text-xs text-error-500">
                      El documento es requerido</p>
                  )}
                </div>
              </div>
              
              <div>
                {fieldTitle('Expedido en')}
                <div className="relative">
                  <Select
                    options={optionsExpedido}
                    defaultValue={expedido}
                    placeholder="Seleccionar Departamento"
                    onChange={handleExpedidoChange}
                    className="dark:bg-dark-900"
                  />
                  <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                    <ChevronDownIcon/>
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 mt-5 md:grid-cols-2">
              <div>
                {fieldTitle('Fecha de Nacimiento')}
                <DatePicker 
                  onChange={setFechaNacimiento} 
                  value={fechaNacimiento}
                />
              </div>
              
              <div>
                {fieldTitle('Género')}
                <div className="relative">
                  <Select
                    options={optionsGenero}
                    defaultValue={genero}
                    placeholder="Seleccionar Género"
                    onChange={handleGeneroChange}
                    className="dark:bg-dark-900"
                  />
                  <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                    <ChevronDownIcon/>
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 mt-5 md:grid-cols-2">
              <div>
                {fieldTitle('Celular')}
                <div className="relative">
                  <input
                    id="agente.celular"
                    type="text"
                    placeholder="Número de celular"
                    {...register("celular", { required: true })}
                    className={`${inputStyle} ${errors.celular ? "dark:border-red-500 border-red-300" : "dark:border-gray-700 border-gray-300"}`}
                  />
                  {errors.celular && (
                    <p className="mt-1.5 text-xs text-error-500">
                      El celular es requerido</p>
                  )}
                </div>
              </div>

              <div>
                {fieldTitle('Teléfono (opcional)')}
                <div className="relative">
                  <input
                    id="agente.telefono"
                    type="text"
                    placeholder="Número de teléfono"
                    {...register("telefono")}
                    className={`${inputStyle} dark:border-gray-700 border-gray-300`}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 mt-5 md:grid-cols-2">
              <div>
                {fieldTitle('Email (opcional)')}
                <div className="relative">
                  <input
                    id="agente.email"
                    type="email"
                    placeholder="Correo electrónico"
                    {...register("email")}
                    className={`${inputStyle} dark:border-gray-700 border-gray-300`}
                  />
                </div>
              </div>

              <div>
                {fieldTitle('Estado')}
                <div className="relative">
                  <Select
                    options={optionsActivo}
                    defaultValue={activo ? "true" : "false"}
                    placeholder="Seleccionar Estado"
                    onChange={handleActivoChange}
                    className="dark:bg-dark-900"
                  />
                  <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                    <ChevronDownIcon/>
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5">
              {fieldTitle('Dirección (opcional)')}
              <div className="relative">
                <input
                  id="agente.direccion"
                  type="text"
                  placeholder="Dirección completa"
                  {...register("direccion")}
                  className={`${inputStyle} dark:border-gray-700 border-gray-300`}
                />
              </div>
            </div>

            {/* Sección de documentación */}
            <div className="mt-5">
              <h6 className="mb-3 font-medium text-gray-700 dark:text-gray-300">
                Documentación
              </h6>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="flex items-center">
                  <input
                    id="documentoCi-edit"
                    type="checkbox"
                    checked={documentoCi}
                    onChange={(e) => setDocumentoCi(e.target.checked)}
                    className="w-4 h-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500"
                  />
                  <label htmlFor="documentoCi-edit" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Carnet de Identidad
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="documentoCroquis-edit"
                    type="checkbox"
                    checked={documentoCroquis}
                    onChange={(e) => setDocumentoCroquis(e.target.checked)}
                    className="w-4 h-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500"
                  />
                  <label htmlFor="documentoCroquis-edit" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Croquis
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="documentoServicioBasico-edit"
                    type="checkbox"
                    checked={documentoServicioBasico}
                    onChange={(e) => setDocumentoServicioBasico(e.target.checked)}
                    className="w-4 h-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500"
                  />
                  <label htmlFor="documentoServicioBasico-edit" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Factura Servicio Básico
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
              <button
                onClick={closeModal}
                type="button"
                className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
              >
                Cancelar
              </button>
              
              {!loading && (
                <button
                  type="submit"
                  className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
                >
                  Actualizar
                </button>
              )}

              {loading && <SpinnerLoader />}
            </div>
          </form>
        </div>
      </Modal>
    </>
  );

  function fieldTitle(name: string) {
    return (
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        {name}
      </label>
    );
  }
};

export default EditarAgente;
