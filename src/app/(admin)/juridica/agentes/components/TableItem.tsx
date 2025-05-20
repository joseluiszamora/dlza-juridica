import Button from "@/components/ui/button/Button";
import { TableRow, TableCell } from "@/components/ui/table";
import Agente from "@/data/Agente";
import { TrashBinIcon, FileIcon } from "@/icons";
import { useState } from "react";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import { SpinnerLoader } from "@/components/ui/loader/loaders";
import EditarAgente from "./EditarAgente";

interface Props {
  agente: Agente;
  onChange: () => void;
  onDelete: () => void;
}

const AgenteListItem: React.FC<Props> = ({ agente, onChange, onDelete }) => {
  const { isOpen, openModal, closeModal } = useModal();
  const [loading, setLoading] = useState(false);

  const handleEliminar = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/agentes?id=${agente.id}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        closeModal();
        onDelete();
      } else {
        console.error("Error al eliminar agente");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TableRow key={agente.id}>
      <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">
        <div className="flex items-center">
          <div className="w-10 h-10 mr-3 overflow-hidden bg-gray-200 rounded-full flex-shrink-0 dark:bg-gray-700">
            {agente.imagenUrl ? (
              <img 
                src={agente.imagenUrl} 
                alt={`${agente.nombres} ${agente.apellidos}`} 
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-400">
                <FileIcon className="w-5 h-5" />
              </div>
            )}
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {`${agente.nombres} ${agente.apellidos}`}
            </div>
            {agente.email && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {agente.email}
              </div>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        {agente.documento} <span className="text-xs">({agente.expedido})</span>
      </TableCell>
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        {agente.celular}
      </TableCell>
      <TableCell className="px-4 py-3 text-start text-theme-sm">
        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
          agente.activo ? 'bg-success-100 text-success-700' : 'bg-error-100 text-error-700'
        }`}>
          {agente.activo ? 'Activo' : 'Inactivo'}
        </span>
      </TableCell>
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        <div className="flex space-x-2">
          <EditarAgente agente={agente} onSave={onChange} />
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
                ¿Está seguro que desea eliminar al agente <strong>{agente.nombres} {agente.apellidos}</strong>?
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

export default AgenteListItem;
