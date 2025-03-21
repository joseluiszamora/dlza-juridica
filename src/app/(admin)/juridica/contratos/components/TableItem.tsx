import Badge from "@/components/ui/badge/Badge";
import { TableRow, TableCell } from "@/components/ui/table";
import Contrato from "@/data/Contrato";
import Image from "next/image";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';


interface Props {
  contrato: Contrato;
}

const ContratoListItem: React.FC<Props> = (props) => {
  return (
  <TableRow key={props.contrato.id}>
    <TableCell className="px-5 py-4 sm:px-6 text-start">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 overflow-hidden rounded-full">
          <Image
            width={40}
            height={40}
            src="/images/user/user-01.jpg"
            alt="Lindsey Curtis"
          />
        </div>
        <div>
          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
            Erwin
          </span>
          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
            Saavedra
          </span>
        </div>
      </div>
    </TableCell>
    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
      {props.contrato.title}
    </TableCell>
    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
      {props.contrato.object}
    </TableCell>
    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
      <Badge
        size="sm"
        color={
          props.contrato.status === "Active"
            ? "success"
            : props.contrato.status === "Pending"
            ? "warning"
            : "error"
        }
      >
        {props.contrato.status}
      </Badge>
    </TableCell>
    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
      {props.contrato.ammount}
    </TableCell>
    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
      {format(props.contrato.dateStart, 'dd/MM/yyyy', { locale: es })}
    </TableCell>
    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
      {format(props.contrato.dateEnd, 'dd/MM/yyyy', { locale: es })}
    </TableCell>
    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
      {props.contrato.desc}
    </TableCell>
  </TableRow>
  );
};
export default ContratoListItem;
