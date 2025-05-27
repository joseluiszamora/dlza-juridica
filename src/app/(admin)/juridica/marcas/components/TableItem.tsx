import Button from "@/components/ui/button/Button";
import { TableRow, TableCell } from "@/components/ui/table";
import Marca from "@/data/Marca";
import { ImageIcon, TrashBinIcon } from '@/icons';
import { useState } from "react";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import { SpinnerLoader } from "@/components/ui/loader/loaders";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import EditarMarca from "./EditarMarca";

interface Props {
  marca: Marca;
  onChange: () => void;
  onDelete: () => void;
}

const MarcaListItem: React.FC<Props> = ({ marca, onChange, onDelete }) => {
  const { isOpen, openModal, closeModal } = useModal();
  const [loading, setLoading] = useState(false);

  const handleEliminar = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/marcas?id=${marca.id}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        closeModal();
        onDelete();
      } else {
        console.error("Error al eliminar marca");
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

  const handleViewRenovaciones = () => {
    // Navegar a la página de renovaciones de marca con filtro
    window.location.href = `/juridica/renovacionMarca?marcaId=${marca.id}`;
  };

  return (
    <TableRow key={marca.id}>
      <TableCell className="px-4 py-3 text-start text-theme-sm dark:text-gray-400">
        <div className="flex items-center">
          <div className="w-20 h-20 mr-3 overflow-hidden bg-gray-200 rounded-full flex-shrink-0 dark:bg-gray-700">
            {marca.logotipoUrl ? (
              <img 
                src={marca.logotipoUrl} 
                alt={`${marca.nombre}`} 
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-400">
                <ImageIcon className="w-5 h-5" />
              </div>
            )}
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {marca.nombre || "Sin nombre"}
            </div>
            {marca.tipo && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {marca.genero} - {marca.tipo}
              </div>
            )}
          </div>
        </div>
      </TableCell>
      
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {marca.claseNiza}
      </TableCell>
      
      <TableCell className="px-4 py-3">
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          # {marca.numeroRegistro}
        </div>
        <div className="mt-1">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoBadgeColor(marca.estado)}`}>
            {marca.estado}
          </span>
        </div>
      </TableCell>

      <TableCell className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
        <div>
          <strong>Registro:</strong> {formatDate(marca.fechaRegistro)}
        </div>
        <div>
          <strong>Expiración:</strong> {formatDate(marca.fechaExpiracionRegistro)}
        </div>
        <div>
          <strong>Límite renovación:</strong> {formatDate(marca.fechaLimiteRenovacion)}
        </div>
      </TableCell>

      <TableCell className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
        <div>
          <strong>Titular:</strong> {marca.titular}
        </div>
        <div>
          <strong>Apoderado:</strong> {marca.apoderado}
        </div>
      </TableCell>

      <TableCell className="px-4 py-3 text-center">
        <div className="flex justify-center">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            {marca.renovaciones?.length || 0}
          </span>
        </div>
        <button
          onClick={handleViewRenovaciones}
          className="mt-1 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Ver renovaciones
        </button>
      </TableCell>

      <TableCell className="px-4 py-3 text-center">
        <div className="flex items-center justify-center space-x-2">
          <EditarMarca marca={marca} onSave={onChange} />
          
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
            Eliminar Marca
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ¿Estás seguro de que deseas eliminar la marca &quot;{marca.nombre}&quot;? Esta acción no se puede deshacer.
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

export default MarcaListItem;
