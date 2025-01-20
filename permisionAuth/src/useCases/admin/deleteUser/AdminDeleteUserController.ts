import { FastifyReply, FastifyRequest } from 'fastify'
import { z, ZodError } from 'zod'
import { AdminDeleteUserUseCase } from './AdminDeleteUserUseCase'
import { handleValidationError } from '../../../utils/handleValidationError'

const adminDeleteUserDataSchema = z.object({
  id: z.string({ required_error: 'ID is required' }).uuid(),
})

class AdminDeleteUserController {
  async handle(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = adminDeleteUserDataSchema.parse(req.params)
      const adminDeleteUserUseCase = new AdminDeleteUserUseCase()
      const data = await adminDeleteUserUseCase.execute(id)

      reply.status(200).send({
        success: true,
        message: 'User deleted successfully',
        data: data,
      })
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send({
          success: false,
          message: handleValidationError(error),
        })
      }
      return reply.status(500).send({
        success: false,
        message:
          error instanceof Error ? error.message : 'An unknown error occurred',
      })
    }
  }
}

export { AdminDeleteUserController }
