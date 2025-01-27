import { FastifyReply, FastifyRequest } from 'fastify'
import { z, ZodError } from 'zod'
import { AdminUpdateUserUseCase } from './AdminUpdateUserUseCase'
import { handleValidationError } from '../../../utils/handleValidationError'
import { PrismaClientValidationError } from '@prisma/client/runtime/library'

const adminUpdateUserParamsSchema = z.object({
  id: z.string().uuid({ message: 'Invalid id format' }),
})

const adminUpdateUserBodySchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
  role: z.enum(['ADMIN', 'USER', 'MODERATOR']).optional(),
})

class AdminUpdateUserController {
  async handle(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = adminUpdateUserParamsSchema.parse(req.params)
      const data = adminUpdateUserBodySchema.parse(req.body)
      const adminUpdateUserUseCase = new AdminUpdateUserUseCase()
      const updatedUser = await adminUpdateUserUseCase.execute({ id, ...data })

      reply.status(200).send({
        success: true,
        message: 'User updated successfully',
        data: updatedUser,
      })
    } catch (error) {
      if (error instanceof ZodError) {
        console.warn(`[ADMIN PUT USER] Erro de validação: ${error.message}`)
        return reply.status(400).send({
          success: false,
          message: handleValidationError(error),
        })
      }

      if (error instanceof PrismaClientValidationError) {
        console.error(
          `[ADMIN PUT USER] Erro de validação do Prisma: ${error.message}`
        )
        return reply.status(500).send({
          success: false,
          message: error.message,
        })
      }

      console.error(`[ADMIN PUT USER] Erro inesperado: ${error}`)
      return reply.status(500).send({
        success: false,
        message: 'Internal Server Error',
      })
    }
  }
}

export { AdminUpdateUserController }
