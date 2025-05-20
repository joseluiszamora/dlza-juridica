export default class Agente {
  id: number;
  nombres: string | null;
  apellidos: string | null;
  documento: string | null;
  expedido: string | null;
  fechaNacimiento: Date | null;
  genero: string | null;
  direccion: string | null;
  telefono: string | null;
  celular: string | null;
  email: string | null;

  constructor(
    id: number,
    nombres: string | null = "",
    apellidos: string | null = "",
    documento: string | null = "",
    expedido: string | null = "",
    fechaNacimiento: Date | null = null,
    genero: string | null = "",
    direccion: string | null = "",
    telefono: string | null = "",
    celular: string | null = "",
    email: string | null = ""
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
  }

}