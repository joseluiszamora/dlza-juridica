import Button from "@/components/ui/button/Button";
import { TableRow, TableCell } from "@/components/ui/table";
import RenovacionMarca from "@/data/RenovacionMarca";
import { TrashBinIcon } from '@/icons';
import { useState } from "react";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import { SpinnerLoader } from "@/components/ui/loader/loaders";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import EditarRenovacionMarca from "./EditarRenovacionMarca";

interface Props {
  renovacion: RenovacionMarca;
  onChange: () => void;
  onDelete: () => void;
}

const RenovacionMarcaListItem: React.FC<Props> = ({ renovacion, onChange, onDelete }) => {
  const { isOpen, openModal, closeModal } = useModal();
  const [loading, setLoading] = useState(false);

  const handleEliminar = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/renovacionMarca?id=${renovacion.id}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        closeModal();
        onDelete();
      } else {
        console.error("Error al eliminar renovación de marca");
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

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'vigente':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'renovada':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'registrada':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'caducada':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const handleViewMarca = () => {
    // Navegar a la página de marcas con filtro
    window.location.href = `/juridica/marcas`;
  };

  return (
    <TableRow key={renovacion.id}>
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        <div className="font-medium text-gray-900 dark:text-white">
          # {renovacion.numeroDeSolicitud}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Renovación: {renovacion.numeroDeRenovacion || "No asignado"}
        </div>
        {renovacion.procesoSeguidoPor && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Proceso: {renovacion.procesoSeguidoPor}
          </div>
        )}
      </TableCell>
      
      <TableCell className="px-4 py-3">
        <div className="font-medium text-gray-900 dark:text-white">
          {renovacion.marca?.nombre || "Marca no disponible"}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Registro: {renovacion.marca?.numeroRegistro || "N/A"}
        </div>
        <button
          onClick={handleViewMarca}
          className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Ver marca
        </button>
      </TableCell>

      <TableCell className="px-4 py-3">
        <div className="mb-2">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoBadgeColor(renovacion.estadoRenovacion)}`}>
            {renovacion.estadoRenovacion}
          </span>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <strong>Para renovación:</strong> {formatDate(renovacion.fechaParaRenovacion)}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Creado: {formatDate(renovacion.createdAt)}
        </div>
      </TableCell>

      <TableCell className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
        <div>
          <strong>Titular:</strong> {renovacion.titular}
        </div>
        <div>
          <strong>Apoderado:</strong> {renovacion.apoderado}
        </div>
      </TableCell>

      <TableCell className="px-4 py-3 text-center">
        <div className="flex items-center justify-center space-x-2">
          <EditarRenovacionMarca renovacion={renovacion} onSave={onChange} />
          
          <Button
            variant="outline"
            size="sm"
            onClick={openModal}
            className="text-red-600 hover:text-red-700 dark:text-red-400"
          >
            <TrashBinIcon size={16} />
          </Button>
        </div>
      </TableCell>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-md">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Eliminar Renovación de Marca
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ¿Estás seguro de que deseas eliminar la renovación con número de solicitud &quot;{renovacion.numeroDeSolicitud}&quot;? Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={closeModal}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleEliminar}
              disabled={loading}
            >
              {loading ? <SpinnerLoader /> : "Eliminar"}
            </Button>
          </div>
        </div>
      </Modal>
    </TableRow>
  );
};

export default RenovacionMarcaListItem;
