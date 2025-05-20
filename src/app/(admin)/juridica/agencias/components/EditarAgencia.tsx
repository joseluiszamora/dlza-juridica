"use client";
import Button from "@/components/ui/button/Button";
import { SpinnerLoader } from "@/components/ui/loader/loaders";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { ChevronDownIcon, PencilIcon } from "@/icons";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
// import { useToast } from "@/hooks/useToast";
import Select from "@/components/form/Select";
import DatePicker from "@/components/form/DatePicker";
import Agencia from "@/data/Agencia";
import Agente from "@/data/Agente";
import Ciudad from "@/data/Ciudad";

type Inputs = {
  nombre: string;
  direccion: string;
  nitAgencia: string;
  tipoGarantia: string;
  montoGarantia: string;
  testimonioNotarial: string;
  contratoAlquiler: string;
  observaciones: string;
};

interface Props {
  agencia: Agencia;
  onSave: () => void;
}

const EditarAgencia: React.FC<Props> = ({ agencia, onSave }) => {
  const { isOpen, openModal, closeModal } = useModal();
  const [loading, setLoading] = useState(false);
  const [loadingDatos, setLoadingDatos] = useState(false);
  // const { toast } = useToast();

  // Estados para selects y campos específicos
  const [agenteId, setAgenteId] = useState<number>(agencia.agenteId);
  const [ciudadId, setCiudadId] = useState<number>(agencia.ciudadId);
  const [tipoGarantia, setTipoGarantia] = useState(agencia.tipoGarantia || "efectivo");
  const [contratoInicio, setContratoInicio] = useState<Date | null>(
    agencia.contratoAgenciaInicio ? new Date(agencia.contratoAgenciaInicio) : new Date()
  );
  const [contratoFin, setContratoFin] = useState<Date | null>(
    agencia.contratoAgenciaFin ? new Date(agencia.contratoAgenciaFin) : new Date()
  );
  const [vigenciaLicencia, setVigenciaLicencia] = useState<Date | null>(
    agencia.vigenciaLicenciaFuncionamiento ? new Date(agencia.vigenciaLicenciaFuncionamiento) : null
  );
  const [licenciaFuncionamiento, setLicenciaFuncionamiento] = useState(agencia.licenciaDeFuncionamiento === true);

  // Listas para selects
  const [agentes, setAgentes] = useState<Agente[]>([]);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);

  // Mapa
  const [latitud, setLatitud] = useState<number | null>(agencia.latitud);
  const [longitud, setLongitud] = useState<number | null>(agencia.longitud);

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<Inputs>({
    defaultValues: {
      nombre: agencia.nombre || "",
      direccion: agencia.direccion || "",
      nitAgencia: agencia.nitAgencia || "",
      tipoGarantia: agencia.tipoGarantia || "",
      montoGarantia: agencia.montoGarantia?.toString() || "",
      testimonioNotarial: agencia.testimonioNotarial || "",
      contratoAlquiler: agencia.contratoAlquiler || "",
      observaciones: agencia.observaciones || ""
    }
  });

  // Actualizar el formulario cuando cambia la agencia seleccionada
  useEffect(() => {
    reset({
      nombre: agencia.nombre || "",
      direccion: agencia.direccion || "",
      nitAgencia: agencia.nitAgencia || "",
      tipoGarantia: agencia.tipoGarantia || "",
      montoGarantia: agencia.montoGarantia?.toString() || "",
      testimonioNotarial: agencia.testimonioNotarial || "",
      contratoAlquiler: agencia.contratoAlquiler || "",
      observaciones: agencia.observaciones || ""
    });
    setAgenteId(agencia.agenteId);
    setCiudadId(agencia.ciudadId);
    setTipoGarantia(agencia.tipoGarantia || "efectivo");
    setLatitud(agencia.latitud);
    setLongitud(agencia.longitud);
    setContratoInicio(agencia.contratoAgenciaInicio ? new Date(agencia.contratoAgenciaInicio) : new Date());
    setContratoFin(agencia.contratoAgenciaFin ? new Date(agencia.contratoAgenciaFin) : new Date());
    setVigenciaLicencia(agencia.vigenciaLicenciaFuncionamiento ? new Date(agencia.vigenciaLicenciaFuncionamiento) : null);
    setLicenciaFuncionamiento(agencia.licenciaDeFuncionamiento === true);
  }, [agencia, reset]);

  // Cargar datos iniciales
  useEffect(() => {
    if (isOpen) {
      setLoadingDatos(true);
      Promise.all([
        fetch('/api/agentes').then(res => res.json()),
        fetch('/api/ciudades').then(res => res.json())
      ])
      .then(([agentesData, ciudadesData]) => {
        setAgentes(agentesData.data);
        setCiudades(ciudadesData.data);
      })
      .catch(error => {
        console.error('Error cargando datos:', error);
        // toast({
        //   title: "Error",
        //   description: "No se pudieron cargar los datos necesarios",
        //   variant: "error"
        // });
      })
      .finally(() => {
        setLoadingDatos(false);
      });
    }
  // }, [isOpen, toast]);
  }, [isOpen]);

  // Opciones para selects
  const tipoGarantiaOptions = [
    { value: "efectivo", label: "Efectivo" },
    { value: "cheque", label: "Cheque" },
    { value: "pagaré", label: "Pagaré" },
    { value: "letra", label: "Letra de Cambio" },
    { value: "otro", label: "Otro" }
  ];

  const agenteOptions = agentes.map(agente => ({
    value: agente.id.toString(),
    label: `${agente.nombres} ${agente.apellidos}`
  }));

  const ciudadOptions = ciudades.map(ciudad => ({
    value: ciudad.id.toString(),
    label: ciudad.nombre || ""
  }));

  // Manejadores de cambios
  const handleAgenteChange = (value: string) => {
    setAgenteId(parseInt(value));
  };

  const handleCiudadChange = (value: string) => {
    setCiudadId(parseInt(value));
  };

  const handleTipoGarantiaChange = (value: string) => {
    setTipoGarantia(value);
  };

  const handleDetectarUbicacion = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitud(position.coords.latitude);
          setLongitud(position.coords.longitude);
          // toast({
          //   title: "Ubicación detectada",
          //   description: `Lat: ${position.coords.latitude}, Long: ${position.coords.longitude}`,
          //   variant: "success"
          // });
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error);
          // toast({
          //   title: "Error",
          //   description: "No se pudo obtener la ubicación",
          //   variant: "error"
          // });
        }
      );
    } else {
      // toast({
      //   title: "Error",
      //   description: "Geolocalización no soportada en este navegador",
      //   variant: "error"
      // });
    }
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);
    
    try {
      const montoGarantia = data.montoGarantia ? parseFloat(data.montoGarantia) : 0;
      
      const response = await fetch(`/api/agencias?id=${agencia.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: data.nombre,
          agenteId: agenteId,
          ciudadId: ciudadId,
          direccion: data.direccion,
          latitud: latitud,
          longitud: longitud,
          licenciaDeFuncionamiento: licenciaFuncionamiento,
          vigenciaLicenciaFuncionamiento: vigenciaLicencia,
          nitAgencia: data.nitAgencia,
          tipoGarantia: tipoGarantia,
          montoGarantia: montoGarantia,
          testimonioNotarial: data.testimonioNotarial,
          contratoAlquiler: data.contratoAlquiler,
          contratoAgenciaInicio: contratoInicio,
          contratoAgenciaFin: contratoFin,
          observaciones: data.observaciones
        }),
      });

      if (response.ok) {
        closeModal();
        onSave();
      } else {
        const errorData = await response.json();
        console.error("Error al actualizar agencia:", errorData);
        // toast({
        //   title: "Error",
        //   description: errorData.error || "Error al actualizar agencia",
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
        className="max-w-[850px] p-6 lg:p-10"
      >
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar max-h-[80vh]">
          <div>
            <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
              {`Editar Agencia: ${agencia.nombre}`}
            </h5>
          </div>

          {loadingDatos ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-8 h-8 border-t-2 border-b-2 border-brand-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="mt-1">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  {fieldTitle('Nombre de la Agencia')}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Nombre de la Agencia"
                      {...register("nombre", { required: true })}
                      className={`${inputStyle} ${errors.nombre ? "dark:border-red-500 border-red-300" : "dark:border-gray-700 border-gray-300"}`}
                    />
                    {errors.nombre && (
                      <p className="mt-1.5 text-xs text-error-500">
                        El nombre es requerido</p>
                    )}
                  </div>
                </div>

                <div>
                  {fieldTitle('NIT de la Agencia (opcional)')}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="NIT"
                      {...register("nitAgencia")}
                      className={`${inputStyle} dark:border-gray-700 border-gray-300`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 mt-5 md:grid-cols-2">
                <div>
                  {fieldTitle('Agente Responsable')}
                  <div className="relative">
                    <Select
                      options={agenteOptions}
                      defaultValue={agenteId?.toString()}
                      placeholder="Seleccionar Agente"
                      onChange={handleAgenteChange}
                      className="dark:bg-dark-900"
                    />
                    <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                      <ChevronDownIcon/>
                    </span>
                  </div>
                </div>
                
                <div>
                  {fieldTitle('Ciudad')}
                  <div className="relative">
                    <Select
                      options={ciudadOptions}
                      defaultValue={ciudadId?.toString()}
                      placeholder="Seleccionar Ciudad"
                      onChange={handleCiudadChange}
                      className="dark:bg-dark-900"
                    />
                    <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                      <ChevronDownIcon/>
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                {fieldTitle('Dirección')}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Dirección completa"
                    {...register("direccion", { required: true })}
                    className={`${inputStyle} ${errors.direccion ? "dark:border-red-500 border-red-300" : "dark:border-gray-700 border-gray-300"}`}
                  />
                  {errors.direccion && (
                    <p className="mt-1.5 text-xs text-error-500">
                      La dirección es requerida</p>
                  )}
                </div>
              </div>

              <div className="mt-5">
                <div className="flex justify-between items-center">
                  {fieldTitle('Ubicación Geográfica')}
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleDetectarUbicacion}
                  >
                    Detectar Ubicación
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-5 mt-2 md:grid-cols-2">
                  <div>
                    <input
                      type="text"
                      placeholder="Latitud"
                      value={latitud !== null ? latitud.toString() : ''}
                      onChange={(e) => setLatitud(parseFloat(e.target.value) || null)}
                      className={`${inputStyle} dark:border-gray-700 border-gray-300`}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Longitud"
                      value={longitud !== null ? longitud.toString() : ''}
                      onChange={(e) => setLongitud(parseFloat(e.target.value) || null)}
                      className={`${inputStyle} dark:border-gray-700 border-gray-300`}
                    />
                  </div>
                </div>
              </div>

              {/* Sección de licencia */}
              <div className="mt-5">
                <div className="flex items-center mt-3 mb-2">
                  <input
                    id="licenciaFuncionamiento-edit"
                    type="checkbox"
                    checked={licenciaFuncionamiento}
                    onChange={(e) => setLicenciaFuncionamiento(e.target.checked)}
                    className="w-4 h-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500"
                  />
                  <label htmlFor="licenciaFuncionamiento-edit" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Licencia de Funcionamiento
                  </label>
                </div>
                
                {licenciaFuncionamiento && (
                  <div className="mt-3">
                    {fieldTitle('Vigencia de Licencia')}
                    <DatePicker 
                      onChange={setVigenciaLicencia} 
                      value={vigenciaLicencia}
                      placeholder="Seleccionar fecha de vigencia"
                    />
                  </div>
                )}
              </div>

              {/* Sección de garantía */}
              <div className="grid grid-cols-1 gap-5 mt-5 md:grid-cols-2">
                <div>
                  {fieldTitle('Tipo de Garantía')}
                  <div className="relative">
                    <Select
                      options={tipoGarantiaOptions}
                      defaultValue={tipoGarantia}
                      placeholder="Seleccionar Tipo"
                      onChange={handleTipoGarantiaChange}
                      className="dark:bg-dark-900"
                    />
                    <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                      <ChevronDownIcon/>
                    </span>
                  </div>
                </div>
                
                <div>
                  {fieldTitle('Monto de Garantía')}
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Monto"
                      {...register("montoGarantia")}
                      className={`${inputStyle} dark:border-gray-700 border-gray-300`}
                    />
                  </div>
                </div>
              </div>

              {/* Sección de documentos */}
              <div className="grid grid-cols-1 gap-5 mt-5 md:grid-cols-2">
                <div>
                  {fieldTitle('Testimonio Notarial (opcional)')}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Referencia del documento"
                      {...register("testimonioNotarial")}
                      className={`${inputStyle} dark:border-gray-700 border-gray-300`}
                    />
                  </div>
                </div>
                
                <div>
                  {fieldTitle('Contrato de Alquiler (opcional)')}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Referencia del documento"
                      {...register("contratoAlquiler")}
                      className={`${inputStyle} dark:border-gray-700 border-gray-300`}
                    />
                  </div>
                </div>
              </div>

              {/* Sección de contrato */}
              <div className="mt-5">
                <h6 className="mb-3 font-medium text-gray-700 dark:text-gray-300">
                  Periodo de Contrato
                </h6>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    {fieldTitle('Fecha de Inicio')}
                    <DatePicker 
                      onChange={setContratoInicio} 
                      value={contratoInicio}
                    />
                  </div>
                  
                  <div>
                    {fieldTitle('Fecha de Fin')}
                    <DatePicker 
                      onChange={setContratoFin} 
                      value={contratoFin}
                    />
                  </div>
                </div>
              </div>

              {/* Observaciones */}
              <div className="mt-5">
                {fieldTitle('Observaciones (opcional)')}
                <div className="relative">
                  <textarea
                    placeholder="Observaciones adicionales"
                    {...register("observaciones")}
                    rows={3}
                    className={`${inputStyle} resize-none`}
                  ></textarea>
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
          )}
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

export default EditarAgencia;
