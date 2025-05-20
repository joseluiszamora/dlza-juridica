import Input from "@/components/form/input/InputField";
import { SearchIcon } from "@/icons";
import { ChangeEvent } from "react";

interface BuscarAgenciaProps {
  onSearch: (term: string) => void;
}

export default function BuscarAgencia({ onSearch }: BuscarAgenciaProps) {
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="relative">
      <Input
        placeholder="Buscar por nombre, agente o ciudad..."
        type="text"
        className="pl-[62px]"
        onChange={handleSearch}
      />
      <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
        <SearchIcon />
      </span>
    </div>
  );
}
