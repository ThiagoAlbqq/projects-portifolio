import { FastifyReply, FastifyRequest } from 'fastify'
import { AdminCreateUserUseCase } from './AdminCreateUserUseCase'
import { z, ZodError } from 'zod'
import { handleValidationError } from '../../../utils/handleValidationError'
import { PrismaClientValidationError } from '@prisma/client/runtime/library'

const adminCreateUserDataSchema = z.object({
  name: z.string({ required_error: 'Name is required' }),
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email format' }),
  password: z.string({ required_error: 'Password is required' }),
  role: z.enum(['ADMIN', 'USER', 'MODERATOR']).default('USER'),
})

class AdminCreateUserController {
  async handle(req: FastifyRequest, reply: FastifyReply) {
    try {
      const adminCreateUserUseCase = new AdminCreateUserUseCase()
      const dataUser = adminCreateUserDataSchema.parse(req.body)
      const data = await adminCreateUserUseCase.execute(dataUser)

      reply.status(200).send({
        success: true,
        message: 'User created successfully',
        data: data,
      })
    } catch (error) {
      if (error instanceof ZodError) {
        console.warn(`[ADMIN POST USER] Erro de validação: ${error.message}`)
        return reply.status(400).send({
          success: false,
          message: handleValidationError(error),
        })
      }

      if (error instanceof PrismaClientValidationError) {
        console.error(
          `[ADMIN POST USER] Erro de validação do Prisma: ${error.message}`
        )
        return reply.status(500).send({
          success: false,
          message: error.message,
        })
      }

      console.error(`[ADMIN POST USER] Erro inesperado: ${error}`)
      return reply.status(500).send({
        success: false,
        message: 'Internal Server Error',
      })
    }
  }
}

export { AdminCreateUserController }
