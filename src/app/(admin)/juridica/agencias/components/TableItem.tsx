import { TableRow, TableCell } from "@/components/ui/table";
import Image from "next/image";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Agencia from "@/data/Agencia";


interface Props {
  agencia: Agencia;
}

const AgenciaListItem: React.FC<Props> = (props) => {
  return (
  <TableRow key={props.agencia.id}>
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
            {props.agencia.agente?.nombres} 
          </span>
          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
            {props.agencia.agente?.apellidos} 
          </span>
        </div>
      </div>
    </TableCell>
    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
      {props.agencia.nombre}
    </TableCell>
    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
      {props.agencia.direccion}
    </TableCell>
    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
      {props.agencia.montoGarantia}
    </TableCell>
    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
      {props.agencia.contratoAgenciaFin ? format(props.agencia.contratoAgenciaFin, 'dd/MM/yyyy', { locale: es }) : '-'}
    </TableCell>
    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
      {props.agencia.contratoAgenciaFin ? format(props.agencia.contratoAgenciaFin, 'dd/MM/yyyy', { locale: es }) : '-'}
    </TableCell>
  </TableRow>
  );
};
export default AgenciaListItem;
