"use client";
import ContratoAgencia from "@/data/ContratoAgencia";
import React, { useEffect, useState } from "react";
import { Table, TableBody } from "@/components/ui/table";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ContratoAgenciaListItem from "./components/TableItem";
import ContratoAgenciaTableHeader from "./components/TableHeader";
import BuscarContratoAgencia from "./components/BuscarContratoAgencia";
import NuevoContratoAgencia from "./components/NuevoContratoAgencia";

export default function ContratosAgencia() {
  const [loading, setLoading] = useState(false);
  const [contratos, setContratos] = useState([] as Array<ContratoAgencia>);
  const [allContratos, setAllContratos] = useState([] as Array<ContratoAgencia>);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getData();
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

  const getData = () => {
    setLoading(true);
    fetch("/api/contratosAgencia")
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        setContratos(data.data);
        setAllContratos(data.data);
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
      });
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleDeleteSuccess = () => {
    getData();
  };

  const handleSaveSuccess = () => {
    getData();
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Contratos de Agencias" />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 xl:p-5 dark:bg-white/[0.03] mb-5">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <BuscarContratoAgencia onSearch={handleSearch} />
          <div className="flex justify-end">
            <NuevoContratoAgencia onSave={handleSaveSuccess} />
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
  );
}
