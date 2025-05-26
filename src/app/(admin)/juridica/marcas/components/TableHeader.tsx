import { TableCell, TableHeader, TableRow } from "@/components/ui/table";

const MarcaTableHeader = () => {
  return (
    <TableHeader className="bg-gray-50 dark:bg-gray-900">
      <TableRow>
        <TableCell className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Información de la Marca
        </TableCell>
        <TableCell className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Registro y Estado
        </TableCell>
        <TableCell className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Fechas Importantes
        </TableCell>
        <TableCell className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Responsables
        </TableCell>
        <TableCell className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Renovaciones
        </TableCell>
        <TableCell className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Acciones
        </TableCell>
      </TableRow>
    </TableHeader>
  );
};

export default MarcaTableHeader;
