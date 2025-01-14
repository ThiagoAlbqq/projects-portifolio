import { FastifyReply, FastifyRequest } from 'fastify'
import { z, ZodError } from 'zod'
import { handleValidationError } from '../../../utils/handleValidationError'
import { GetUserUseCase } from './GetUserUseCase'

const getUserQuerySchema = z.object({
  id: z.string().regex(/^\d+$/).optional().transform(Number),
  email: z.string().email().optional(),
})

class GetUserController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id, email } = getUserQuerySchema.parse(request.query!)
      const getUserUseCase = new GetUserUseCase()
      if (id) {
        const user = await getUserUseCase.findUserById(id)
        return reply.status(200).send(user)
      }
      if (email) {
        const user = await getUserUseCase.findUserByEmail(email)
        return reply.status(200).send(user)
      }
      reply.status(400).send({
        message: 'Você deve fornecer um dos parametros: id ou email',
      })
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send(handleValidationError(error))
      }
      return reply.status(500).send(error)
    }
  }
}

export { GetUserController }
