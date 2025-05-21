"use client";
import Button from "@/components/ui/button/Button";
import { SpinnerLoader } from "@/components/ui/loader/loaders";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { PlusIcon, ImageIcon, EyeIcon, EyeCloseIcon } from "@/icons";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
// import { useToast } from "@/hooks/useToast";
import { uploadImageToSupabase } from "@/services/supabaseClient";

type Inputs = {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  nombres: string;
  apellidos: string;
  documento: string;
};

interface Props {
  onSave: () => void;
}

const NuevoUsuario: React.FC<Props> = ({ onSave }) => {
  const { isOpen, openModal, closeModal } = useModal();
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm<Inputs>();

  const password = watch("password", "");

  // Manejar la selección de imagen
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    if (data.password !== data.confirmPassword) {
      // toast({
      //   title: "Error",
      //   description: "Las contraseñas no coinciden",
      //   variant: "error"
      // });
      return;
    }

    setLoading(true);
    
    try {
      let imagenUrl = null;
      
      // Subir imagen si se seleccionó una
      if (selectedImage) {
        imagenUrl = await uploadImageToSupabase(
          selectedImage, 
          data.username,
          'usuarios'
        );
      }
      
      const response = await fetch("/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
          email: data.email,
          nombres: data.nombres,
          apellidos: data.apellidos,
          documento: data.documento,
          imagenUrl: imagenUrl
        }),
      });

      if (response.ok) {
        closeModal();
        reset();
        setSelectedImage(null);
        setPreviewUrl(null);
        onSave();
      } else {
        const errorData = await response.json();
        console.error("Error al crear usuario:", errorData);
        // toast({
        //   title: "Error",
        //   description: errorData.error || "Error al crear usuario",
        //   variant: "error"
        // });
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
      <div className="flex flex-wrap gap-4">
        <Button size="sm" variant="primary" startIcon={<PlusIcon />} onClick={openModal}>
          Agregar Nuevo Usuario
        </Button>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[700px] p-6 lg:p-10"
      >
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar max-h-[80vh]">
          <div>
            <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
              Agregar Nuevo Usuario
            </h5>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-1">
            {/* Sección de imagen de perfil */}
            <div className="flex flex-col items-center mb-6">
              <div 
                className="relative w-24 h-24 mb-3 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-700"
              >
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Vista previa" 
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-400">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
              </div>
              
              <label 
                htmlFor="profile-image" 
                className="px-4 py-2 text-sm font-medium text-white transition bg-brand-500 rounded-lg cursor-pointer hover:bg-brand-600"
              >
                Seleccionar Imagen
              </label>
              <input
                id="profile-image"
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
                {fieldTitle('Nombre de Usuario')}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Nombre de usuario"
                    {...register("username", { 
                      required: "El nombre de usuario es requerido",
                      minLength: {
                        value: 3,
                        message: "El nombre de usuario debe tener al menos 3 caracteres"
                      },
                      pattern: {
                        value: /^[a-zA-Z0-9_]+$/,
                        message: "Solo se permiten letras, números y guiones bajos"
                      }
                    })}
                    className={`${inputStyle} ${errors.username ? "dark:border-red-500 border-red-300" : "dark:border-gray-700 border-gray-300"}`}
                  />
                  {errors.username && (
                    <p className="mt-1.5 text-xs text-error-500">
                      {errors.username.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                {fieldTitle('Email')}
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    {...register("email", { 
                      required: "El correo electrónico es requerido",
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Formato de correo inválido"
                      }
                    })}
                    className={`${inputStyle} ${errors.email ? "dark:border-red-500 border-red-300" : "dark:border-gray-700 border-gray-300"}`}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-error-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 mt-5 md:grid-cols-2">
              <div>
                {fieldTitle('Nombres')}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Nombres"
                    {...register("nombres", { required: "Los nombres son requeridos" })}
                    className={`${inputStyle} ${errors.nombres ? "dark:border-red-500 border-red-300" : "dark:border-gray-700 border-gray-300"}`}
                  />
                  {errors.nombres && (
                    <p className="mt-1.5 text-xs text-error-500">
                      {errors.nombres.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                {fieldTitle('Apellidos')}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Apellidos"
                    {...register("apellidos", { required: "Los apellidos son requeridos" })}
                    className={`${inputStyle} ${errors.apellidos ? "dark:border-red-500 border-red-300" : "dark:border-gray-700 border-gray-300"}`}
                  />
                  {errors.apellidos && (
                    <p className="mt-1.5 text-xs text-error-500">
                      {errors.apellidos.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5">
              {fieldTitle('Documento de Identidad')}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Número de documento"
                  {...register("documento", { required: "El documento es requerido" })}
                  className={`${inputStyle} ${errors.documento ? "dark:border-red-500 border-red-300" : "dark:border-gray-700 border-gray-300"}`}
                />
                {errors.documento && (
                  <p className="mt-1.5 text-xs text-error-500">
                    {errors.documento.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 mt-5 md:grid-cols-2">
              <div>
                {fieldTitle('Contraseña')}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña"
                    {...register("password", { 
                      required: "La contraseña es requerida",
                      minLength: {
                        value: 6,
                        message: "La contraseña debe tener al menos 6 caracteres"
                      }
                    })}
                    className={`${inputStyle} ${errors.password ? "dark:border-red-500 border-red-300" : "dark:border-gray-700 border-gray-300"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                  >
                    {showPassword ? <EyeCloseIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                  {errors.password && (
                    <p className="mt-1.5 text-xs text-error-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                {fieldTitle('Confirmar Contraseña')}
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirmar contraseña"
                    {...register("confirmPassword", { 
                      required: "Confirme la contraseña",
                      validate: value => value === password || "Las contraseñas no coinciden"
                    })}
                    className={`${inputStyle} ${errors.confirmPassword ? "dark:border-red-500 border-red-300" : "dark:border-gray-700 border-gray-300"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                  >
                    {showConfirmPassword ? <EyeCloseIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                  {errors.confirmPassword && (
                    <p className="mt-1.5 text-xs text-error-500">
                      {errors.confirmPassword.message}
                    </p>
                  )}
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
                  Guardar
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

export default NuevoUsuario;
