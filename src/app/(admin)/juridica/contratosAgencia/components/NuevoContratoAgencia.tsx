import { useModal } from "@/hooks/useModal";
import { PlusIcon } from '@/icons';
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { FormEvent, useState, useEffect } from "react";
import { SpinnerLoader } from "@/components/ui/loader/loaders";
import Agencia from "@/data/Agencia";

interface Props {
  onSave: () => void;
  agenciaPreseleccionada?: number | null;
}

const NuevoContratoAgencia: React.FC<Props> = ({ onSave, agenciaPreseleccionada }) => {
  const { isOpen, openModal, closeModal } = useModal();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    codigoContrato: "",
    contratoAgenciaInicio: "",
    contratoAgenciaFin: "",
    tipoGarantia: "",
    montoGarantia: 0,
    testimonioNotarial: "",
    estado: "vigente",
    observaciones: "",
    agenciaId: agenciaPreseleccionada ? agenciaPreseleccionada.toString() : ""
  });
  const [agencias, setAgencias] = useState<Agencia[]>([]);
  const [loadingAgencias, setLoadingAgencias] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAgencias();
      
      // Actualizar el ID de agencia si hay una preseleccionada
      if (agenciaPreseleccionada) {
        setFormData(prev => ({
          ...prev,
          agenciaId: agenciaPreseleccionada.toString()
        }));
      }
    }
  }, [isOpen, agenciaPreseleccionada]);

  const fetchAgencias = async () => {
    setLoadingAgencias(true);
    try {
      const response = await fetch("/api/agencias");
      if (response.ok) {
        const data = await response.json();
        setAgencias(data.data);
      }
    } catch (error) {
      console.error("Error al cargar agencias:", error);
    } finally {
      setLoadingAgencias(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "montoGarantia" ? parseFloat(value) || 0 : 
              name === "agenciaId" ? parseInt(value) || "" : value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/contratosAgencia`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        closeModal();
        resetForm();
        onSave();
      } else {
        console.error("Error al crear el contrato");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      codigoContrato: "",
      contratoAgenciaInicio: "",
      contratoAgenciaFin: "",
      tipoGarantia: "",
      montoGarantia: 0,
      testimonioNotarial: "",
      estado: "vigente",
      observaciones: "",
      agenciaId: ""
    });
  };

  return (
    <>
      <Button 
        size="md" 
        variant="primary" 
        startIcon={<PlusIcon />} 
        onClick={openModal}
      >
        Nuevo Contrato
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[600px] p-6"
      >
        <div>
          <h2 className="mb-5 text-xl font-semibold text-gray-800 dark:text-white">
            Nuevo Contrato de Agencia
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="mb-4">
                <label htmlFor="codigoContrato" className="mb-2.5 block font-medium text-gray-700 dark:text-gray-200">
                  Código de Contrato *
                </label>
                <input
                  type="text"
                  id="codigoContrato"
                  name="codigoContrato"
                  value={formData.codigoContrato}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="agenciaId" className="mb-2.5 block font-medium text-gray-700 dark:text-gray-200">
                  Agencia *
                </label>
                <select
                  id="agenciaId"
                  name="agenciaId"
                  value={formData.agenciaId}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                  required
                  disabled={loadingAgencias}
                >
                  <option value="">Seleccione una agencia</option>
                  {agencias.map((agencia) => (
                    <option key={agencia.id} value={agencia.id}>
                      {agencia.nombre || "Agencia sin nombre"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="contratoAgenciaInicio" className="mb-2.5 block font-medium text-gray-700 dark:text-gray-200">
                  Fecha de Inicio *
                </label>
                <input
                  type="date"
                  id="contratoAgenciaInicio"
                  name="contratoAgenciaInicio"
                  value={formData.contratoAgenciaInicio}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="contratoAgenciaFin" className="mb-2.5 block font-medium text-gray-700 dark:text-gray-200">
                  Fecha de Fin *
                </label>
                <input
                  type="date"
                  id="contratoAgenciaFin"
                  name="contratoAgenciaFin"
                  value={formData.contratoAgenciaFin}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="tipoGarantia" className="mb-2.5 block font-medium text-gray-700 dark:text-gray-200">
                  Tipo de Garantía
                </label>
                <select
                  id="tipoGarantia"
                  name="tipoGarantia"
                  value={formData.tipoGarantia}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="Depósito bancario">Depósito bancario</option>
                  <option value="Garantía hipotecaria">Garantía hipotecaria</option>
                  <option value="Bien inmueble">Bien inmueble</option>
                  <option value="Fianza">Fianza</option>
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="montoGarantia" className="mb-2.5 block font-medium text-gray-700 dark:text-gray-200">
                  Monto de Garantía (Bs)
                </label>
                <input
                  type="number"
                  id="montoGarantia"
                  name="montoGarantia"
                  value={formData.montoGarantia}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                  step="0.01"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="testimonioNotarial" className="mb-2.5 block font-medium text-gray-700 dark:text-gray-200">
                  Testimonio Notarial
                </label>
                <input
                  type="text"
                  id="testimonioNotarial"
                  name="testimonioNotarial"
                  value={formData.testimonioNotarial}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="estado" className="mb-2.5 block font-medium text-gray-700 dark:text-gray-200">
                  Estado *
                </label>
                <select
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                  required
                >
                  <option value="vigente">Vigente</option>
                  <option value="renovacion">En renovación</option>
                  <option value="vencido">Vencido</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="observaciones" className="mb-2.5 block font-medium text-gray-700 dark:text-gray-200">
                Observaciones
              </label>
              <textarea
                id="observaciones"
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                rows={3}
              />
            </div>

            <div className="flex items-center justify-end mt-6">
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

export default NuevoContratoAgencia;
