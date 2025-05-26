import Marca from "./Marca";

export default class RenovacionMarca {
  id: number;
  estadoRenovacion: string;
  numeroDeRenovacion: string | null;
  fechaParaRenovacion: Date | null;
  numeroDeSolicitud: string;
  titular: string;
  apoderado: string;
  procesoSeguidoPor: string | null;
  createdAt: Date;
  marcaId: number;
  marca?: Marca;

  constructor(
    id: number,
    estadoRenovacion: string = "renovada",
    numeroDeRenovacion: string | null = null,
    fechaParaRenovacion: Date | null = null,
    numeroDeSolicitud: string,
    titular: string,
    apoderado: string,
    procesoSeguidoPor: string | null = null,
    createdAt: Date = new Date(),
    marcaId: number,
    marca?: Marca
  ) {
    this.id = id;
    this.estadoRenovacion = estadoRenovacion;
    this.numeroDeRenovacion = numeroDeRenovacion;
    this.fechaParaRenovacion = fechaParaRenovacion;
    this.numeroDeSolicitud = numeroDeSolicitud;
    this.titular = titular;
    this.apoderado = apoderado;
    this.procesoSeguidoPor = procesoSeguidoPor;
    this.createdAt = createdAt;
    this.marcaId = marcaId;
    this.marca = marca;
  }
}
