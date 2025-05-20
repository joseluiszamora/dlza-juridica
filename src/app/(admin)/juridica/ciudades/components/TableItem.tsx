import { TableRow, TableCell } from "@/components/ui/table";
import Ciudad from "@/data/Ciudad";
import EditarCiudad from "./EditarCiudad";

interface Props {
  ciudad: Ciudad;
  onChange: () => void;
}


const CiudadListItem: React.FC<Props> = (props) => {
  return (
  <TableRow key={props.ciudad.id}>
    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
      {props.ciudad.nombre}
    </TableCell>
    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
      {props.ciudad.pais?.toUpperCase()}
    </TableCell>
    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
      <EditarCiudad ciudad={props.ciudad} onSave={props.onChange} />
    </TableCell>
  </TableRow>
  );
};
export default CiudadListItem;
