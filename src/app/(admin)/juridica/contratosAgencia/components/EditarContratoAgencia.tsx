import { useModal } from "@/hooks/useModal";
import { PencilIcon } from '@/icons';
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { FormEvent, useState, useEffect } from "react";
import ContratoAgencia from "@/data/ContratoAgencia";
import { SpinnerLoader } from "@/components/ui/loader/loaders";
import Agencia from "@/data/Agencia";

interface Props {
  contrato: ContratoAgencia;
  onSave: () => void;
}

const EditarContratoAgencia: React.FC<Props> = ({ contrato, onSave }) => {
  const { isOpen, openModal, closeModal } = useModal();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: contrato.id,
    codigoContrato: contrato.codigoContrato || "",
    contratoInicio: contrato.contratoInicio ? new Date(contrato.contratoInicio).toISOString().split("T")[0] : "",
    contratoFin: contrato.contratoFin ? new Date(contrato.contratoFin).toISOString().split("T")[0] : "",
    tipoGarantia: contrato.tipoGarantia || "",
    montoGarantia: contrato.montoGarantia || 0,
    testimonioNotarial: contrato.testimonioNotarial || "",
    estado: contrato.estado || "vigente",
    observaciones: contrato.observaciones || "",
    activo: contrato.activo || false,
    agenciaId: contrato.agenciaId
  });
  const [agencias, setAgencias] = useState<Agencia[]>([]);
  const [loadingAgencias, setLoadingAgencias] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAgencias();
    }
  }, [isOpen]);

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
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: name === "montoGarantia" ? parseFloat(value) || 0 : 
              type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/contratosAgencia`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        closeModal();
        onSave();
      } else {
        console.error("Error al actualizar el contrato");
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
        variant="outline" 
        startIcon={<PencilIcon />} 
        onClick={openModal}
      >
        Editar
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[600px] p-6"
      >
        <div>
          <h2 className="mb-5 text-xl font-semibold text-gray-800 dark:text-white">
            Editar Contrato de Agencia
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="mb-4">
                <label htmlFor="codigoContrato" className="mb-2.5 block font-medium text-gray-700 dark:text-gray-200">
                  Código de Contrato
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
                  Agencia
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
                <label htmlFor="contratoInicio" className="mb-2.5 block font-medium text-gray-700 dark:text-gray-200">
                  Fecha de Inicio
                </label>
                <input
                  type="date"
                  id="contratoInicio"
                  name="contratoInicio"
                  value={formData.contratoInicio}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="contratoFin" className="mb-2.5 block font-medium text-gray-700 dark:text-gray-200">
                  Fecha de Fin
                </label>
                <input
                  type="date"
                  id="contratoFin"
                  name="contratoFin"
                  value={formData.contratoFin}
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
                  Estado
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

              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="activo"
                    name="activo"
                    checked={formData.activo}
                    onChange={handleChange}
                    className="mr-2 h-4 w-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                  />
                  <label htmlFor="activo" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Contrato activo
                  </label>
                </div>
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
                {loading ? <SpinnerLoader /> : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default EditarContratoAgencia;
