"use client";
import Marca from "@/data/Marca";
import React, { useEffect, useState } from "react";
import { Table, TableBody } from "@/components/ui/table";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import MarcaListItem from "./components/TableItem";
import MarcaTableHeader from "./components/TableHeader";
import BuscarMarca from "./components/BuscarMarca";
import NuevaMarca from "./components/NuevaMarca";
import { useToast } from "@/hooks/useToast";
import { Toaster } from "@/components/ui/toaster/Toaster";

export default function Marcas() {
  const [loading, setLoading] = useState(false);
  const [marcas, setMarcas] = useState([] as Array<Marca>);
  const [allMarcas, setAllMarcas] = useState([] as Array<Marca>);
  const [searchTerm, setSearchTerm] = useState("");
  const { addToast } = useToast();

  useEffect(() => {
    const getData = () => {
      setLoading(true);
      fetch("/api/marcas")
        .then((response) => response.json())
        .then((data) => {
          setLoading(false);
          setMarcas(data.data);
          setAllMarcas(data.data);
        })
        .catch(error => {
          setLoading(false);
          console.log(error);
          addToast({
            title: "Error",
            description: "No se pudieron cargar las marcas",
            variant: "destructive"
          });
        });
    };
    
    getData();
  }, [addToast]);

  useEffect(() => {
    // Filtrar marcas cuando cambia el término de búsqueda
    if (searchTerm.trim() === "") {
      setMarcas(allMarcas);
    } else {
      const filteredMarcas = allMarcas.filter(marca => 
        marca.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        marca.numeroRegistro?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        marca.titular?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        marca.apoderado?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        marca.estado?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setMarcas(filteredMarcas);
    }
  }, [searchTerm, allMarcas]);

  const refreshData = () => {
    setLoading(true);
    fetch("/api/marcas")
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        setMarcas(data.data);
        setAllMarcas(data.data);
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
        addToast({
          title: "Error",
          description: "No se pudieron cargar las marcas",
          variant: "destructive"
        });
      });
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleDeleteSuccess = () => {
    refreshData();
    addToast({
      title: "Marca eliminada",
      description: "La marca ha sido eliminada correctamente",
      variant: "success"
    });
  };

  const handleSaveSuccess = (isNew = false) => {
    refreshData();
    addToast({
      title: "Operación exitosa",
      description: isNew 
        ? "La marca ha sido creada correctamente" 
        : "La marca ha sido actualizada correctamente",
      variant: "success"
    });
  };

  return (
    <>
      <Toaster />
      <PageBreadcrumb
        pageTitle="Marcas"
        // items={[
        //   { title: "Dashboard", link: "/" },
        //   { title: "Jurídica", link: "/juridica" },
        // ]}
      />
      
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 xl:p-5 dark:bg-white/[0.03] mb-5">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="flex items-center">
            <BuscarMarca onSearch={handleSearch} />
          </div>
          <div className="flex justify-end">
            <NuevaMarca onSave={() => handleSaveSuccess(true)} />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            {!loading && marcas.length > 0 && (
              <Table>
                <MarcaTableHeader />
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {marcas.map((marca: Marca) => (
                    <MarcaListItem 
                      marca={marca} 
                      key={marca.id} 
                      onDelete={handleDeleteSuccess}
                      onChange={handleSaveSuccess}
                    />
                  ))}
                </TableBody>
              </Table>
            )}
            {!loading && marcas.length === 0 && (
              <div className="flex items-center justify-center h-32">
                <p className="text-gray-500 dark:text-gray-400">No se encontraron marcas</p>
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
