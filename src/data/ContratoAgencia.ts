import Agencia from "./Agencia";

export default class ContratoAgencia {
  id: number;
  codigoContrato: string;
  contratoInicio: Date | null;
  contratoFin: Date | null;
  tipoGarantia: string | null;
  montoGarantia: number | null;
  testimonioNotarial: string | null;
  estado: string | null;
  observaciones: string | null;
  activo: boolean;
  createdAt: Date;
  agenciaId: number;
  agencia?: Agencia;

  constructor(
    id: number,
    codigoContrato: string,
    contratoInicio: Date | null = null,
    contratoFin: Date | null = null,
    tipoGarantia: string | null = null,
    montoGarantia: number | null = null,
    testimonioNotarial: string | null = null,
    estado: string | null = "vigente",
    observaciones: string | null = null,
    activo: boolean = false,
    createdAt: Date = new Date(),
    agenciaId: number,
    agencia?: Agencia
  ) {
    this.id = id;
    this.codigoContrato = codigoContrato;
    this.contratoInicio = contratoInicio;
    this.contratoFin = contratoFin;
    this.tipoGarantia = tipoGarantia;
    this.montoGarantia = montoGarantia;
    this.testimonioNotarial = testimonioNotarial;
    this.estado = estado;
    this.observaciones = observaciones;
    this.activo = activo;
    this.createdAt = createdAt;
    this.agenciaId = agenciaId;
    this.agencia = agencia;
  }
}
