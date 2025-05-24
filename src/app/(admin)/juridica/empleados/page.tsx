"use client";
import React, { useEffect, useState } from "react";
import { Table, TableBody } from "@/components/ui/table";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EmpleadoListItem from "./components/TableItem";
import EmpleadoTableHeader from "./components/TableHeader";
import BuscarEmpleado from "./components/BuscarEmpleado";
import NuevoEmpleado from "./components/NuevoEmpleado";
import { useToast } from "@/hooks/useToast";

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

export default function Empleados() {
  const [loading, setLoading] = useState(false);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [allEmpleados, setAllEmpleados] = useState<Empleado[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { addToast } = useToast();

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Filtrar empleados cuando cambia el término de búsqueda
    if (searchTerm.trim() === "") {
      setEmpleados(allEmpleados);
    } else {
      const filteredEmpleados = allEmpleados.filter(empleado => 
        `${empleado.nombres} ${empleado.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        empleado.documento.toLowerCase().includes(searchTerm.toLowerCase()) ||
        empleado.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        empleado.area.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setEmpleados(filteredEmpleados);
    }
  }, [searchTerm, allEmpleados]);

  const getData = () => {
    setLoading(true);
    fetch("/api/empleados")
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        setEmpleados(data.data);
        setAllEmpleados(data.data);
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
        addToast({
          title: "Error",
          description: "No se pudieron cargar los empleados",
          variant: "destructive"
        });
      });
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleDeleteSuccess = () => {
    getData();
    addToast({
      title: "Empleado eliminado",
      description: "El empleado ha sido eliminado correctamente",
      variant: "success"
    });
  };

  const handleSaveSuccess = (isNew = false) => {
    getData();
    addToast({
      title: "Operación exitosa",
      description: isNew 
        ? "El empleado ha sido creado correctamente" 
        : "El empleado ha sido actualizado correctamente",
      variant: "success"
    });
  };

  return (
    <>
    <div>
      <PageBreadcrumb pageTitle="Gestión de Empleados" />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 xl:p-5 dark:bg-white/[0.03] mb-5">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <BuscarEmpleado onSearch={handleSearch} />
          <div className="flex justify-end">
            <NuevoEmpleado onSave={() => handleSaveSuccess(true)} />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1200px]">
            {!loading && empleados.length > 0 && (
              <Table>
                <EmpleadoTableHeader />
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {empleados.map((empleado: Empleado) => (
                    <EmpleadoListItem 
                      empleado={empleado} 
                      key={empleado.id} 
                      onDelete={handleDeleteSuccess}
                      onChange={handleSaveSuccess}
                    />
                  ))}
                </TableBody>
              </Table>
            )}
            {!loading && empleados.length === 0 && (
              <div className="flex items-center justify-center h-32">
                <p className="text-gray-500 dark:text-gray-400">No se encontraron empleados</p>
              </div>
            )}
            {loading && (
              <div className="flex items-center justify-center h-32">
                <div className="w-8 h-8 border-t-2 border-b-2 border-brand-500 rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>    
  );
}
