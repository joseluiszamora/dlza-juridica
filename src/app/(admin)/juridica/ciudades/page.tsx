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
import NuevaCiudad from "./components/NuevaCiudad";
import { useToast } from "@/hooks/useToast";
import { Toaster } from "@/components/ui/toaster/Toaster";

export default function Ciudades() {
  const [loading, setLoading] = useState(false);
  const [ciudades, setCiudades] = useState([] as Array<Ciudad>);
  const [allCiudades, setAllCiudades] = useState([] as Array<Ciudad>);
  const [searchTerm, setSearchTerm] = useState("");
  const { addToast } = useToast();

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    // Filtrar ciudades cuando cambia el término de búsqueda
    if (searchTerm.trim() === "") {
      setCiudades(allCiudades);
    } else {
      const filteredCiudades = allCiudades.filter(ciudad => 
        ciudad.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ciudad.pais?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setCiudades(filteredCiudades);
    }
  }, [searchTerm, allCiudades]);

  const getData = () => {
    setLoading(true);
    fetch("/api/ciudades")
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        setCiudades(data.data);
        setAllCiudades(data.data);
        console.log(data);
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
        addToast({
          title: "Error",
          description: "No se pudieron cargar las ciudades",
          variant: "destructive"
        });
      });
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleSaveSuccess = (isNew = false) => {
    getData();
    addToast({
      title: "Operación exitosa",
      description: isNew 
        ? "La ciudad ha sido creada correctamente" 
        : "La ciudad ha sido actualizada correctamente",
      variant: "success"
    });
  };

  // const handleDeleteSuccess = () => {
  //   getData();
  //   addToast({
  //     title: "Ciudad eliminada",
  //     description: "La ciudad ha sido eliminada correctamente",
  //     variant: "success"
  //   });
  // };

  const files = ciudades.map((element: Ciudad) => (
    <CiudadListItem 
      ciudad={element} 
      key={element.id} 
      onChange={() => handleSaveSuccess(false)}
    />
  ));

  return(
  <div>
    <PageBreadcrumb pageTitle="Ciudades" />

    {/* Form Nuevo Contrato && search Contrato */}
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 xl:p-5 dark:bg-white/[0.03] mb-5">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <BuscarCiudad onSearch={handleSearch} />
        <NuevaCiudad onSave={() => handleSaveSuccess(true)} />
      {/* <NuevoContrato onSave={getData} />
      <AgregarDocumento /> */}
      </div>
      
    </div>

    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          
            {!loading && ciudades.length > 0 && 
            <Table>
              {/* Table Header */}
              <CiudadTableHeader />
              
              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {files}
              </TableBody>
            </Table>
            }
            {!loading && ciudades.length === 0 && 
              <div className="flex items-center justify-center h-32">
                <p className="text-gray-500 dark:text-gray-400">No se encontraron ciudades</p>
              </div>
            }
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
  </div>);
}