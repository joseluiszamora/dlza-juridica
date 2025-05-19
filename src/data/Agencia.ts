export default class Agencia {
  id: number;
  nombre: string;
  agente: string;
  ciudad: string;
  direccion: string;
  tipoGarantia: string;
  montoGarantia: number
  contratoAgenciaInicio: Date;
  contratoAgenciaFin: Date;
  ci: boolean;
  croquis: boolean;
  facturaServicioBasico: boolean;
  nit: boolean;
  licenciaDeFuncionamiento: boolean;
  ruat: boolean;
  latitud: number;
  longitud: number;
  testimonioNotarial: string;
  vigenciaLicenciaFuncionamiento: Date;
  observaciones: string;

  constructor(
    id: number,
    nombre: string,
    agente: string,
    ciudad: string,
    direccion: string,
    tipoGarantia: string,
    montoGarantia: number,
    contratoAgenciaInicio: Date,
    contratoAgenciaFin: Date,
    ci: boolean,
    croquis: boolean,
    facturaServicioBasico: boolean,
    nit: boolean,
    licenciaDeFuncionamiento: boolean,
    ruat: boolean,
    latitud: number,
    longitud: number,
    testimonioNotarial: string,
    vigenciaLicenciaFuncionamiento: Date,
    observaciones: string
  ) {
    this.id = id;
    this.nombre = nombre;
    this.agente = agente;
    this.ciudad = ciudad;
    this.direccion = direccion;
    this.tipoGarantia = tipoGarantia;
    this.montoGarantia = montoGarantia;
    this.contratoAgenciaInicio = contratoAgenciaInicio;
    this.contratoAgenciaFin = contratoAgenciaFin;
    this.ci = ci;
    this.croquis = croquis;
    this.facturaServicioBasico = facturaServicioBasico;
    this.nit = nit;
    this.licenciaDeFuncionamiento = licenciaDeFuncionamiento;
    this.ruat = ruat;
    this.latitud = latitud;
    this.longitud = longitud;
    this.testimonioNotarial = testimonioNotarial;
    this.vigenciaLicenciaFuncionamiento = vigenciaLicenciaFuncionamiento;
    this.observaciones = observaciones;
  }

}