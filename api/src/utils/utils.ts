import bcrypt from "bcrypt";


export async function comparePassword(currentPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(currentPassword, hashedPassword);
}
