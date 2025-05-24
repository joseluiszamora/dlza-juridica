"use client";
import ContratoAgencia from "@/data/ContratoAgencia";
import React, { useEffect, useState } from "react";
import { Table, TableBody } from "@/components/ui/table";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ContratoAgenciaListItem from "./components/TableItem";
import ContratoAgenciaTableHeader from "./components/TableHeader";
import BuscarContratoAgencia from "./components/BuscarContratoAgencia";
import NuevoContratoAgencia from "./components/NuevoContratoAgencia";
import { useToast } from "@/hooks/useToast";

export default function ContratosAgencia() {
  const [loading, setLoading] = useState(false);
  const [contratos, setContratos] = useState([] as Array<ContratoAgencia>);
  const [allContratos, setAllContratos] = useState([] as Array<ContratoAgencia>);
  const [searchTerm, setSearchTerm] = useState("");
  const { addToast } = useToast();

  const [selectedAgenciaId, setSelectedAgenciaId] = useState<number | null>(null);
  const [selectedAgenciaNombre, setSelectedAgenciaNombre] = useState<string>("");

  useEffect(() => {
    // Verificar si hay un ID de agencia en los parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    const agenciaId = params.get("agenciaId");
    
    if (agenciaId) {
      setSelectedAgenciaId(parseInt(agenciaId));
      // Cargar datos filtrados por agencia
      getData(parseInt(agenciaId));
    } else {
      // Cargar todos los contratos
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Filtrar contratos cuando cambia el término de búsqueda
    if (searchTerm.trim() === "") {
      setContratos(allContratos);
    } else {
      const filteredContratos = allContratos.filter(contrato => 
        contrato.codigoContrato.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contrato.agencia?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contrato.estado?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setContratos(filteredContratos);
    }
  }, [searchTerm, allContratos]);

  const getData = (agenciaId?: number) => {
    setLoading(true);
    // Construir la URL según si hay filtro por agencia
    const url = agenciaId ? `/api/contratosAgencia?agenciaId=${agenciaId}` : "/api/contratosAgencia";
    
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        setContratos(data.data);
        setAllContratos(data.data);
        
        // Si hay contratos y estamos filtrando por agencia, obtener el nombre de la agencia
        if (data.data.length > 0 && agenciaId) {
          setSelectedAgenciaNombre(data.data[0].agencia?.nombre || "Agencia");
        }
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
        addToast({
          title: "Error",
          description: "No se pudieron cargar los contratos de agencias",
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
      title: "Contrato eliminado",
      description: "El contrato ha sido eliminado correctamente",
      variant: "success"
    });
  };

  const handleSaveSuccess = (isNew = false) => {
    getData();
    addToast({
      title: "Operación exitosa",
      description: isNew 
        ? "El contrato ha sido creado correctamente" 
        : "El contrato ha sido actualizado correctamente",
      variant: "success"
    });
  };

  const handleVolver = () => {
    // Redireccionar a la página de agencias
    window.location.href = "/juridica/agencias";
  };

  return (
    <>
    <div>
      <PageBreadcrumb pageTitle={selectedAgenciaNombre ? `Contratos de Agencia: ${selectedAgenciaNombre}` : "Contratos de Agencias"} />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 xl:p-5 dark:bg-white/[0.03] mb-5">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="flex items-center">
            <BuscarContratoAgencia onSearch={handleSearch} />
            {selectedAgenciaId && (
              <button 
                onClick={handleVolver} 
                className="ml-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 text-sm"
              >
                ← Volver a Agencias
              </button>
            )}
          </div>
          <div className="flex justify-end">
            <NuevoContratoAgencia 
              onSave={() => handleSaveSuccess(true)} 
              agenciaPreseleccionada={selectedAgenciaId}
            />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            {!loading && contratos.length > 0 && (
              <Table>
                <ContratoAgenciaTableHeader />
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {contratos.map((contrato: ContratoAgencia) => (
                    <ContratoAgenciaListItem 
                      contrato={contrato} 
                      key={contrato.id} 
                      onDelete={handleDeleteSuccess}
                      onChange={handleSaveSuccess}
                    />
                  ))}
                </TableBody>
              </Table>
            )}
            {!loading && contratos.length === 0 && (
              <div className="flex items-center justify-center h-32">
                <p className="text-gray-500 dark:text-gray-400">No se encontraron contratos de agencias</p>
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
