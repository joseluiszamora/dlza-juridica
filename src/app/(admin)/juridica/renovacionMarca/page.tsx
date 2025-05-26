"use client";
import RenovacionMarca from "@/data/RenovacionMarca";
import React, { useEffect, useState } from "react";
import { Table, TableBody } from "@/components/ui/table";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import RenovacionMarcaListItem from "./components/TableItem";
import RenovacionMarcaTableHeader from "./components/TableHeader";
import BuscarRenovacionMarca from "./components/BuscarRenovacionMarca";
import NuevaRenovacionMarca from "./components/NuevaRenovacionMarca";
import { useToast } from "@/hooks/useToast";
import { Toaster } from "@/components/ui/toaster/Toaster";

export default function RenovacionesMarca() {
  const [loading, setLoading] = useState(false);
  const [renovaciones, setRenovaciones] = useState([] as Array<RenovacionMarca>);
  const [allRenovaciones, setAllRenovaciones] = useState([] as Array<RenovacionMarca>);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMarcaId, setSelectedMarcaId] = useState<number | null>(null);
  const [selectedMarcaNombre, setSelectedMarcaNombre] = useState<string>("");
  const { addToast } = useToast();

  useEffect(() => {
    // Verificar si hay un ID de marca en los parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    const marcaId = params.get("marcaId");
    
    if (marcaId) {
      setSelectedMarcaId(parseInt(marcaId));
      // Cargar datos filtrados por marca
      getData(parseInt(marcaId));
    } else {
      // Cargar todas las renovaciones
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Filtrar renovaciones cuando cambia el término de búsqueda
    if (searchTerm.trim() === "") {
      setRenovaciones(allRenovaciones);
    } else {
      const filteredRenovaciones = allRenovaciones.filter(renovacion => 
        renovacion.numeroDeRenovacion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        renovacion.numeroDeSolicitud?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        renovacion.titular?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        renovacion.apoderado?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        renovacion.estadoRenovacion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        renovacion.marca?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setRenovaciones(filteredRenovaciones);
    }
  }, [searchTerm, allRenovaciones]);

  const getData = (marcaId?: number) => {
    setLoading(true);
    // Construir la URL según si hay filtro por marca
    const url = marcaId ? `/api/renovacionMarca?marcaId=${marcaId}` : "/api/renovacionMarca";
    
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        setRenovaciones(data.renovaciones || []);
        setAllRenovaciones(data.renovaciones || []);
        
        // Si hay renovaciones y estamos filtrando por marca, obtener el nombre de la marca
        if (data.renovaciones && data.renovaciones.length > 0 && marcaId) {
          setSelectedMarcaNombre(data.renovaciones[0].marca?.nombre || "Marca");
        }
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
        addToast({
          title: "Error",
          description: "No se pudieron cargar las renovaciones de marca",
          variant: "destructive"
        });
      });
  };

  const refreshData = () => {
    if (selectedMarcaId) {
      getData(selectedMarcaId);
    } else {
      getData();
    }
  };

  const handleSearch = (filters: {search: string; estado: string; marcaId?: string}) => {
    setSearchTerm(filters.search);
  };

  const handleDeleteSuccess = () => {
    refreshData();
    addToast({
      title: "Renovación eliminada",
      description: "La renovación de marca ha sido eliminada correctamente",
      variant: "success"
    });
  };

  const handleSaveSuccess = (isNew = false) => {
    refreshData();
    addToast({
      title: "Operación exitosa",
      description: isNew 
        ? "La renovación de marca ha sido creada correctamente" 
        : "La renovación de marca ha sido actualizada correctamente",
      variant: "success"
    });
  };

  const handleVolver = () => {
    window.location.href = "/juridica/marcas";
  };

  return (
    <>
      <Toaster />
      <PageBreadcrumb
        pageTitle={selectedMarcaId ? `Renovaciones de ${selectedMarcaNombre}` : "Renovaciones de Marca"}
      />
      
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 xl:p-5 dark:bg-white/[0.03] mb-5">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="flex items-center">
            <BuscarRenovacionMarca 
              onSearch={handleSearch}
              marcaId={selectedMarcaId?.toString()}
              marcaNombre={selectedMarcaNombre}
            />
            {selectedMarcaId && (
              <button 
                onClick={handleVolver} 
                className="ml-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 text-sm"
              >
                ← Volver a Marcas
              </button>
            )}
          </div>
          <div className="flex justify-end">
            <NuevaRenovacionMarca 
              onSave={() => handleSaveSuccess(true)} 
              marcaId={selectedMarcaId?.toString()}
            />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            {!loading && renovaciones.length > 0 && (
              <Table>
                <RenovacionMarcaTableHeader />
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {renovaciones.map((renovacion: RenovacionMarca) => (
                    <RenovacionMarcaListItem 
                      renovacion={renovacion} 
                      key={renovacion.id} 
                      onDelete={handleDeleteSuccess}
                      onChange={handleSaveSuccess}
                    />
                  ))}
                </TableBody>
              </Table>
            )}
            {!loading && renovaciones.length === 0 && (
              <div className="flex items-center justify-center h-32">
                <p className="text-gray-500 dark:text-gray-400">No se encontraron renovaciones de marca</p>
              </div>
            )}
            {loading && (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
