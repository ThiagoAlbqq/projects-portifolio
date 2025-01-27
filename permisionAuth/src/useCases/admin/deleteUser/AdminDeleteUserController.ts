import { FastifyReply, FastifyRequest } from 'fastify'
import { z, ZodError } from 'zod'
import { AdminDeleteUserUseCase } from './AdminDeleteUserUseCase'
import { handleValidationError } from '../../../utils/handleValidationError'
import { PrismaClientValidationError } from '@prisma/client/runtime/library'

const adminDeleteUserDataSchema = z.object({
  id: z
    .string({ required_error: 'ID is required' })
    .uuid({ message: 'Invalid ID format' }),
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
        console.warn(`[ADMIN DELETE USER] Erro de validação: ${error.message}`)
        return reply.status(400).send({
          success: false,
          message: handleValidationError(error),
        })
      }

      if (error instanceof PrismaClientValidationError) {
        console.error(
          `[ADMIN DELETE USER] Erro de validação do Prisma: ${error.message}`
        )
        return reply.status(500).send({
          success: false,
          message: error.message,
        })
      }

      console.error(`[ADMIN DELETE USER] Erro inesperado: ${error}`)
      return reply.status(500).send({
        success: false,
        message: 'Internal Server Error',
      })
    }
  }
}

export { AdminDeleteUserController }
