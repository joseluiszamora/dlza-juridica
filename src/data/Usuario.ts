export default class Usuario {
  id: number;
  username: string;
  password?: string; // Opcional en el cliente para no mostrar la contraseña
  email: string;
  nombres: string;
  apellidos: string;
  documento: string;
  imagenUrl: string | null;
  createdAt: Date;

  constructor(
    id: number,
    username: string,
    email: string,
    nombres: string,
    apellidos: string,
    documento: string,
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
    this.imagenUrl = imagenUrl;
    this.createdAt = createdAt;
    this.password = password;
  }
}
