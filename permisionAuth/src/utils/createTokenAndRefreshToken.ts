import jwt from 'jsonwebtoken'

export function createToken(payload: object, expirationTime: number): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: expirationTime,
  })
}

export function createRefreshToken(
  payload: object,
  expirationTime: number
): string {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: expirationTime,
  })
}

export function verifyToken(token: string): jwt.JwtPayload {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload
  } catch {
    throw new Error('Token inválido')
  }
}

export function verifyRefreshToken(refresh: string): jwt.JwtPayload {
  try {
    return jwt.verify(
      refresh,
      process.env.JWT_REFRESH_SECRET!
    ) as jwt.JwtPayload
  } catch {
    throw new Error('Token inválido')
  }
}
