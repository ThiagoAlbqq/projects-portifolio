import { FastifyReply, FastifyRequest } from 'fastify'
import { z, ZodError } from 'zod'
import { handleValidationError } from '../../../utils/handleValidationError'
import { UpdateUserUseCase } from './UpdateUserUseCase'

const authenticatedUser = z.object({
  id: z.number(),
  role: z.enum(['ADMIN', 'USER', 'MODERATOR']),
})

const updateUserBodySchema = z.object({
  id: z.number().optional(),
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

      const { id, email, name, password, role } = updateUserBodySchema.parse(
        request.body!
      )
      if (onUser.role === 'ADMIN' && id !== onUser.id && id) {
        const updatedUser = await new UpdateUserUseCase().execute({
          id,
          email,
          name,
          password,
          role,
          authenticatedUserId: onUser.id,
        })
        return reply.status(200).send(updatedUser)
      }
      const updatedUser = await new UpdateUserUseCase().execute({
        id: onUser.id,
        email,
        name,
        password,
      })

      return reply.status(200).send(updatedUser)
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send(handleValidationError(error))
      }
      return reply.status(500).send(error)
    }
  }
}

export { UpdateUserController }
