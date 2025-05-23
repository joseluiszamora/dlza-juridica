"use client";
import Agencia from "@/data/Agencia";
import React, { useEffect, useState } from "react";
import { Table, TableBody } from "@/components/ui/table";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AgenciaListItem from "./components/TableItem";
import AgenciaTableHeader from "./components/TableHeader";
import BuscarAgencia from "./components/BuscarAgencia";
import NuevaAgencia from "./components/NuevaAgencia";
import { useToast } from "@/hooks/useToast";
import { Toaster } from "@/components/ui/toaster/Toaster";

export default function Agencias() {
  const [loading, setLoading] = useState(false);
  const [agencias, setAgencias] = useState([] as Array<Agencia>);
  const [allAgencias, setAllAgencias] = useState([] as Array<Agencia>);
  const [searchTerm, setSearchTerm] = useState("");
  const { addToast } = useToast();

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    // Filtrar agencias cuando cambia el término de búsqueda
    if (searchTerm.trim() === "") {
      setAgencias(allAgencias);
    } else {
      const filteredAgencias = allAgencias.filter(agencia => 
        agencia.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agencia.agente?.nombres?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agencia.agente?.apellidos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agencia.ciudad?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setAgencias(filteredAgencias);
    }
  }, [searchTerm, allAgencias]);

  const getData = () => {
    setLoading(true);
    fetch("/api/agencias")
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        setAgencias(data.data);
        setAllAgencias(data.data);
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
        addToast({
          title: "Error",
          description: "No se pudieron cargar las agencias",
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
      title: "Agencia eliminada",
      description: "La agencia ha sido eliminada correctamente",
      variant: "success"
    });
  };

  const handleSaveSuccess = (isNew = false) => {
    getData();
    addToast({
      title: "Operación exitosa",
      description: isNew 
        ? "La agencia ha sido creada correctamente" 
        : "La agencia ha sido actualizada correctamente",
      variant: "success"
    });
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Agencias" />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 xl:p-5 dark:bg-white/[0.03] mb-5">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <BuscarAgencia onSearch={handleSearch} />
          <div className="flex justify-end">
            <NuevaAgencia onSave={() => handleSaveSuccess(true)} />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            {!loading && agencias.length > 0 && (
              <Table>
                <AgenciaTableHeader />
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {agencias.map((agencia: Agencia) => (
                    <AgenciaListItem 
                      agencia={agencia} 
                      key={agencia.id} 
                      onDelete={handleDeleteSuccess}
                      onChange={handleSaveSuccess}
                    />
                  ))}
                </TableBody>
              </Table>
            )}
            {!loading && agencias.length === 0 && (
              <div className="flex items-center justify-center h-32">
                <p className="text-gray-500 dark:text-gray-400">No se encontraron agencias</p>
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
      <div className="fixed z-50 bottom-0 right-0">
        <Toaster />
      </div>
    </div>
  );
}