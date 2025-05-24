"use client";
import React, { useEffect, useState } from "react";
import { Table, TableBody } from "@/components/ui/table";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AreaListItem from "./components/TableItem";
import AreaTableHeader from "./components/TableHeader";
import BuscarArea from "./components/BuscarArea";
import NuevaArea from "./components/NuevaArea";
import { useToast } from "@/hooks/useToast";

interface Area {
  id: number;
  nombre: string;
  departamento: string | null;
  createdAt: Date;
}

export default function Areas() {
  const [loading, setLoading] = useState(false);
  const [areas, setAreas] = useState<Area[]>([]);
  const [allAreas, setAllAreas] = useState<Area[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { addToast } = useToast();

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Filtrar áreas cuando cambia el término de búsqueda
    if (searchTerm.trim() === "") {
      setAreas(allAreas);
    } else {
      const filteredAreas = allAreas.filter(area => 
        area.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (area.departamento && area.departamento.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setAreas(filteredAreas);
    }
  }, [searchTerm, allAreas]);

  const getData = () => {
    setLoading(true);
    fetch("/api/areas")
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        setAreas(data.data);
        setAllAreas(data.data);
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
        addToast({
          title: "Error",
          description: "No se pudieron cargar las áreas",
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
      title: "Área eliminada",
      description: "El área ha sido eliminada correctamente",
      variant: "success"
    });
  };

  const handleSaveSuccess = (isNew = false) => {
    getData();
    addToast({
      title: "Operación exitosa",
      description: isNew 
        ? "El área ha sido creada correctamente" 
        : "El área ha sido actualizada correctamente",
      variant: "success"
    });
  };

  return (
    <>
    <div>
      <PageBreadcrumb pageTitle="Gestión de Áreas" />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 xl:p-5 dark:bg-white/[0.03] mb-5">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <BuscarArea onSearch={handleSearch} />
          <div className="flex justify-end">
            <NuevaArea onSave={() => handleSaveSuccess(true)} />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[600px]">
            {!loading && areas.length > 0 && (
              <Table>
                <AreaTableHeader />
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {areas.map((area: Area) => (
                    <AreaListItem 
                      area={area} 
                      key={area.id} 
                      onDelete={handleDeleteSuccess}
                      onChange={handleSaveSuccess}
                    />
                  ))}
                </TableBody>
              </Table>
            )}
            {!loading && areas.length === 0 && (
              <div className="flex items-center justify-center h-32">
                <p className="text-gray-500 dark:text-gray-400">No se encontraron áreas</p>
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
