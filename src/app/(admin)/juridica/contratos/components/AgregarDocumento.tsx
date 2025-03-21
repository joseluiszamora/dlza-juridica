"use client";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { PlusIcon } from "@/icons";
import { useModal } from "@/hooks/useModal";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import DropzoneContratos from "./DropZoneContratos";

type Inputs = {
  title: string;
  desc: string;
};


const AgregarDocumento: React.FC = () => {
  const { isOpen, openModal, closeModal } = useModal();
  const [loading, setLoading] = useState(false);


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      // nacimiento: new Date() || null,
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async () => {
    setLoading(true);
    setLoading(false);
  };

  const inputStyle = "dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800";


  return(<>
    <div className="flex flex-wrap gap-4">
      <Button size="sm" variant="primary" endIcon={<PlusIcon />} onClick={openModal}>
      Agregar Nuevo Documento
      </Button>
    </div>

    <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] p-6 lg:p-10">
      <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
        <div>
          <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
            {"Agregar Documento"}
          </h5>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Agregue un nuevo documento a este contrato
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-1">
          <div className="mt-6">
            {fieldTitle('Titulo del documento')}
            <div className="relative">
              <input
                id="contrato-file-title"
                type="text"
                placeholder="Titulo del documento"
                {...register("title", { required: true })}
                className={`${inputStyle} ${errors.title ? "dark:border-red-500 border-red-300" : "dark:border-gray-700 border-gray-300"}`}
              />
              {errors.title && (
                <p className={`mt-1.5 text-xs text-error-500 `}>
                  El Titulo es requerido</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            {fieldTitle('Descripcioń del documento')}
            <div className="relative">
              <input
                id="contrato-file-desc"
                type="text"
                placeholder="Descripcioń del documento"
                {...register("desc", { required: false })}
                className={`${inputStyle} ${errors.desc ? "dark:border-red-500 border-red-300" : "dark:border-gray-700 border-gray-300"}`}
              />
              {errors.desc && (
                <p className={`mt-1.5 text-xs text-error-500 `}>
                  La descripción es requerida</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <DropzoneContratos  />
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

export default AgregarDocumento;