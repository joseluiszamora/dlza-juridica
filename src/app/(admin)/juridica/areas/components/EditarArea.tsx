import { useModal } from "@/hooks/useModal";
import { PencilIcon } from '@/icons';
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { FormEvent, useState } from "react";
import { SpinnerLoader } from "@/components/ui/loader/loaders";

interface Area {
  id: number;
  nombre: string;
  departamento: string | null;
  createdAt: Date;
}

interface Props {
  area: Area;
  onSave: () => void;
}

const EditarArea: React.FC<Props> = ({ area, onSave }) => {
  const { isOpen, openModal, closeModal } = useModal();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: area.id,
    nombre: area.nombre,
    departamento: area.departamento || ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/areas`, {
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
        console.error("Error al actualizar el área");
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
        variant="primary" 
        startIcon={<PencilIcon />} 
        onClick={openModal}
      >
        Editar
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[500px] p-6"
      >
        <div>
          <h2 className="mb-5 text-xl font-semibold text-gray-800 dark:text-white">
            Editar Área
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="nombre" className="mb-2.5 block font-medium text-gray-700 dark:text-gray-200">
                Nombre *
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="departamento" className="mb-2.5 block font-medium text-gray-700 dark:text-gray-200">
                Departamento
              </label>
              <input
                type="text"
                id="departamento"
                name="departamento"
                value={formData.departamento}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
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

export default EditarArea;
