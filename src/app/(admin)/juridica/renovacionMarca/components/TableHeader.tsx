import { TableCell, TableHeader, TableRow } from "@/components/ui/table";

const RenovacionMarcaTableHeader = () => {
  return (
    <TableHeader className="bg-gray-50 dark:bg-gray-900">
      <TableRow>
        <TableCell className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Información de Renovación
        </TableCell>
        <TableCell className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Marca Asociada
        </TableCell>
        <TableCell className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Estado y Fecha
        </TableCell>
        <TableCell className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Responsables
        </TableCell>
        <TableCell className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Acciones
        </TableCell>
      </TableRow>
    </TableHeader>
  );
};

export default RenovacionMarcaTableHeader;
