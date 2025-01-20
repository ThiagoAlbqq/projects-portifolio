import { Prisma } from '@prisma/client'
import { prisma } from '../../../database/prisma.config'

class AdminListUsersUseCase {
  async execute() {
    try {
      const users = await prisma.user.findMany()
      return users
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(
          `Error at list users: Prisma error code ${error.code} - ${error.message}`
        )
      }
      throw new Error(
        `Error at list users: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      )
    }
  }
}

export { AdminListUsersUseCase }
