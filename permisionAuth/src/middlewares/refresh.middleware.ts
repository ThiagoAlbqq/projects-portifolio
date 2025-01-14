import { FastifyRequest, FastifyReply } from 'fastify'
import jwt from 'jsonwebtoken'
import { ERRORS } from '../errors/errors'
import { verifyToken } from '../utils/createTokenAndRefreshToken'

// Segredos do JWT
const SECRET = process.env.JWT_SECRET || 'segredoPadrao'
const REFRESH_TOKEN_SECRET =
  process.env.JWT_REFRESH_SECRET || 'segredoPadraoRefresh'

// Middleware JWT e Refresh Token
export default async function jwtAndRefreshMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authHeader = request.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      reply.status(401).send({ error: ERRORS.noToken })
      return
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
      reply.status(401).send({ error: ERRORS.malformedToken })
      return
    }
    const { refresh } = request.cookies
    if (!refresh) {
      reply.status(401).send({ error: ERRORS.noRefreshToken })
      return
    }

    try {
      console.log('oi')
      const decoded = verifyToken(token)
      console.log(decoded)
      const decodedRefreshToken = jwt.verify(refresh, REFRESH_TOKEN_SECRET)

      request.user = {
        id: decoded.id,
        role: decoded.role,
      }

      request.tokens = {
        token,
        refresh,
      }
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        const errorMsg =
          err.message.includes('expired') || err.message.includes('invalid')
            ? ERRORS.invalidToken
            : ERRORS.invalidRefreshToken

        reply.status(401).send({ error: errorMsg })
        return
      }

      reply.status(401).send({ error: ERRORS.invalidToken })
      return
    }
  } catch (err) {
    console.error('Erro no middleware JWT:', err)
    reply.status(500).send({ error: ERRORS.serverError })
  }
}
