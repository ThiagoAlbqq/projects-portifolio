import jwt from 'jsonwebtoken';

export function createToken(payload: object, expirationTime: number): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: expirationTime,
  });
}