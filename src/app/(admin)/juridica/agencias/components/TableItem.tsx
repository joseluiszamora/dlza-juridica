import Button from "@/components/ui/button/Button";
import { TableRow, TableCell } from "@/components/ui/table";
import Agencia from "@/data/Agencia";
import { MapIcon, TrashBinIcon, FileIcon } from '@/icons';
import { useState } from "react";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import { SpinnerLoader } from "@/components/ui/loader/loaders";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import EditarAgencia from "./EditarAgencia";

interface Props {
  agencia: Agencia;
  onChange: () => void;
  onDelete: () => void;
}

const AgenciaListItem: React.FC<Props> = ({ agencia, onChange, onDelete }) => {
  const { isOpen, openModal, closeModal } = useModal();
  const [loading, setLoading] = useState(false);

  const handleEliminar = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/agencias?id=${agencia.id}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        closeModal();
        onDelete();
      } else {
        console.error("Error al eliminar agencia");
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

  const hasValidContract = agencia.inicioContratoVigente && agencia.finContratoVigente;

  return (
    <TableRow key={agencia.id}>
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        <div className="font-medium text-gray-900 dark:text-white">
          {agencia.nombre || "Sin nombre"}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Código: {agencia.codigoContratoVigente}
        </div>
      </TableCell>
      
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        {agencia.agente ? `${agencia.agente.nombres} ${agencia.agente.apellidos}` : "No asignado"}
      </TableCell>
      
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        {agencia.ciudad?.nombre || "No especificada"}
      </TableCell>
      
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        <div className="flex items-start">
          <MapIcon className="w-4 h-4 mt-0.5 mr-1 flex-shrink-0" />
          <span>{agencia.direccion || "Sin dirección"}</span>
        </div>
      </TableCell>
      
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        <div className="flex items-center justify-center">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
            {agencia.contratos?.length || 0}
          </span>
        </div>
      </TableCell>
      
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        {hasValidContract ? (
          <div>
            <div className="text-xs">
              Inicio: {formatDate(agencia.inicioContratoVigente)}
            </div>
            <div className="text-xs">
              Fin: {formatDate(agencia.finContratoVigente)}
            </div>
          </div>
        ) : (
          <span className="text-error-500 text-xs">Sin contrato</span>
        )}
      </TableCell>
      
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline" 
            startIcon={<FileIcon />}
            onClick={() => window.location.href = `/juridica/contratosAgencia?agenciaId=${agencia.id}`}
          >
            Contratos
          </Button>
          <EditarAgencia agencia={agencia} onSave={onChange} />
          <Button
            variant="outline"
            size="sm"
            onClick={openModal}
            className="text-red-600 hover:text-red-700 dark:text-red-400"
          >
            <TrashBinIcon size={16} />
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
                ¿Está seguro que desea eliminar la agencia <strong>{agencia.nombre}</strong>?
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

export default AgenciaListItem;
