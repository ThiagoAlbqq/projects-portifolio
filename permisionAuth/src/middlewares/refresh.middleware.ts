import { FastifyRequest, FastifyReply } from 'fastify'
import { ERRORS } from '../errors/errors'
import { verifyRefreshToken } from '../utils/createTokenAndRefreshToken'

export default async function refreshMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const refresh = request.cookies?.refresh
    if (!refresh) {
      return reply.status(401).send('Invalid refresh token!')
    }
    const authHeader = request.headers.authorization

    if (!authHeader) {
      console.error('Cabeçalho de autorização ausente')
      return reply.status(401).send({ message: 'Autorização ausente' })
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
      console.error('Token malformado')
      return reply.status(401).send({ message: 'Token malformado' })
    }

    const decodedRefreshToken = verifyRefreshToken(refresh)
    request.user = {
      id: decodedRefreshToken.id,
      role: decodedRefreshToken.role,
    }

    request.tokens = {
      token,
      refresh,
    }
  } catch (err) {
    console.error('Erro no middleware JWT:', err)
    reply.status(500).send({ error: ERRORS.SERVER_ERROR })
  }
}
