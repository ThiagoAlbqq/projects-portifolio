import { FastifyReply, FastifyRequest } from 'fastify'
import { z, ZodError } from 'zod'
import { DeleteUserUseCase } from './DeleteUserUseCase'
import { handleValidationError } from '../../../utils/handleValidationError'

const deleteUserSchema = z.object({
  id: z.string().uuid(),
})

class DeleteUserController {
  async handle(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = deleteUserSchema.parse(req.user)

      const deleteUserUseCase = new DeleteUserUseCase()
      const deletedUser = await deleteUserUseCase.execute(id)

      return reply.status(200).send({
        success: true,
        message: `User deleted successfully`,
        data: deletedUser,
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
        message: error,
      })
    }
  }
}

export { DeleteUserController }
