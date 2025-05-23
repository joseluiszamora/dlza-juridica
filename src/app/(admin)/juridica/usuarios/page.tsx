"use client";
import Usuario from "@/data/Usuario";
import React, { useEffect, useState } from "react";
import { Table, TableBody } from "@/components/ui/table";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BuscarUsuario from "./components/BuscarUsuario";
import NuevoUsuario from "./components/NuevoUsuario";
import UsuarioTableHeader from "./components/TableHeader";
import UsuarioListItem from "./components/TableItem";
import { useToast } from "@/hooks/useToast";
import { Toaster } from "@/components/ui/toaster/Toaster";

export default function Usuarios() {
  const [loading, setLoading] = useState(false);
  const [usuarios, setUsuarios] = useState([] as Array<Usuario>);
  const [allUsuarios, setAllUsuarios] = useState([] as Array<Usuario>);
  const [searchTerm, setSearchTerm] = useState("");
  const { addToast } = useToast();

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    // Filtrar usuarios cuando cambia el término de búsqueda
    if (searchTerm.trim() === "") {
      setUsuarios(allUsuarios);
    } else {
      const filteredUsuarios = allUsuarios.filter(usuario => 
        usuario.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.nombres?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.apellidos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.documento?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setUsuarios(filteredUsuarios);
    }
  }, [searchTerm, allUsuarios]);

  const getData = () => {
    setLoading(true);
    fetch("/api/usuarios")
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        setUsuarios(data.data);
        setAllUsuarios(data.data);
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
        addToast({
          title: "Error",
          description: "No se pudieron cargar los usuarios",
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
      title: "Usuario eliminado",
      description: "El usuario ha sido eliminado correctamente",
      variant: "success"
    });
  };

  const handleSaveSuccess = (isNew = false) => {
    getData();
    addToast({
      title: "Operación exitosa",
      description: isNew 
        ? "El usuario ha sido creado correctamente" 
        : "El usuario ha sido actualizado correctamente",
      variant: "success"
    });
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Usuarios" />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 xl:p-5 dark:bg-white/[0.03] mb-5">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <BuscarUsuario onSearch={handleSearch} />
          <div className="flex justify-end">
            <NuevoUsuario onSave={() => handleSaveSuccess(true)} />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            {!loading && usuarios.length > 0 && (
              <Table>
                <UsuarioTableHeader />
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {usuarios.map((usuario: Usuario) => (
                    <UsuarioListItem 
                      usuario={usuario} 
                      key={usuario.id} 
                      onDelete={handleDeleteSuccess}
                      onChange={handleSaveSuccess}
                    />
                  ))}
                </TableBody>
              </Table>
            )}
            {!loading && usuarios.length === 0 && (
              <div className="flex items-center justify-center h-32">
                <p className="text-gray-500 dark:text-gray-400">No se encontraron usuarios</p>
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
