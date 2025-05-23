import Agencia from "./Agencia";

export default class ContratoAgencia {
  id: number;
  codigoContrato: string;
  contratoAgenciaInicio: Date | null;
  contratoAgenciaFin: Date | null;
  tipoGarantia: string | null;
  montoGarantia: number | null;
  testimonioNotarial: string | null;
  estado: string | null;
  observaciones: string | null;
  createdAt: Date;
  agenciaId: number;
  agencia?: Agencia;

  constructor(
    id: number,
    codigoContrato: string,
    contratoAgenciaInicio: Date | null = null,
    contratoAgenciaFin: Date | null = null,
    tipoGarantia: string | null = null,
    montoGarantia: number | null = null,
    testimonioNotarial: string | null = null,
    estado: string | null = "vigente",
    observaciones: string | null = null,
    createdAt: Date = new Date(),
    agenciaId: number,
    agencia?: Agencia
  ) {
    this.id = id;
    this.codigoContrato = codigoContrato;
    this.contratoAgenciaInicio = contratoAgenciaInicio;
    this.contratoAgenciaFin = contratoAgenciaFin;
    this.tipoGarantia = tipoGarantia;
    this.montoGarantia = montoGarantia;
    this.testimonioNotarial = testimonioNotarial;
    this.estado = estado;
    this.observaciones = observaciones;
    this.createdAt = createdAt;
    this.agenciaId = agenciaId;
    this.agencia = agencia;
  }
}
