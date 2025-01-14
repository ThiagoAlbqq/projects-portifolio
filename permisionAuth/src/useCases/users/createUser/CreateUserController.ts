import { FastifyReply, FastifyRequest } from 'fastify'
import { z, ZodError } from 'zod'
import { CreateUserUseCase } from './CreateUserUseCase'
import { handleValidationError } from '../../../utils/handleValidationError'

const createUserBodySchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  role: z.enum(['ADMIN', 'USER', 'MODERATOR']),
})

class CreateUserController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      console.log(request.body)
      const { name, email, password, role } = createUserBodySchema.parse(
        request.body
      )
      const createUserUseCase = new CreateUserUseCase()
      const newUser = await createUserUseCase.execute({
        name,
        email,
        password,
        role,
      })

      reply.status(200).send(newUser)
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send(handleValidationError(error))
      }
      return reply.status(500).send(error)
    }
  }
}

export { CreateUserController }
