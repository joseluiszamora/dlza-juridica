import Button from "@/components/ui/button/Button";
import { TableRow, TableCell } from "@/components/ui/table";
import Ciudad from "@/data/Ciudad";
import { PencilIcon } from "@/icons";

interface Props {
  ciudad: Ciudad;
}

const CiudadListItem: React.FC<Props> = (props) => {
  return (
  <TableRow key={props.ciudad.id}>
    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
      {props.ciudad.nombre}
    </TableCell>
    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
      {props.ciudad.pais}
    </TableCell>
    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
      <Button size="sm" variant="primary" startIcon={<PencilIcon />}>
        Editar
      </Button>
    </TableCell>
  </TableRow>
  );
};
export default CiudadListItem;
