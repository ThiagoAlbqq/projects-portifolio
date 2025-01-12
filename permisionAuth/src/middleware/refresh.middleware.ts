import { FastifyRequest, FastifyReply } from 'fastify'
import jwt from 'jsonwebtoken'

// Mensagens de Erro
const ERRORS = {
  noToken: 'Access Token não fornecido',
  malformedToken: 'Access Token malformado',
  invalidToken: 'Access Token inválido ou expirado',
  noRefreshToken: 'Refresh Token não fornecido',
  invalidRefreshToken: 'Refresh Token inválido ou expirado',
  serverError: 'Erro no servidor',
  insufficientPermissions: 'Permissão insuficiente para acessar este recurso',
}

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
    // Verificar Access Token no cabeçalho Authorization
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

    // Verificar Refresh Token nos cookies
    const { refreshToken } = request.cookies
    console.log(refreshToken)
    console.log(token)
    if (!refreshToken) {
      reply.status(401).send({ error: ERRORS.noRefreshToken })
      return
    }

    try {
      // Verificar Access Token
      const decoded = jwt.verify(token, SECRET) as jwt.JwtPayload

      // Verificar Refresh Token
      const decodedRefreshToken = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET)

      // Anexar informações do usuário ao objeto de request
      request.user = {
        id: decoded.id,
        roles: decoded.role,
      }

      request.tokens = {
        token,
        refreshToken,
      }
    } catch (err) {
      // Identificar erro no Access Token ou Refresh Token
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
