import Button from "@/components/ui/button/Button";
import { TableRow, TableCell } from "@/components/ui/table";
import { TrashBinIcon } from '@/icons';
import { useState } from "react";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import { SpinnerLoader } from "@/components/ui/loader/loaders";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import EditarArea from "./EditarArea";

interface Area {
  id: number;
  nombre: string;
  departamento: string | null;
  createdAt: Date;
}

interface Props {
  area: Area;
  onChange: () => void;
  onDelete: () => void;
}

const AreaListItem: React.FC<Props> = ({ area, onChange, onDelete }) => {
  const { isOpen, openModal, closeModal } = useModal();
  const [loading, setLoading] = useState(false);

  const handleEliminar = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/areas?id=${area.id}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        closeModal();
        onDelete();
      } else {
        console.error("Error al eliminar área");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), "dd/MM/yyyy", { locale: es });
  };

  return (
    <TableRow key={area.id}>
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        <div className="font-medium text-gray-900 dark:text-white">
          {area.nombre}
        </div>
      </TableCell>
      
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        {area.departamento || "No especificado"}
      </TableCell>
      
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        {formatDate(area.createdAt)}
      </TableCell>
      
      <TableCell className="px-4 py-3 text-gray-500 text-end text-theme-sm dark:text-gray-400">
        <div className="flex space-x-2 justify-end">
          <EditarArea area={area} onSave={onChange} />
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
                ¿Está seguro que desea eliminar el área <strong>{area.nombre}</strong>?
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

export default AreaListItem;
