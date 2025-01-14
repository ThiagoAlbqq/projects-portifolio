import { FastifyReply, FastifyRequest } from 'fastify'
import { z, ZodError } from 'zod'
import { DeleteUserUseCase } from './DeleteUserUseCase'
import { handleValidationError } from '../../../utils/handleValidationError'

const deleteUserBodySchema = z.object({
  id: z.number(),
})

const deleteUserTokenSchema = z.object({
  id: z.number(),
  role: z.enum(['ADMIN', 'USER', 'MODERATOR']),
})

class DeleteUserController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const token = request.user!
      const { id, role } = deleteUserTokenSchema.parse(token)

      const deleteUserUseCase = new DeleteUserUseCase()

      if (role === 'ADMIN' && request.body) {
        const deletedUserId = deleteUserBodySchema.parse(request.body)
        const deleteUser = await deleteUserUseCase.execute(deletedUserId.id)

        return reply.status(200).send({
          ok: deleteUser,
          message: `O admin de id: ${id} deletou com sucesso o usuário de id: ${deletedUserId.id}!`,
        })
      }

      const deleteUser = await deleteUserUseCase.execute(id)
      return reply.status(200).send({
        ok: deleteUser,
        message: `O usuário de id: ${id} foi deletado com sucesso!`,
      })
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send(handleValidationError(error))
      }

      console.error('Erro ao deletar usuário:', error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  }
}

export { DeleteUserController }
