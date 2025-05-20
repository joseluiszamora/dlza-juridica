import { TableCell, TableHeader, TableRow } from "@/components/ui/table";

export default function CiudadTableHeader() {
  return(<TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
    <TableRow>
      <TableCell
        isHeader
        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
      >
        Ciudad
      </TableCell>
      <TableCell
        isHeader
        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
      >
        Pais
      </TableCell>
      <TableCell
        isHeader
        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
      >
        Acciones
      </TableCell>
    </TableRow>
  </TableHeader>);
}