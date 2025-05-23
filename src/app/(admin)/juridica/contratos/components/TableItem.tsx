import Badge from "@/components/ui/badge/Badge";
import { TableRow, TableCell } from "@/components/ui/table";
import Contrato from "@/data/Contrato";
import Image from "next/image";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Button from "@/components/ui/button/Button";
import { EditIcon, TrashBinIcon } from "@/icons";
import { useState } from "react";
import { useToast } from "@/hooks/useToast";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import { SpinnerLoader } from "@/components/ui/loader/loaders";


interface Props {
  contrato: Contrato;
  onDelete?: () => void;
  onEdit?: (isNew?: boolean) => void;
}

const ContratoListItem: React.FC<Props> = (props) => {
  const { isOpen, openModal, closeModal } = useModal();
  const [isDeleting, setIsDeleting] = useState(false);
  const { addToast } = useToast();

  const handleEliminar = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/contratos/${props.contrato.id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        closeModal();
        props.onDelete?.();
      } else {
        addToast({
          title: "Error",
          description: "No se pudo eliminar el contrato",
          variant: "destructive"
        });
      }
    } catch (error) {
      addToast({
        title: "Error",
        description: "Ocurrió un error al eliminar el contrato",
        variant: "destructive"
      });
      console.error("Error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    // Aquí iría la lógica para mostrar el modal de edición
    // Por ahora solo mostraremos un toast para simular
    addToast({
      title: "Información",
      description: "Función de edición no implementada aún",
      variant: "default"
    });
  };

  return (
  <TableRow key={props.contrato.id}>
    <TableCell className="px-5 py-4 sm:px-6 text-start">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 overflow-hidden rounded-full">
          <Image
            width={40}
            height={40}
            src="/images/user/user-01.jpg"
            alt="Lindsey Curtis"
          />
        </div>
        <div>
          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
            Erwin
          </span>
          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
            Saavedra
          </span>
        </div>
      </div>
    </TableCell>
    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
      {props.contrato.title}
    </TableCell>
    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
      {props.contrato.object}
    </TableCell>
    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
      <Badge
        size="sm"
        color={
          props.contrato.status === "Active"
            ? "success"
            : props.contrato.status === "Pending"
            ? "warning"
            : "error"
        }
      >
        {props.contrato.status}
      </Badge>
    </TableCell>
    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
      {props.contrato.ammount}
    </TableCell>
    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
      {format(props.contrato.dateStart, 'dd/MM/yyyy', { locale: es })}
    </TableCell>
    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
      {format(props.contrato.dateEnd, 'dd/MM/yyyy', { locale: es })}
    </TableCell>
    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
      {props.contrato.desc}
    </TableCell>
    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
      <div className="flex space-x-2">
        <Button
          size="sm"
          variant="primary"
          onClick={handleEdit}
          className="p-2"
          disabled={isDeleting}
        >
          <EditIcon className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={openModal}
          className="p-2 text-error-500 hover:bg-error-50"
          disabled={isDeleting}
        >
          <TrashBinIcon className="w-4 h-4" />
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
              ¿Está seguro que desea eliminar el contrato <strong>{props.contrato.title}</strong>?
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
            
            {!isDeleting && (
              <button
                onClick={handleEliminar}
                type="button"
                className="flex w-full justify-center rounded-lg bg-error-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-error-600 sm:w-auto"
              >
                Eliminar
              </button>
            )}

            {isDeleting && <SpinnerLoader />}
          </div>
        </div>
      </Modal>
    </TableCell>
  </TableRow>
  );
};
export default ContratoListItem;
