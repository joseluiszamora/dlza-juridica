"use client";
import Ciudad from "@/data/Ciudad";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
} from "@/components/ui/table";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CiudadListItem from "./components/TableItem";
import CiudadTableHeader from "./components/TableHeader";
import BuscarCiudad from "./components/BuscarCiudad";

export default function Ciudades() {
const [loading, setLoading] = useState(false);
  const [ciudades, setCiudades] = useState([] as Array<Ciudad>);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    setLoading(true);
    fetch("/api/ciudades")
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        setCiudades(data.data);
        console.log(data);
      });
  };

  const files = ciudades.map((element: Ciudad) => (
    <CiudadListItem ciudad={element} key={element.id} />
  ));

  return(
  <div>
    <PageBreadcrumb pageTitle="Ciudades" />

    {/* Form Nuevo Contrato && search Contrato */}
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 xl:p-5 dark:bg-white/[0.03] mb-5">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <BuscarCiudad />
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
              <CiudadTableHeader />
              
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