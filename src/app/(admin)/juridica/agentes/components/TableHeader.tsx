import { TableCell, TableHeader, TableRow } from "@/components/ui/table";

export default function AgenteTableHeader() {
  return (
    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
      <TableRow>
        <TableCell
          isHeader
          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
        >
          Nombre Completo
        </TableCell>
        <TableCell
          isHeader
          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
        >
          Documento
        </TableCell>
        <TableCell
          isHeader
          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
        >
          Celular
        </TableCell>
        <TableCell
          isHeader
          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
        >
          Estado
        </TableCell>
        <TableCell
          isHeader
          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
        >
          Acciones
        </TableCell>
      </TableRow>
    </TableHeader>
  );
}
