import { FastifyReply, FastifyRequest } from 'fastify'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { CheckingTokenValidity } from '../utils/checkingTokenValidity'
import { error } from 'console'
import { ERRORS } from '../errors/errors'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authHeader = request.headers.authorization
    if (!authHeader) {
      return
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
      return console.log('Token malformado')
    }

    const secretKey = process.env.JWT_SECRET || 'defaultSecretKey'
    const decoded = jwt.verify(token, secretKey) as JwtPayload

    const checkingTokenValidity = new CheckingTokenValidity()
    const isValid = await checkingTokenValidity.execute(decoded.id, token)
    if (!isValid) {
      return
    }
    request.user = { id: decoded.id, role: decoded.role }
    console.log('Usuario autenticado')
  } catch (error) {
    console.log('Nenhum usuario autenticado:', error)
  }
}
