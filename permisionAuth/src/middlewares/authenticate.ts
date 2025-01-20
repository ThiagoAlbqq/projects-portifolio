import { FastifyReply, FastifyRequest } from 'fastify'
import jwt, {
  JsonWebTokenError,
  JwtPayload,
  TokenExpiredError,
} from 'jsonwebtoken'
import { verifyRefreshToken } from '../utils/createTokenAndRefreshToken'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
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

    const secretKey = process.env.JWT_SECRET || 'defaultSecretKey'

    try {
      const decoded = jwt.verify(token, secretKey) as JwtPayload
      request.user = { id: decoded.id, role: decoded.role }

      const refresh = request.cookies.refresh
      if (!refresh) {
        console.error('Refresh token malformado')
        return reply.status(401).send({ message: 'Refresh token malformado' })
      }

      request.tokens = {
        token,
        refresh,
      }

      console.log('Usuário autenticado')
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        console.log('Token expirado, tentando renovar...')

        const refreshToken = request.cookies?.refresh
        if (!refreshToken) {
          return reply.status(401).send({ message: 'Refresh token ausente' })
        }

        try {
          const newTokenResponse = await request.server.inject({
            method: 'POST',
            url: '/refresh',
            cookies: { refresh: refreshToken },
            headers: {
              Authorization: request.headers.authorization,
            },
          })

          if (newTokenResponse.statusCode === 200) {
            const authHeader = request.headers.authorization

            if (!authHeader) {
              console.error('Cabeçalho de autorização ausente')
              return reply.status(401).send({ message: 'Autorização ausente' })
            }

            const refreshedToken = authHeader.split(' ')[1]
            if (!refreshedToken) {
              console.error('Token malformado')
              return reply.status(401).send({ message: 'Token malformado' })
            }

            try {
              const decodedRefreshToken = verifyRefreshToken(refreshToken)
              request.user = {
                id: decodedRefreshToken.id,
                role: decodedRefreshToken.role,
              }
              request.tokens = { token: refreshedToken, refresh: refreshToken }

              console.log('Token renovado e usuário autenticado')
              return
            } catch (err) {
              console.error('Erro ao verificar o token renovado:', err)
              return reply
                .status(401)
                .send({ message: 'Erro ao verificar o token renovado' })
            }
          } else {
            console.error(
              'Falha ao renovar o token. Resposta:',
              newTokenResponse.json().message
            )
            return reply
              .status(401)
              .send({ message: newTokenResponse.json().message })
          }
        } catch (refreshErr) {
          console.error('Erro ao tentar renovar o token:', refreshErr)
          return reply.status(401).send({ message: 'Erro ao renovar o token' })
        }
      }

      console.error('Erro ao verificar o token:', err)
      return reply.status(401).send({ message: 'Token inválido ou expirado' })
    }
  } catch (err) {
    console.error('Erro durante autenticação:', err)
    return reply
      .status(500)
      .send({ message: 'Erro interno durante a autenticação' })
  }
}
