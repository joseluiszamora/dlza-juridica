"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
} from "@/components/ui/table";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
// import NuevoContrato from "./components/NuevoContrato";
// import ContratosTableHeader from "./components/TableHeader";
import AgenciaListItem from "./components/TableItem";
import Agencia from "@/data/Agencia";
import AgenciasTableHeader from "./components/TableHeader";
// import ContratoListItem from "./components/TableItem";
// import BuscarContrato from "./components/BuscarContrato";
// import AgregarDocumento from "./components/AgregarDocumento";

export default function Contratos() {
  const [loading, setLoading] = useState(false);
  // const [title, setTitle] = useState("");
  // const [page, setPage] = useState(1);
  const [agencias, setAgencias] = useState([] as Array<Agencia>);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    setLoading(true);
    fetch("/api/agencias?page=1&title=''")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setLoading(false);
        setAgencias(data.data);
      });
  };

  const files = agencias.map((agenciael: Agencia) => (
    <AgenciaListItem agencia={agenciael} key={agenciael.id} />
  ));
  
  return(
  <div>
    <PageBreadcrumb pageTitle="Contratos" />

    {/* Form Nuevo Contrato && search Contrato */}
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 xl:p-5 dark:bg-white/[0.03] mb-5">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      {/* <NuevoContrato onSave={getData} />
      <BuscarContrato />
      <AgregarDocumento /> */}
      </div>
      
    </div>

    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          
            {!loading && 
            <Table>
              {/* Table Header */}
              <AgenciasTableHeader />
              
              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {files}
              </TableBody>
            </Table>
            }
            {loading && (
              <div className="flex items-center justify-center h-32">
                <div className="w-8 h-8 border-t-2 border-b-2 border-brand-500 rounded-full animate-spin"></div>
              </div>
            )}
          
        </div>
      </div>
    </div>
  </div>);
}