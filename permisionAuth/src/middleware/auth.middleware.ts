import { FastifyRequest, FastifyReply } from 'fastify'
import jwt from 'jsonwebtoken'

interface JwtPayload {
  id: string
  role: string[]
}

const ERRORS = {
  noToken: 'Token de autenticação não fornecido',
  malformedToken: 'Token malformado',
  invalidToken: 'Token inválido ou expirado',
  serverError: 'Erro no servidor',
  insufficientRole: 'Permissão insuficiente para acessar este recurso',
}

export default async function jwtMiddleware(
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

      // Anexar informações do usuário ao objeto de request
      request.user = { id: decoded.id, roles: decoded.role }
      console.log(request.user.id)

      // Verificação de roles (por exemplo, verificar se o usuário tem a role 'admin')
      if (!decoded.role.includes('ADMIN')) {
        reply.status(403).send({ error: ERRORS.insufficientRole })
        return
      }
    } catch (err) {
      reply.status(401).send({ error: ERRORS.invalidToken })
      return
    }
  } catch (err) {
    console.error('Erro no middleware JWT:', err)
    reply.status(500).send({ error: ERRORS.serverError })
  }
}
