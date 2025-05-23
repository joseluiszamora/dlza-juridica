import Button from "@/components/ui/button/Button";
import { TableRow, TableCell } from "@/components/ui/table";
import ContratoAgencia from "@/data/ContratoAgencia";
import { TrashBinIcon } from '@/icons';
import { useState } from "react";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import { SpinnerLoader } from "@/components/ui/loader/loaders";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import EditarContratoAgencia from "./EditarContratoAgencia";

interface Props {
  contrato: ContratoAgencia;
  onChange: () => void;
  onDelete: () => void;
}

const ContratoAgenciaListItem: React.FC<Props> = ({ contrato, onChange, onDelete }) => {
  const { isOpen, openModal, closeModal } = useModal();
  const [loading, setLoading] = useState(false);

  const handleEliminar = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/contratosAgencia?id=${contrato.id}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        closeModal();
        onDelete();
      } else {
        console.error("Error al eliminar contrato");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return format(new Date(date), "dd/MM/yyyy", { locale: es });
  };

  // Verificar si el contrato está vigente basado en las fechas
  const isContractActive = () => {
    if (!contrato.contratoAgenciaInicio || !contrato.contratoAgenciaFin) return false;
    const now = new Date();
    const endDate = new Date(contrato.contratoAgenciaFin);
    return endDate >= now;
  };

  // Determinar el estado visual del contrato
  const getStatusClass = () => {
    if (contrato.estado === "vigente" && isContractActive()) {
      return "bg-success-100 text-success-700";
    } else if (contrato.estado === "renovacion") {
      return "bg-warning-100 text-warning-700";
    } else {
      return "bg-error-100 text-error-700";
    }
  };

  return (
    <TableRow key={contrato.id}>
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        <div className="font-medium text-gray-900 dark:text-white">
          {contrato.codigoContrato || "Sin código"}
        </div>
      </TableCell>
      
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        {contrato.agencia ? contrato.agencia.nombre : "Agencia no asignada"}
      </TableCell>
      
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className="text-xs">Inicio: {formatDate(contrato.contratoAgenciaInicio)}</span>
          </div>
          <div className="flex items-center mt-1">
            <span className="text-xs">Fin: {formatDate(contrato.contratoAgenciaFin)}</span>
          </div>
        </div>
      </TableCell>
      
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        <span className={`inline-block rounded-full px-2 py-1 text-xs ${getStatusClass()}`}>
          {contrato.estado || "No especificado"}
        </span>
      </TableCell>
      
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        <div>
          <div className="text-xs">
            Tipo: {contrato.tipoGarantia || "No especificado"}
          </div>
          {contrato.montoGarantia && (
            <div className="text-xs">
              Monto: {contrato.montoGarantia.toLocaleString('es-BO', { style: 'currency', currency: 'BOB' })}
            </div>
          )}
        </div>
      </TableCell>
      
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        <div className="flex space-x-2">
          <EditarContratoAgencia contrato={contrato} onSave={onChange} />
          <Button 
            size="sm" 
            variant="danger" 
            startIcon={<TrashBinIcon />} 
            onClick={openModal}
          >
            Eliminar
          </Button>
        </div>

        {/* Modal de Confirmación */}
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          className="max-w-[450px] p-6"
        >
          <div className="flex flex-col px-2">
            <div>
              <h5 className="mb-2 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
                Confirmar eliminación
              </h5>
              <p className="text-gray-600 dark:text-gray-300">
                ¿Está seguro que desea eliminar el contrato <strong>{contrato.codigoContrato}</strong>?
                Esta acción no se puede deshacer.
              </p>
            </div>

            <div className="flex items-center gap-3 mt-6 sm:justify-end">
              <button
                onClick={closeModal}
                type="button"
                className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
              >
                Cancelar
              </button>
              
              {!loading && (
                <button
                  onClick={handleEliminar}
                  type="button"
                  className="flex w-full justify-center rounded-lg bg-error-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-error-600 sm:w-auto"
                >
                  Eliminar
                </button>
              )}

              {loading && <SpinnerLoader />}
            </div>
          </div>
        </Modal>
      </TableCell>
    </TableRow>
  );
};

export default ContratoAgenciaListItem;
