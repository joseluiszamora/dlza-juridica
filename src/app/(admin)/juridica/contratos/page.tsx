"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
} from "@/components/ui/table";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import NuevoContrato from "./components/NuevoContrato";
import ContratosTableHeader from "./components/TableHeader";
import Contrato from "@/data/Contrato";
import ContratoListItem from "./components/TableItem";

export default function Contratos() {
  const [loading, setLoading] = useState(false);
  const [contratos, setContratos] = useState([] as Array<Contrato>);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    setLoading(true);
    fetch("/api/contratos")
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        setContratos(data);
        console.log(data);
      });
  };

  const files = contratos.map((contratoel: Contrato) => (
    <ContratoListItem contrato={contratoel} key={contratoel.id} />
  ));
  
  return(
  <div>
    <PageBreadcrumb pageTitle="Contratos" />

    {/* Form Nuevo Contrato */}
    <NuevoContrato onSave={getData      } />

    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          
            {!loading && 
            <Table>
              {/* Table Header */}
              <ContratosTableHeader />
              
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