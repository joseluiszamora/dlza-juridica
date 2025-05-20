import Agencia from "./Agencia";

export default class Agente {
  id: number;
  nombres: string;
  apellidos: string;
  documento: string;
  expedido: string;
  fechaNacimiento: Date;
  genero: string;
  direccion: string | null;
  telefono: string | null;
  celular: string;
  email: string | null;
  created_at: Date;
  activo: boolean | null;
  imagenUrl: string | null;
  documentoCi: boolean | null;
  documentoCroquis: boolean | null;
  documentoServicioBasico: boolean | null;
  agencias?: Agencia[];

  constructor(
    id: number,
    nombres: string,
    apellidos: string,
    documento: string,
    expedido: string,
    fechaNacimiento: Date,
    genero: string,
    celular: string,
    direccion: string | null = "",
    telefono: string | null = "",
    email: string | null = "",
    activo: boolean | null = true,
    imagenUrl: string | null = null,
    documentoCi: boolean | null = false,
    documentoCroquis: boolean | null = false,
    documentoServicioBasico: boolean | null = false,
    created_at: Date = new Date(),
    agencias: Agencia[] = []
  ) {
    this.id = id;
    this.nombres = nombres;
    this.apellidos = apellidos;
    this.documento = documento;
    this.expedido = expedido;
    this.fechaNacimiento = fechaNacimiento;
    this.genero = genero;
    this.direccion = direccion;
    this.telefono = telefono;
    this.celular = celular;
    this.email = email;
    this.created_at = created_at;
    this.activo = activo;
    this.imagenUrl = imagenUrl;
    this.documentoCi = documentoCi;
    this.documentoCroquis = documentoCroquis;
    this.documentoServicioBasico = documentoServicioBasico;
    this.agencias = agencias;
  }
}