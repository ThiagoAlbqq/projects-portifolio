import { FastifyReply, FastifyRequest } from 'fastify'
import { z, ZodError } from 'zod'
import { RefreshUseCase } from './RefreshUseCase'
import { handleValidationError } from '../../../utils/handleValidationError'
import { PrismaClientValidationError } from '@prisma/client/runtime/library'

const RefreshTokensSchema = z.object({
  token: z.string({ required_error: 'Token is required' }),
  refresh: z.string({ required_error: 'Refresh token is required' }),
})

class RefreshController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { token, refresh } = RefreshTokensSchema.parse(request.tokens!)
      const refreshUseCase = new RefreshUseCase()

      console.info(
        `[REFRESH] Tentativa de refresh para o usuario de ID: ${request.user?.id} e ROLE: ${request.user?.role} `
      )

      const newToken = await refreshUseCase.refresh({ token, refresh })

      console.log(`Um novo token foi criado para o usuario.`)
      const bearerToken = `Bearer ${newToken}`

      reply.header('Authorization', bearerToken).status(200).send({
        success: true,
        message: 'Token obtained by refresh token',
        deta: newToken,
      })
    } catch (error) {
      if (error instanceof ZodError) {
        console.warn(`[LOGIN] Erro de validação: ${error.message}`)
        return reply.status(400).send({
          success: false,
          message: handleValidationError(error),
        })
      }

      if (error instanceof PrismaClientValidationError) {
        console.error(`[LOGIN] Erro de validação do Prisma: ${error.message}`)
        return reply.status(500).send({
          success: false,
          message: error.message,
        })
      }

      console.error(`[LOGIN] Erro inesperado: ${error}`)
      return reply.status(500).send({
        success: false,
        message: 'Internal Server Error',
      })
    }
  }
}

export { RefreshController }
