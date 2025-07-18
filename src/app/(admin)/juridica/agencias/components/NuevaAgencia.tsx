import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/Select";
import Agente from "@/data/Agente";
import Ciudad from "@/data/Ciudad";

interface NuevaAgenciaProps {
  isOpen: boolean;
  onClose: () => void;
  onAgenciaCreated: () => void;
}

interface FormData {
  nombre: string;
  inicioContratoVigente: string;
  finContratoVigente: string;
  direccion: string;
  codigoContratoVigente: string;
  nitAgencia: string;
  contratoAlquiler: string;
  observaciones: string;
  agenteId: number;
  ciudadId: number;
}

export default function NuevaAgencia({ isOpen, onClose, onAgenciaCreated }: NuevaAgenciaProps) {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    inicioContratoVigente: "",
    finContratoVigente: "",
    direccion: "",
    codigoContratoVigente: "",
    nitAgencia: "",
    contratoAlquiler: "",
    observaciones: "",
    agenteId: 1,
    ciudadId: 1,
  });

  const [agentes, setAgentes] = useState<Agente[]>([]);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Cargar agentes y ciudades cuando se abre el modal
      Promise.all([
        fetch('/api/agentes').then(res => res.json()),
        fetch('/api/ciudades').then(res => res.json())
      ]).then(([agentesData, ciudadesData]) => {
        setAgentes(agentesData.data || []);
        setCiudades(ciudadesData.data || []);
      }).catch(error => {
        console.error('Error cargando datos:', error);
      });
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev: FormData) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTextAreaChange = (name: string) => (value: string) => {
    setFormData((prev: FormData) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/agencias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onAgenciaCreated();
        onClose();
        setFormData({
          nombre: "",
          inicioContratoVigente: "",
          finContratoVigente: "",
          direccion: "",
          codigoContratoVigente: "",
          nitAgencia: "",
          contratoAlquiler: "",
          observaciones: "",
          agenteId: 1,
          ciudadId: 1,
        });
      } else {
        console.error('Error creating agencia');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl p-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          Nueva Agencia
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombre">Nombre de la Agencia</Label>
              <Input
                id="nombre"
                name="nombre"
                defaultValue={formData.nombre || ""}
                onChange={handleInputChange}
                placeholder="Nombre de la agencia"
              />
            </div>
            <div>
              <Label htmlFor="agenteId">Agente</Label>
              <Select
                defaultValue={formData.agenteId.toString()}
                onChange={(value) => setFormData(prev => ({ ...prev, agenteId: parseInt(value) }))}
                options={agentes.map(agente => ({
                  value: agente.id.toString(),
                  label: `${agente.nombres} ${agente.apellidos}`
                }))}
                placeholder="Seleccionar agente"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="codigoContratoVigente">Código de Contrato</Label>
              <Input
                id="codigoContratoVigente"
                name="codigoContratoVigente"
                defaultValue={formData.codigoContratoVigente || ""}
                onChange={handleInputChange}
                placeholder="Código del contrato"
              />
            </div>
            <div>
              <Label htmlFor="nitAgencia">NIT (opcional)</Label>
              <Input
                id="nitAgencia"
                name="nitAgencia"
                defaultValue={formData.nitAgencia || ""}
                onChange={handleInputChange}
                placeholder="NIT de la agencia"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                name="direccion"
                defaultValue={formData.direccion || ""}
                onChange={handleInputChange}
                placeholder="Dirección de la agencia"
              />
            </div>
            <div>
              <Label htmlFor="ciudadId">Ciudad</Label>
              <Select
                defaultValue={formData.ciudadId.toString()}
                onChange={(value) => setFormData(prev => ({ ...prev, ciudadId: parseInt(value) }))}
                options={ciudades.map(ciudad => ({
                  value: ciudad.id.toString(),
                  label: ciudad.nombre || "Ciudad sin nombre"
                }))}
                placeholder="Seleccionar ciudad"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="inicioContratoVigente">Inicio Contrato Vigente</Label>
              <Input
                id="inicioContratoVigente"
                name="inicioContratoVigente"
                type="date"
                defaultValue={formData.inicioContratoVigente || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="finContratoVigente">Fin Contrato Vigente</Label>
              <Input
                id="finContratoVigente"
                name="finContratoVigente"
                type="date"
                defaultValue={formData.finContratoVigente || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="contratoAlquiler">Contrato de Alquiler (opcional)</Label>
            <Input
              id="contratoAlquiler"
              name="contratoAlquiler"
              defaultValue={formData.contratoAlquiler || ""}
              onChange={handleInputChange}
              placeholder="Contrato de alquiler"
            />
          </div>

          <div>
            <Label htmlFor="observaciones">Observaciones (opcional)</Label>
            <TextArea
              value={formData.observaciones || ""}
              onChange={handleTextAreaChange("observaciones")}
              rows={3}
              placeholder="Ingrese observaciones adicionales..."
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button disabled={isLoading}>
              {isLoading ? "Creando..." : "Crear Agencia"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}