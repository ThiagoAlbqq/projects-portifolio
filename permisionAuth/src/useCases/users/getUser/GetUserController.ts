import { FastifyReply, FastifyRequest } from 'fastify'
import { z, ZodError } from 'zod'
import { handleValidationError } from '../../../utils/handleValidationError'
import { GetUserUseCase } from './GetUserUseCase'

const getUserQuerySchema = z.object({
  id: z.string().uuid(),
})

class GetUserController {
  async handle(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = getUserQuerySchema.parse(req.user)
      const getUserUseCase = new GetUserUseCase()
      const user = await getUserUseCase.findUserById(id)
      return reply.status(200).send({
        sucess: true,
        message: 'User successfully obtained',
        data: user,
      })
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send({
          sucess: false,
          message: handleValidationError(error),
        })
      }
      return reply.status(500).send({
        sucess: false,
        message: error,
      })
    }
  }
}

export { GetUserController }
