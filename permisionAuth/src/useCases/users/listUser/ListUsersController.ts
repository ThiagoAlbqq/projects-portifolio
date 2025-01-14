import { FastifyReply, FastifyRequest } from 'fastify'
import { ListUsersUseCase } from './ListUsersUseCase'
import { z, ZodError } from 'zod'
import { handleValidationError } from '../../../utils/handleValidationError'

const listUsersBodySchema = z.object({
  limit: z.string().regex(/^\d+$/).optional().transform(Number),
  salts: z.string().regex(/^\d+$/).optional().transform(Number),
})

class ListUsersController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const listUserController = new ListUsersUseCase()
    try {
      console.log(request.routeOptions?.config?.roles)
      const { limit, salts } = listUsersBodySchema.parse(request.query)
      const users = await listUserController.listUsers(limit, salts)
      reply.status(200).send(users)
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send(handleValidationError(error))
      }
      return reply.status(500).send(error)
    }
  }
}

export { ListUsersController }
