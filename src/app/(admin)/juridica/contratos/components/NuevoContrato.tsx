"use client";
import Radio from "@/components/form/input/Radio";
import Button from "@/components/ui/button/Button";
import { SpinnerLoader } from "@/components/ui/loader/loaders";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { useToast } from "@/hooks/useToast";
import { PlusIcon } from "@/icons";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

type Inputs = {
  title: string;
  object: string;
  desc: string;
  content: string;
  dateStart: Date;
  dateEnd: Date;
  ammount: string;
  status: string;
};

interface Props {
  onSave: (isNew?: boolean) => void;
}

const NuevoContrato: React.FC<Props> = (props) => {
  const router = useRouter();
  const { isOpen, openModal, closeModal } = useModal();
  const [loading, setLoading] = useState(false);
  // const [eventStartDate, setEventStartDate] = useState("");
  // const [eventEndDate, setEventEndDate] = useState("");
  const [selectedValue, setSelectedValue] = useState<string>("Active");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      // nacimiento: new Date() || null,
    },
  });

  const { addToast } = useToast();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);
    const response = await fetch("/api/contratos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: data.title,
        object: data.object,
        ammount: data.ammount,
        desc: data.desc,
        content: data.content,
        dateStart: data.dateStart,
        dateEnd: data.dateEnd
      }),
    });

    setLoading(false);

    if (response.ok) {
      router.push("/juridica/contratos");
      closeModal();
      props.onSave(true);
    } else {
      addToast({
        title: "Error",
        description: "Hubo un problema al crear el contrato",
        variant: "destructive"
      });
    }
  };

  // const onCancel = () => {
  //   router.push("/sign-in");
  // };

  const handleRadioChange = (value: string) => {
    setSelectedValue(value);
  };

  const inputStyle = "dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800";

  return(
    <>
      <div className="flex flex-wrap gap-4">
        <Button size="sm" variant="primary" endIcon={<PlusIcon />} onClick={openModal}>
        Agregar Nuevo contrato
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
              {"Agregar Contrato"}
            </h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Agregue un nuevo contrato
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-1">
            <div className="mt-6">
              {fieldTitle('Titulo')}
              
              <div className="relative">
                <input
                  id="contrato-titulo"
                  type="text"
                  placeholder="Titulo del contrato"
                  {...register("title", { required: true })}
                  className={`${inputStyle} ${errors.title ? "dark:border-red-500 border-red-300" : "dark:border-gray-700 border-gray-300"}`}
                />
                {errors.title && (
                  <p className={`mt-1.5 text-xs text-error-500 `}>
                    El titulo es requerido</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              {fieldTitle('Objeto')}
              
              <div className="relative">
                <input
                  id="contrato-objeto"
                  type="text"
                  placeholder="Objeto del contrato"
                  {...register("object", { required: true })}
                  className={`${inputStyle} ${errors.object ? "dark:border-red-500 border-red-300" : "dark:border-gray-700 border-gray-300"}`}
                />
                {errors.object && (
                  <p className={`mt-1.5 text-xs text-error-500 `}>
                    El Objeto es requerido</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              {fieldTitle('Monto')}
              
              <div className="relative">
                <input
                  id="contrato-ammount"
                  type="number"
                  min={0}
                  placeholder="Monto del contrato"
                  {...register("ammount", { required: true, min: 0 })}
                  className={`${inputStyle} ${errors.ammount ? "dark:border-red-500 border-red-300" : "dark:border-gray-700 border-gray-300"}`}
                />
                {errors.ammount && (
                  <p className={`mt-1.5 text-xs text-error-500 `}>
                    El Monto es requerido</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              {fieldTitle('Fecha de Inicio')}
              
              <div className="relative">
                <input
                  id="event-start-date"
                  type="date"
                  {...register("dateStart", { required: true })}
                  className={`${inputStyle} ${errors.dateStart ? "dark:border-red-500 border-red-300" : "dark:border-gray-700 border-gray-300"}`}
                />
                {errors.dateStart && (
                  <p className={`mt-1.5 text-xs text-error-500 `}>
                    Fecha de Inicio es requerido</p>
                )}
              </div>
            </div>
            <div className="mt-6">
              {fieldTitle('Fecha de Finalización')}
              
              <div className="relative">
                <input
                  id="event-end-date"
                  type="date"
                  {...register("dateEnd", { required: true })}
                  className={`${inputStyle} ${errors.dateEnd ? "dark:border-red-500 border-red-300" : "dark:border-gray-700 border-gray-300"}`}
                />
                {errors.dateEnd && (
                  <p className={`mt-1.5 text-xs text-error-500 `}>
                    Fecha de Finalización es requerida</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              {fieldTitle('Estado')}
              
              <div className="flex flex-wrap items-center gap-8">
                <Radio
                  id="radio-active"
                  name="Active"
                  value="Active"
                  checked={selectedValue === "Active"}
                  onChange={handleRadioChange}
                  label="Activo"
                />
                <Radio
                  id="radio-finish"
                  name="Finish"
                  value="Finish"
                  checked={selectedValue === "Finish"}
                  onChange={handleRadioChange}
                  label="Finalizado"
                />
              </div>
            </div>

            <div className="mt-6">
              {fieldTitle('Descripcion')}
              
              <div className="relative">
                <textarea
                  id="contrato-desc"
                  cols={3}
                  placeholder="Descripción del contrato"
                  {...register("desc", { required: true })}
                  className={`${inputStyle} ${errors.desc ? "dark:border-red-500 border-red-300" : "dark:border-gray-700 border-gray-300"}`}
                />
                {errors.desc && (
                  <p className={`mt-1.5 text-xs text-error-500 `}>
                    La descripción es requerida</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              {fieldTitle('Contenido')}
              
              <div className="relative">
                <textarea
                  id="contrato-content"
                  rows={3}
                  placeholder="Contenido del contrato"
                  {...register("content", { required: true })}
                  className={`${inputStyle} ${errors.content ? "dark:border-red-500 border-red-300" : "dark:border-gray-700 border-gray-300"}`}
                />
                {errors.content && (
                  <p className={`mt-1.5 text-xs text-error-500 `}>
                    Contenido es requerido</p>
                )}
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

export default NuevoContrato;