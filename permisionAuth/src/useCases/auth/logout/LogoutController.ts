import { FastifyReply, FastifyRequest } from 'fastify'
import { LogoutUseCase } from './LogoutUseCase'
import { z, ZodError } from 'zod'
import { handleValidationError } from '../../../utils/handleValidationError'
import { PrismaClientValidationError } from '@prisma/client/runtime/library'

const LogoutTokensSchema = z.object({
  token: z.string({ required_error: 'Token is required' }),
  refresh: z.string({ required_error: 'Refresh token is required' }),
})

class LogoutController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      console.info(
        `[LOGOUT] Tentativa de logout para o usuario ${request.user?.id}`
      )
      const logoutUseCase = new LogoutUseCase()
      const { refresh } = LogoutTokensSchema.parse(request.tokens!)
      await logoutUseCase.logout({ refresh })
      reply.clearCookie('refresh', { path: '/' }).status(200).send({
        success: true,
        message: 'Logout successful',
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

export { LogoutController }
