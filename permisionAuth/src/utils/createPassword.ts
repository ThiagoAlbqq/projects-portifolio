import bcrypt from 'bcrypt'

export async function createPassword(password: string) {
  const passwordHash = await bcrypt.hash(password, process.env.SALTS! || 10)
  return passwordHash
}
