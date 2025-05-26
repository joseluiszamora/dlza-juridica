// Utilizando un ícono disponible en la aplicación
import { BoxIconLine } from "@/icons";

interface Props {
  onSearch: (term: string) => void;
}

const BuscarRenovacionMarca: React.FC<Props> = ({ onSearch }) => {
  return (
    <div className="flex items-center rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-white/[0.05]">
      <BoxIconLine className="mr-2 h-5 w-5 text-gray-500 dark:text-white/70" />
      <input
        type="text"
        placeholder="Buscar por nombre de marca..."
        className="min-h-[24px] w-full border-none p-0 text-sm font-medium text-gray-800 focus:outline-none focus:ring-0 dark:bg-transparent dark:text-white/70"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};

export default BuscarRenovacionMarca;
