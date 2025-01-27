import { FastifyReply, FastifyRequest } from 'fastify'
import { AdminListUsersUseCase } from './AdminListUsersUseCase'
import { PrismaClientValidationError } from '@prisma/client/runtime/library'

class AdminListUsersController {
  async handle(req: FastifyRequest, reply: FastifyReply) {
    try {
      const adminListUsersUseCase = new AdminListUsersUseCase()
      const users = await adminListUsersUseCase.execute()
      reply.status(200).send({
        success: true,
        message: `${users.length} users found`,
        data: users,
      })
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        console.error(
          `[ADMIN GET USERS] Erro de validação do Prisma: ${error.message}`
        )
        return reply.status(500).send({
          success: false,
          message: error.message,
        })
      }

      console.error(`[ADMIN GET USER] Erro inesperado: ${error}`)
      return reply.status(500).send({
        success: false,
        message: 'Internal Server Error',
      })
    }
  }
}

export { AdminListUsersController }
