import { FastifyReply, FastifyRequest } from 'fastify'
import { z, ZodError } from 'zod'
import { handleValidationError } from '../../../utils/handleValidationError'
import { UpdateUserUseCase } from './UpdateUserUseCase'

const authenticatedUser = z.object({
  id: z.string(),
  role: z.enum(['ADMIN', 'USER', 'MODERATOR']),
})

const updateUserBodySchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório').optional(),
  email: z.string().email('E-mail inválido').optional(),
  password: z
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .optional(),
  role: z.enum(['ADMIN', 'USER', 'MODERATOR']).optional(),
})

class UpdateUserController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const onUser = authenticatedUser.parse(request.user!)

      const { email, name, password } = updateUserBodySchema.parse(
        request.body!
      )

      const updatedUser = await new UpdateUserUseCase().execute({
        id: onUser.id,
        email,
        name,
        password,
      })

      return reply.status(200).send({
        succes: true,
        message: 'User updated successfully',
        data: updatedUser,
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

export { UpdateUserController }
