import RenovacionMarca from "./RenovacionMarca";

export default class Marca {
  id: number;
  nombre: string;
  estado: string;
  logotipoUrl: string | null;
  genero: string;
  tipo: string;
  claseNiza: string;
  numeroRegistro: string;
  fechaRegistro: Date;
  tramiteArealizar: string | null;
  fechaExpiracionRegistro: Date | null;
  fechaLimiteRenovacion: Date | null;
  titular: string;
  apoderado: string;
  createdAt: Date;
  renovaciones?: RenovacionMarca[];

  constructor(
    id: number,
    nombre: string,
    estado: string = "renovada",
    logotipoUrl: string | null = null,
    genero: string,
    tipo: string,
    claseNiza: string,
    numeroRegistro: string,
    fechaRegistro: Date,
    tramiteArealizar: string | null = null,
    fechaExpiracionRegistro: Date | null = null,
    fechaLimiteRenovacion: Date | null = null,
    titular: string,
    apoderado: string,
    createdAt: Date = new Date(),
    renovaciones: RenovacionMarca[] = []
  ) {
    this.id = id;
    this.nombre = nombre;
    this.estado = estado;
    this.logotipoUrl = logotipoUrl;
    this.genero = genero;
    this.tipo = tipo;
    this.claseNiza = claseNiza;
    this.numeroRegistro = numeroRegistro;
    this.fechaRegistro = fechaRegistro;
    this.tramiteArealizar = tramiteArealizar;
    this.fechaExpiracionRegistro = fechaExpiracionRegistro;
    this.fechaLimiteRenovacion = fechaLimiteRenovacion;
    this.titular = titular;
    this.apoderado = apoderado;
    this.createdAt = createdAt;
    this.renovaciones = renovaciones;
  }
}
