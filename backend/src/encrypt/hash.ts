import { hash, compare } from "bcrypt";
export async function hashPassword(password: string) {
  return await hash(password, 10);
}
export async function comparePasswords(
  password: string,
  hashedPassword: string
) {
  return await compare(password, hashedPassword);
}
