"use client";
import Button from "@/components/ui/button/Button";
import { SpinnerLoader } from "@/components/ui/loader/loaders";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { ChevronDownIcon, PlusIcon } from "@/icons";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Select from "@/components/form/Select";
import DatePicker from "@/components/form/DatePicker";

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
  onSave: () => void;
}

const NuevoAgente: React.FC<Props> = ({ onSave }) => {
  const { isOpen, openModal, closeModal } = useModal();
  const [loading, setLoading] = useState(false);
  const [expedido, setExpedido] = useState("La Paz");
  const [genero, setGenero] = useState("Masculino");
  const [fechaNacimiento, setFechaNacimiento] = useState<Date | null>(new Date());
  const [activo, setActivo] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<Inputs>();

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

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!fechaNacimiento) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/agentes", {
        method: "POST",
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
          activo: activo
        }),
      });

      if (response.ok) {
        closeModal();
        reset();
        onSave();
      } else {
        console.error("Error al crear agente");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800";

  return (
    <>
      <div className="flex flex-wrap gap-4">
        <Button size="sm" variant="primary" startIcon={<PlusIcon />} onClick={openModal}>
          Agregar Nuevo Agente
        </Button>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[700px] p-6 lg:p-10"
      >
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
          <div>
            <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
              Agregar Nuevo Agente
            </h5>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-1">
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
                    defaultValue="La Paz"
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
                    defaultValue="Masculino"
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
                    defaultValue="true"
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

export default NuevoAgente;
