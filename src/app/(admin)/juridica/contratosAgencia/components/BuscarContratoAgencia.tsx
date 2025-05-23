import React, { useState } from "react";
import { SearchIcon } from "@/icons";

interface BuscarContratoAgenciaProps {
  onSearch: (term: string) => void;
}

const BuscarContratoAgencia: React.FC<BuscarContratoAgenciaProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
        <SearchIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      </div>
      <input
        type="text"
        className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-900 focus:border-brand-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
        placeholder="Buscar contratos por código, agencia o estado..."
        value={searchTerm}
        onChange={handleSearch}
      />
    </div>
  );
};

export default BuscarContratoAgencia;
