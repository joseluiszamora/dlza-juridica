"use client";
import Button from "@/components/ui/button/Button";
import { SpinnerLoader } from "@/components/ui/loader/loaders";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { ChevronDownIcon, PlusIcon } from "@/icons";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Select from "@/components/form/Select";

type Inputs = {
  nombre: string;
  pais: string;
};

interface Props {
  onSave: () => void;
}

const NuevaCiudad: React.FC<Props> = (props) => {
  const router = useRouter();
  const { isOpen, openModal, closeModal } = useModal();
  const [loading, setLoading] = useState(false);
  const [pais, setPais] = useState("bolivia");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      // nacimiento: new Date() || null,
    },
  });

  const optionsPais = [
    { value: "bolivia", label: "Bolivia" },
    { value: "peru", label: "Perú" },
    { value: "chile", label: "Chile" },
    { value: "argentina", label: "Argentina" },
    { value: "brasil", label: "Brasil" },
  ];
  
  const handleSelectChange = (value: string) => {
    setPais(value);
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);
    const response = await fetch("/api/ciudades", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: data.nombre,
        pais: pais,
      }),
    });

    setLoading(false);

    if (response.ok) {
      router.push("/juridica/ciudades");
      closeModal();
      props.onSave();
    }
  };

  const inputStyle = "dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800";

  return(
    <>
      <div className="flex flex-wrap gap-4">
        <Button size="sm" variant="primary" startIcon={<PlusIcon />} onClick={openModal}>
        Agregar Nueva Ciudad
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
              {"Agregar Ciudad"}
            </h5>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-1">
            <div className="mt-6">
              {fieldTitle('Ciudad')}
              
              <div className="relative">
                <input
                  id="ciudad.nombre"
                  type="text"
                  placeholder="Nombre de la Ciudad"
                  {...register("nombre", { required: true })}
                  className={`${inputStyle} ${errors.nombre ? "dark:border-red-500 border-red-300" : "dark:border-gray-700 border-gray-300"}`}
                />
                {errors.nombre && (
                  <p className={`mt-1.5 text-xs text-error-500 `}>
                    El titulo es requerido</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              {fieldTitle('Pais')}
              
              <div className="relative">
                <Select
                  options={optionsPais}
                  defaultValue="bolivia"
                  placeholder="Select Option"
                  onChange={handleSelectChange}
                  className="dark:bg-dark-900"
                />
                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                  <ChevronDownIcon/>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
              <button
                onClick={closeModal}
                type="button"
                className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
              >
                Cerrar
              </button>
              
              {!loading &&<button
                type="submit"
                className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
              >
                Guardar
              </button>}

              {loading && <SpinnerLoader />}
            </div>
          </form>
        </div>
      </Modal>
      
  </>);

  function fieldTitle(name: string) {
    return <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
      {name}
    </label>;
  }
}

export default NuevaCiudad;