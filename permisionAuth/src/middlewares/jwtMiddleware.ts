import { FastifyReply, FastifyRequest } from 'fastify'
import jwt from 'jsonwebtoken'
import { ERRORS } from '../errors/errors'

interface JwtPayload {
  id: string
  role: string
}

export default async function JwtMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authHeader = request.headers['authorization']

    if (!authHeader?.startsWith('Bearer ')) {
      reply.status(401).send({ error: ERRORS.noToken })
      return
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
      reply.status(401).send({ error: ERRORS.malformedToken })
      return
    }

    const SECRET = process.env.JWT_SECRET || 'segredoPadrao'

    try {
      const decoded = jwt.verify(token, SECRET) as JwtPayload
      console.log(decoded)
      request.user = { id: decoded.id, role: decoded.role }
    } catch (err) {
      reply.status(401).send({ error: ERRORS.invalidToken })
      return
    }
  } catch (err) {
    console.error('Erro no middleware JWT:', err)
    reply.status(500).send({ error: ERRORS.serverError })
  }
}
