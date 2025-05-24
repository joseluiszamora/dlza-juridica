    import { TableCell, TableHeader, TableRow } from "@/components/ui/table";

export default function AreaTableHeader() {
  return (
    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
      <TableRow>
        <TableCell
          isHeader
          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
        >
          Nombre
        </TableCell>
        <TableCell
          isHeader
          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
        >
          Departamento
        </TableCell>
        <TableCell
          isHeader
          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
        >
          Fecha Creación
        </TableCell>
        <TableCell
          isHeader
          className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400"
        >
          Acciones
        </TableCell>
      </TableRow>
    </TableHeader>
  );
}
