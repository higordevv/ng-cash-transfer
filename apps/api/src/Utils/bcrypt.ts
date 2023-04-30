import bycript from "bcrypt";

export async function Hash(data: string) {
  const sault = 8;
  return bycript.hash(data, sault);
}
export async function VerifyHash(data: string, hash: string): Promise<boolean> {
  return bycript.compareSync(data, hash);
}