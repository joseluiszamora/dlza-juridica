import * as bcrypt from 'bcryptjs';

// Función para encriptar la contraseña
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

// Función para comparar contraseñas
export async function comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}
