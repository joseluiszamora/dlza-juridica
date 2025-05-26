import Input from "@/components/form/input/InputField";
import { MagnifyingGlassIcon } from "@/icons";
import React, { useState } from "react";

interface Props {
  onSearch: (term: string) => void;
}

const BuscarMarca: React.FC<Props> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <MagnifyingGlassIcon size={16} className="text-gray-400" />
      </div>
      <Input
        type="text"
        placeholder="Buscar por nombre, número de registro, titular, apoderado o estado..."
        defaultValue={searchTerm}
        onChange={handleSearch}
        className="pl-10 w-96"
      />
    </div>
  );
};

export default BuscarMarca;
