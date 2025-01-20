import { FastifyReply, FastifyRequest } from 'fastify'
import { z, ZodError } from 'zod'
import { CreateUserUseCase } from './CreateUserUseCase'
import { handleValidationError } from '../../../utils/handleValidationError'

const createUserBodySchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
})

class CreateUserController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const createUserUseCase = new CreateUserUseCase()
      const dataUser = createUserBodySchema.parse(request.body)
      const newUser = await createUserUseCase.execute(dataUser)

      return reply.status(200).send({
        success: true,
        message: 'User created successfully',
        data: newUser,
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

export { CreateUserController }
