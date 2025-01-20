import { FastifyReply, FastifyRequest } from 'fastify'
import { AdminListUsersUseCase } from './AdminListUsersUseCase'

class AdminListUsersController {
  async handle(req: FastifyRequest, reply: FastifyReply) {
    try {
      const adminListUsersUseCase = new AdminListUsersUseCase()
      const users = await adminListUsersUseCase.execute()
      reply.status(200).send({
        success: true,
        data: users,
      })
    } catch (error) {
      return reply.status(500).send({
        success: false,
        message:
          error instanceof Error ? error.message : 'An unknown error occurred',
      })
    }
  }
}

export { AdminListUsersController }
