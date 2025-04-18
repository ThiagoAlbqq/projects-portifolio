import { Prisma } from '@prisma/client'
import { prisma } from '../../../database/prisma.config'

class GetUserUseCase {
  async findUserById(id: string) {
    try {
      const user = await prisma.user.findUnique({ where: { id } })
      if (!user) {
        throw new Error('User not found')
      }
      return user
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(
          `Error at get user: Prisma error code ${error.code} - ${error.message}`
        )
      }
      throw new Error(
        `Error at get user: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      )
    }
  }
}

export { GetUserUseCase }
