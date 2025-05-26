'use client';

import { useState } from "react";
import { SearchIcon } from "@/icons";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";

interface Props {
  onSearch: (filters: {
    search: string;
    estado: string;
    marcaId?: string;
  }) => void;
  marcaId?: string;
  marcaNombre?: string;
}

const BuscarRenovacionMarca: React.FC<Props> = ({ onSearch, marcaId, marcaNombre }) => {
  const [search, setSearch] = useState("");
  const [estado, setEstado] = useState("");

  const handleSearch = () => {
    onSearch({
      search,
      estado,
      marcaId
    });
  };

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const estadoOptions = [
    { value: "", label: "Todos los estados" },
    { value: "Pendiente", label: "Pendiente" },
    { value: "En tramite", label: "En trámite" },
    { value: "Renovada", label: "Renovada" },
    { value: "Registrada", label: "Registrada" },
    { value: "Caducada", label: "Caducada" }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Buscar Renovaciones de Marca
      </h3>
      
      {marcaId && marcaNombre && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>Filtrando por marca:</strong> {marcaNombre}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Buscar
          </label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Número de solicitud, renovación, titular, apoderado..."
              onChange={handleChangeSearch}
              className="pl-10"
            />
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Estado
          </label>
          <Select 
            options={estadoOptions}
            placeholder="Todos los estados"
            onChange={setEstado}
            defaultValue=""
          />
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <SearchIcon className="inline h-4 w-4 mr-2" />
          Buscar
        </button>
      </div>
    </div>
  );
};

export default BuscarRenovacionMarca;
