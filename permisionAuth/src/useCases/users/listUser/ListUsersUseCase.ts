import { Prisma } from '@prisma/client'
import { prisma } from '../../../database/prisma.config'

class ListUsersUseCase {
  async listUsers(limit?: number, offset?: number) {
    try {
      const result = await prisma.user.findMany({
        take: limit || 5,
        skip: offset || 0,
        select: { id: true, name: true, email: true, role: true },
      })
      return result
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(
          `Error at find users: Prisma error code ${error.code} - ${error.message}`
        )
      }
      throw new Error(
        `Unknown error at find users: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      )
    }
  }
}

export { ListUsersUseCase }
