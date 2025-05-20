export default class Ciudad {
  id: number;
  nombre: string | null;
  created_at: Date;

  constructor(
    id: number,
    nombre: string | null = "",
    created_at: Date = new Date()
  ) {
    this.id = id;
    this.nombre = nombre;
    this.created_at = created_at;
  }
}