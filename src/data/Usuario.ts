export default class Usuario {
  id: number;
  username: string;
  password?: string; // Opcional en el cliente para no mostrar la contraseña
  email: string;
  nombres: string;
  apellidos: string;
  documento: string;
  imagenUrl: string | null;
  role: string;
  cargo: string | null;
  area: string | null;
  activo: boolean;
  createdAt: Date;

  constructor(
    id: number,
    username: string,
    email: string,
    nombres: string,
    apellidos: string,
    documento: string,
    role: string = "user",
    cargo: string | null = null,
    area: string | null = null,
    activo: boolean = true,
    imagenUrl: string | null = null,
    createdAt: Date = new Date(),
    password?: string
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.nombres = nombres;
    this.apellidos = apellidos;
    this.documento = documento;
    this.role = role;
    this.cargo = cargo;
    this.area = area;
    this.activo = activo;
    this.imagenUrl = imagenUrl;
    this.createdAt = createdAt;
    this.password = password;
  }
}
