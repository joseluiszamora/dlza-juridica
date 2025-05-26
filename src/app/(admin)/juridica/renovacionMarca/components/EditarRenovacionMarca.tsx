'use client';

import { useState, useEffect } from "react";
import { PencilIcon } from "@/icons";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import RenovacionMarca from "@/data/RenovacionMarca";

interface Props {
  renovacion: RenovacionMarca;
  onSave: () => void;
}

interface FormData {
  numeroDeRenovacion: string;
  numeroDeSolicitud: string;
  fechaParaRenovacion: string;
  titular: string;
  apoderado: string;
  estadoRenovacion: string;
  observaciones: string;
}

interface FormErrors {
  numeroDeRenovacion?: string;
  numeroDeSolicitud?: string;
  fechaParaRenovacion?: string;
  titular?: string;
  apoderado?: string;
  estadoRenovacion?: string;
  observaciones?: string;
}

const EditarRenovacionMarca: React.FC<Props> = ({ renovacion, onSave }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    numeroDeRenovacion: "",
    numeroDeSolicitud: "",
    fechaParaRenovacion: "",
    titular: "",
    apoderado: "",
    estadoRenovacion: "",
    observaciones: ""
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const estadoOptions = [
    { value: "", label: "Seleccionar estado" },
    { value: "EN_TRAMITE", label: "En trámite" },
    { value: "APROBADA", label: "Aprobada" },
    { value: "RECHAZADA", label: "Rechazada" },
    { value: "PENDIENTE", label: "Pendiente" },
    { value: "VENCIDA", label: "Vencida" }
  ];

  // Formatear fecha para input date
  const formatDateForInput = (dateString: string | null): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (renovacion) {
      setFormData({
        numeroDeRenovacion: renovacion.numeroDeRenovacion || "",
        numeroDeSolicitud: renovacion.numeroDeSolicitud || "",
        fechaParaRenovacion: formatDateForInput(renovacion.fechaParaRenovacion?.toString() || ""),
        titular: renovacion.titular || "",
        apoderado: renovacion.apoderado || "",
        estadoRenovacion: renovacion.estadoRenovacion || "",
        observaciones: ""
      });
    }
  }, [renovacion, isOpen]);

  const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.numeroDeRenovacion.trim()) {
      newErrors.numeroDeRenovacion = "El número de renovación es requerido";
    }

    if (!formData.numeroDeSolicitud.trim()) {
      newErrors.numeroDeSolicitud = "El número de solicitud es requerido";
    }

    if (!formData.fechaParaRenovacion) {
      newErrors.fechaParaRenovacion = "La fecha para renovación es requerida";
    }

    if (!formData.titular.trim()) {
      newErrors.titular = "El titular es requerido";
    }

    if (!formData.estadoRenovacion) {
      newErrors.estadoRenovacion = "El estado de renovación es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/renovacionMarca/${renovacion.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la renovación de marca');
      }

      setIsOpen(false);
      onSave();
    } catch (error) {
      console.error('Error:', error);
      // El error se manejará mediante el toast en el componente padre
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Restaurar datos originales
    if (renovacion) {
      setFormData({
        numeroDeRenovacion: renovacion.numeroDeRenovacion || "",
        numeroDeSolicitud: renovacion.numeroDeSolicitud || "",
        fechaParaRenovacion: formatDateForInput(renovacion.fechaParaRenovacion?.toString() || ""),
        titular: renovacion.titular || "",
        apoderado: renovacion.apoderado || "",
        estadoRenovacion: renovacion.estadoRenovacion || "",
        observaciones: ""
      });
    }
    setErrors({});
    setIsOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        size="sm" 
        variant="primary" 
        startIcon={<PencilIcon />} 
      >
        Editar
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} className="max-w-2xl p-6">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Editar Renovación de Marca
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Número de Renovación *
                </label>
                <input
                  type="text"
                  value={formData.numeroDeRenovacion}
                  onChange={handleInputChange('numeroDeRenovacion')}
                  placeholder="Ingrese el número de renovación"
                  className={`h-11 w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
                    errors.numeroDeRenovacion 
                      ? 'text-error-800 border-error-500 focus:ring-3 focus:ring-error-500/10 dark:text-error-400 dark:border-error-500' 
                      : 'bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800'
                  }`}
                />
                {errors.numeroDeRenovacion && (
                  <p className="mt-1.5 text-xs text-error-500">
                    {errors.numeroDeRenovacion}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Número de Solicitud *
                </label>
                <input
                  type="text"
                  value={formData.numeroDeSolicitud}
                  onChange={handleInputChange('numeroDeSolicitud')}
                  placeholder="Ingrese el número de solicitud"
                  className={`h-11 w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
                    errors.numeroDeSolicitud 
                      ? 'text-error-800 border-error-500 focus:ring-3 focus:ring-error-500/10 dark:text-error-400 dark:border-error-500' 
                      : 'bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800'
                  }`}
                />
                {errors.numeroDeSolicitud && (
                  <p className="mt-1.5 text-xs text-error-500">
                    {errors.numeroDeSolicitud}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Fecha para Renovación *
                </label>
                <input
                  type="date"
                  value={formData.fechaParaRenovacion}
                  onChange={handleInputChange('fechaParaRenovacion')}
                  className={`h-11 w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
                    errors.fechaParaRenovacion 
                      ? 'text-error-800 border-error-500 focus:ring-3 focus:ring-error-500/10 dark:text-error-400 dark:border-error-500' 
                      : 'bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800'
                  }`}
                />
                {errors.fechaParaRenovacion && (
                  <p className="mt-1.5 text-xs text-error-500">
                    {errors.fechaParaRenovacion}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Titular *
                </label>
                <input
                  type="text"
                  value={formData.titular}
                  onChange={handleInputChange('titular')}
                  placeholder="Ingrese el titular"
                  className={`h-11 w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
                    errors.titular 
                      ? 'text-error-800 border-error-500 focus:ring-3 focus:ring-error-500/10 dark:text-error-400 dark:border-error-500' 
                      : 'bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800'
                  }`}
                />
                {errors.titular && (
                  <p className="mt-1.5 text-xs text-error-500">
                    {errors.titular}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Apoderado
                </label>
                <input
                  type="text"
                  value={formData.apoderado}
                  onChange={handleInputChange('apoderado')}
                  placeholder="Ingrese el apoderado"
                  className="h-11 w-full rounded-lg border bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800 px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden dark:placeholder:text-white/30"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Estado de Renovación *
                </label>
                <select
                  value={formData.estadoRenovacion}
                  onChange={handleInputChange('estadoRenovacion')}
                  className={`h-11 w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800 ${
                    errors.estadoRenovacion 
                      ? 'text-error-800 border-error-500 focus:ring-3 focus:ring-error-500/10 dark:text-error-400 dark:border-error-500' 
                      : 'bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800'
                  }`}
                >
                  {estadoOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.estadoRenovacion && (
                  <p className="mt-1.5 text-xs text-error-500">
                    {errors.estadoRenovacion}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Observaciones
                </label>
                <textarea
                  value={formData.observaciones}
                  onChange={handleInputChange('observaciones')}
                  placeholder="Ingrese observaciones adicionales"
                  rows={3}
                  className="min-h-[80px] w-full resize-none rounded-lg border bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800 px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden dark:placeholder:text-white/30"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                disabled={loading}
              >
                {loading ? "Actualizando..." : "Actualizar"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default EditarRenovacionMarca;