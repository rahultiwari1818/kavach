import bcrypt from "bcrypt";


export async function comparePassword(currentPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(currentPassword, hashedPassword);
}


export function generateOTP() : string {
    const length = 6;
    const otp = Math.floor(Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1)) + Math.pow(10, length - 1));
    return otp.toString();
}
