import Agente from "./Agente";
import Ciudad from "./Ciudad";

export default class Agencia {
  id: number;
  nombre: string | null;
  agenteNombre: string | null;
  agenteId: number;
  agente?: Agente;
  direccion: string | null;
  ciudadId: number;
  ciudad?: Ciudad;
  latitud: number | null;
  longitud: number | null;
  licenciaDeFuncionamiento: boolean | null;
  vigenciaLicenciaFuncionamiento: Date | null;
  nitAgencia: string | null;
  tipoGarantia: string | null;
  montoGarantia: number | null;
  testimonioNotarial: string | null;
  contratoAlquiler: string | null;
  contratoAgenciaInicio: Date | null;
  contratoAgenciaFin: Date | null;
  observaciones: string | null;
  created_at: Date;

  constructor(
    id: number,
    nombre: string | null = "",
    agenteNombre: string | null = "",
    agenteId: number = 1,
    agente?: Agente,
    direccion: string | null = "",
    ciudadId: number = 1,
    ciudad?: Ciudad,
    latitud: number | null = null,
    longitud: number | null = null,
    licenciaDeFuncionamiento: boolean | null = null,
    vigenciaLicenciaFuncionamiento: Date | null = null,
    nitAgencia: string | null = null,
    tipoGarantia: string | null = null,
    montoGarantia: number | null = null,
    testimonioNotarial: string | null = null,
    contratoAlquiler: string | null = null,
    contratoAgenciaInicio: Date | null = null,
    contratoAgenciaFin: Date | null = null,
    observaciones: string | null = null,
    created_at: Date = new Date()
  ) {
    this.id = id;
    this.nombre = nombre;
    this.agenteNombre = agenteNombre;
    this.agenteId = agenteId;
    this.agente = agente;
    this.direccion = direccion;
    this.ciudadId = ciudadId;
    this.ciudad = ciudad;
    this.latitud = latitud;
    this.longitud = longitud;
    this.licenciaDeFuncionamiento = licenciaDeFuncionamiento;
    this.vigenciaLicenciaFuncionamiento = vigenciaLicenciaFuncionamiento;
    this.nitAgencia = nitAgencia;
    this.tipoGarantia = tipoGarantia;
    this.montoGarantia = montoGarantia;
    this.testimonioNotarial = testimonioNotarial;
    this.contratoAlquiler = contratoAlquiler;
    this.contratoAgenciaInicio = contratoAgenciaInicio;
    this.contratoAgenciaFin = contratoAgenciaFin;
    this.observaciones = observaciones;
    this.created_at = created_at;
  }
}