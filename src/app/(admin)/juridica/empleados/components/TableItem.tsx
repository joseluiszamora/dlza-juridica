import Button from "@/components/ui/button/Button";
import { TableRow, TableCell } from "@/components/ui/table";
import { TrashBinIcon } from '@/icons';
import { useState } from "react";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import { SpinnerLoader } from "@/components/ui/loader/loaders";
// import { format } from "date-fns";
// import { es } from "date-fns/locale";
import EditarEmpleado from "./EditarEmpleado";

interface Empleado {
  id: number;
  nombres: string;
  apellidos: string;
  documento: string;
  tipoDocumento: string;
  fechaNacimiento: Date;
  genero: string | null;
  codigoSap: string | null;
  fechaIngreso: Date;
  activo: boolean;
  telefono: string | null;
  email: string | null;
  direccion: string | null;
  imagenUrl: string | null;
  salario: number;
  vacacionesDisponibles: number;
  cargo: string;
  areaId: number;
  ciudadId: number;
  createdAt: Date;
  area: {
    id: number;
    nombre: string;
  };
  ciudad: {
    id: number;
    nombre: string;
  };
}

interface Props {
  empleado: Empleado;
  onChange: () => void;
  onDelete: () => void;
}

const EmpleadoListItem: React.FC<Props> = ({ empleado, onChange, onDelete }) => {
  const { isOpen, openModal, closeModal } = useModal();
  const [loading, setLoading] = useState(false);

  const handleEliminar = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/empleados?id=${empleado.id}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        closeModal();
        onDelete();
      } else {
        console.error("Error al eliminar empleado");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // const formatDate = (date: Date) => {
  //   return format(new Date(date), "dd/MM/yyyy", { locale: es });
  // };

  return (
    <TableRow key={empleado.id}>
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        <div className="font-medium text-gray-900 dark:text-white">
          {`${empleado.nombres} ${empleado.apellidos}`}
        </div>
      </TableCell>
      
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        {`${empleado.tipoDocumento}: ${empleado.documento}`}
      </TableCell>
      
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        {empleado.cargo}
      </TableCell>
      
      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
        {empleado.area.nombre}
      </TableCell>
      
      <TableCell className="px-4 py-3 text-start text-theme-sm">
        <span 
          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium
          ${empleado.activo 
            ? "bg-success-50 text-success-500 dark:bg-success-500/20" 
            : "bg-error-50 text-error-500 dark:bg-error-500/20"}`}
        >
          {empleado.activo ? "Activo" : "Inactivo"}
        </span>
      </TableCell>
      
      <TableCell className="px-4 py-3 text-gray-500 text-end text-theme-sm dark:text-gray-400">
        <div className="flex space-x-2 justify-end">
          <EditarEmpleado empleado={empleado} onSave={onChange} />
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
                ¿Está seguro que desea eliminar al empleado <strong>{`${empleado.nombres} ${empleado.apellidos}`}</strong>?
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

export default EmpleadoListItem;
