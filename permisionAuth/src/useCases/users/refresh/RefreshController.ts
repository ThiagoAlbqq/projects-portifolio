import { FastifyReply, FastifyRequest } from 'fastify'
import { z, ZodError } from 'zod'
import { RefreshUseCase } from './RefreshUseCase'
import { handleValidationError } from '../../../utils/handleValidationError'

const RefreshTokensSchema = z.object({
  token: z.string(),
  refresh: z.string(),
})

class RefreshController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { token, refresh } = RefreshTokensSchema.parse(request.tokens!)
      const refreshUseCase = new RefreshUseCase()
      const newToken = await refreshUseCase.refresh({ token, refresh })
      reply.status(200).send({ token: newToken })
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send(handleValidationError(error))
      }
      return reply.status(500).send(error)
    }
  }
}

export { RefreshController }
