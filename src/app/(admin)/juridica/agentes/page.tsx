"use client";
import Agente from "@/data/Agente";
import React, { useEffect, useState } from "react";
import { Table, TableBody } from "@/components/ui/table";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AgenteListItem from "./components/TableItem";
import AgenteTableHeader from "./components/TableHeader";
import BuscarAgente from "./components/BuscarAgente";
import NuevoAgente from "./components/NuevoAgente";

// import { useToast } from "@/hooks/useToast";
// import { Toaster } from "@/components/ui/toaster";

export default function Agentes() {
  const [loading, setLoading] = useState(false);
  const [agentes, setAgentes] = useState([] as Array<Agente>);
  const [allAgentes, setAllAgentes] = useState([] as Array<Agente>);
  const [searchTerm, setSearchTerm] = useState("");
  // const { toast } = useToast();

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    // Filtrar agentes cuando cambia el término de búsqueda
    if (searchTerm.trim() === "") {
      setAgentes(allAgentes);
    } else {
      const filteredAgentes = allAgentes.filter(agente => 
        agente.nombres?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agente.apellidos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agente.documento?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agente.celular?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setAgentes(filteredAgentes);
    }
  }, [searchTerm, allAgentes]);

  const getData = () => {
    setLoading(true);
    fetch("/api/agentes")
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        setAgentes(data.data);
        setAllAgentes(data.data);
      })
      .catch(error => {
        console.log(error)
        setLoading(false);
        // toast({
        //   title: "Error",
        //   description: "No se pudieron cargar los agentes",
        //   variant: "error"
        // });
      });
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleDeleteSuccess = () => {
    getData();
    // toast({
    //   title: "Agente eliminado",
    //   description: "El agente ha sido eliminado correctamente",
    //   variant: "success"
    // });
  };

  const handleSaveSuccess = () => {
    getData();
    // toast({
    //   title: "Operación exitosa",
    //   description: "Los datos han sido actualizados correctamente",
    //   variant: "success"
    // });
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Agentes" />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 xl:p-5 dark:bg-white/[0.03] mb-5">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <BuscarAgente onSearch={handleSearch} />
          <div className="flex justify-end">
            <NuevoAgente onSave={handleSaveSuccess} />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            {!loading && agentes.length > 0 && (
              <Table>
                <AgenteTableHeader />
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {agentes.map((agente: Agente) => (
                    <AgenteListItem 
                      agente={agente} 
                      key={agente.id} 
                      onDelete={handleDeleteSuccess}
                      onChange={handleSaveSuccess}
                    />
                  ))}
                </TableBody>
              </Table>
            )}
            {!loading && agentes.length === 0 && (
              <div className="flex items-center justify-center h-32">
                <p className="text-gray-500 dark:text-gray-400">No se encontraron agentes</p>
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
      {/* <Toaster /> */}
    </div>
  );
}
