import { FastifyReply, FastifyRequest } from 'fastify'
import { z, ZodError } from 'zod'
import { handleValidationError } from '../../../utils/handleValidationError'
import { AdminGetUserUseCase } from './AdminGetUserUseCase'

const adminGetUserQuerySchema = z.object({
  id: z.string().uuid({ message: 'Invalid id format' }).optional(),
  email: z.string().email({ message: 'Invalid email format' }).optional(),
})

class AdminGetUserController {
  async handle(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id, email } = adminGetUserQuerySchema.parse(req.query)
      if (!id && !email) {
        return reply.redirect('/admin/users')
      }
      const adminGetUserUseCase = new AdminGetUserUseCase()
      if (id) {
        const user = await adminGetUserUseCase.findByID(id)
        return reply.status(200).send({
          sucess: true,
          data: user,
        })
      }
      if (email) {
        const user = await adminGetUserUseCase.findByEmail(email)
        return reply.status(200).send({
          success: true,
          data: user,
        })
      }
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
export { AdminGetUserController }
