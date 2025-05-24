import { useState, useEffect } from "react";
import { useModal } from "@/hooks/useModal";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import Agencia from "@/data/Agencia";
import ContratoAgencia from "@/data/ContratoAgencia";
import { FileIcon, PlusIcon, PencilIcon, TrashBinIcon } from "@/icons";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { SpinnerLoader } from "@/components/ui/loader/loaders";
import NuevoContratoAgenciaModal from "./NuevoContratoAgenciaModal";
import EditarContratoAgenciaModal from "./EditarContratoAgenciaModal";
import { useToast } from "@/hooks/useToast";

interface Props {
  agencia: Agencia;
}

const ContratosAgencia: React.FC<Props> = ({ agencia }) => {
  const { isOpen, openModal, closeModal } = useModal();
  const [contratos, setContratos] = useState<ContratoAgencia[]>([]);
  const [loading, setLoading] = useState(false);
  const [isNuevoModalOpen, setIsNuevoModalOpen] = useState(false);
  const [contratoSeleccionado, setContratoSeleccionado] = useState<ContratoAgencia | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [contratoToDelete, setContratoToDelete] = useState<number | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchContratos();
    }
  }, [isOpen, agencia.id]);

  const fetchContratos = async () => {
    setLoading(true);
    try {
      // Utilizar la API existente para buscar contratos filtrados por agenciaId
      const response = await fetch(`/api/contratosAgencia?agenciaId=${agencia.id}`);
      if (response.ok) {
        const data = await response.json();
        setContratos(data.data || []);
      } else {
        throw new Error("Error al obtener contratos");
      }
    } catch (error) {
      console.error("Error:", error);
      addToast({
        title: "Error",
        description: "No se pudieron cargar los contratos de la agencia",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNuevoContrato = () => {
    setIsNuevoModalOpen(true);
  };

  const handleEditarContrato = (contrato: ContratoAgencia) => {
    setContratoSeleccionado(contrato);
    setIsEditModalOpen(true);
  };

  const handleEliminarContrato = (id: number) => {
    setContratoToDelete(id);
  };

  const confirmarEliminarContrato = async () => {
    if (!contratoToDelete) return;
    
    setDeleteLoading(true);
    try {
      const response = await fetch(`/api/contratosAgencia?id=${contratoToDelete}`, {
        method: "DELETE"
      });
      
      if (response.ok) {
        addToast({
          title: "Éxito",
          description: "Contrato eliminado correctamente",
          variant: "success"
        });
        fetchContratos();
        setContratoToDelete(null);
      } else {
        throw new Error("Error al eliminar contrato");
      }
    } catch (error) {
      console.error("Error:", error);
      addToast({
        title: "Error",
        description: "No se pudo eliminar el contrato",
        variant: "destructive"
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSaveNuevo = () => {
    fetchContratos();
    setIsNuevoModalOpen(false);
    addToast({
      title: "Éxito",
      description: "Contrato creado correctamente",
      variant: "success"
    });
  };

  const handleSaveEdit = () => {
    fetchContratos();
    setIsEditModalOpen(false);
    setContratoSeleccionado(null);
    addToast({
      title: "Éxito",
      description: "Contrato actualizado correctamente",
      variant: "success"
    });
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return format(new Date(date), "dd/MM/yyyy", { locale: es });
  };

  return (
    <>
      <Button 
        size="sm" 
        variant="outline" 
        startIcon={<FileIcon />} 
        onClick={openModal}
      >
        Contratos
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[800px] p-6"
      >
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Contratos de {agencia.nombre}
            </h2>
            
            <Button 
              size="sm" 
              variant="primary" 
              startIcon={<PlusIcon />} 
              onClick={handleNuevoContrato}
            >
              Nuevo Contrato
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-10">
              <SpinnerLoader />
            </div>
          ) : contratos.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Esta agencia no tiene contratos registrados
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Código
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Periodo
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Garantía
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {contratos.map((contrato) => (
                    <tr key={contrato.id}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {contrato.codigoContrato || "Sin código"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm">
                          <div>
                            Inicio: {formatDate(contrato.contratoInicio)}
                          </div>
                          <div>
                            Fin: {formatDate(contrato.contratoFin)}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          contrato.estado === 'vigente' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : contrato.estado === 'vencido'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : contrato.estado === 'renovacion'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        }`}>
                          {contrato.estado || 'No definido'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {contrato.tipoGarantia ? (
                          <div className="text-sm">
                            <div>{contrato.tipoGarantia}</div>
                            {contrato.montoGarantia && <div className="text-xs">Bs. {contrato.montoGarantia.toFixed(2)}</div>}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500">Sin garantía</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <div className="flex space-x-2 justify-end">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            startIcon={<PencilIcon />} 
                            onClick={() => handleEditarContrato(contrato)}
                          >
                            Editar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="danger" 
                            startIcon={<TrashBinIcon />} 
                            onClick={() => handleEliminarContrato(contrato.id)}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-end mt-6">
            <Button 
              size="md" 
              variant="outline" 
              onClick={closeModal}
            >
              Cerrar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal para eliminar contrato */}
      <Modal
        isOpen={contratoToDelete !== null}
        onClose={() => setContratoToDelete(null)}
        className="max-w-[450px] p-6"
      >
        <div className="flex flex-col px-2">
          <div>
            <h5 className="mb-2 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
              Confirmar eliminación
            </h5>
            <p className="text-gray-600 dark:text-gray-300">
              ¿Está seguro que desea eliminar este contrato?
              Esta acción no se puede deshacer.
            </p>
          </div>

          <div className="flex items-center gap-3 mt-6 sm:justify-end">
            <button
              onClick={() => setContratoToDelete(null)}
              type="button"
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
            >
              Cancelar
            </button>
            
            {!deleteLoading && (
              <button
                onClick={confirmarEliminarContrato}
                type="button"
                className="flex w-full justify-center rounded-lg bg-error-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-error-600 sm:w-auto"
              >
                Eliminar
              </button>
            )}

            {deleteLoading && <SpinnerLoader />}
          </div>
        </div>
      </Modal>

      {/* Modal para nuevo contrato */}
      {isNuevoModalOpen && (
        <NuevoContratoAgenciaModal 
          isOpen={isNuevoModalOpen} 
          onClose={() => setIsNuevoModalOpen(false)}
          onSave={handleSaveNuevo}
          agenciaId={agencia.id}
        />
      )}

      {/* Modal para editar contrato */}
      {isEditModalOpen && contratoSeleccionado && (
        <EditarContratoAgenciaModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveEdit}
          contrato={contratoSeleccionado}
        />
      )}
    </>
  );
};

export default ContratosAgencia;
