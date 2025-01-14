import { FastifyReply, FastifyRequest } from 'fastify'
import { LogoutUseCase } from './logoutUseCase'
import { z, ZodError } from 'zod'
import { handleValidationError } from '../../../utils/handleValidationError'

const LogoutTokensSchema = z.object({
  token: z.string(),
  refresh: z.string(),
})

class LogoutController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const logoutUseCase = new LogoutUseCase()
      const { token, refresh } = LogoutTokensSchema.parse(request.tokens!)
      const logout = await logoutUseCase.logout({ token, refresh })
      reply.clearCookie('refresh', { path: '/' })
      reply.status(200).send({ message: 'Logout successful' })
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send(handleValidationError(error))
      }
      return reply.status(500).send(error)
    }
  }
}

export { LogoutController }
