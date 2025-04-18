import { Prisma } from '@prisma/client'
import { prisma } from '../../../database/prisma.config'

class DeleteUserUseCase {
  async execute(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: { id: true, email: true },
      })
      if (!user) {
        throw new Error('User not found')
      }
      await prisma.user.delete({ where: { id } })
      return user
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(
          `Error at delete user: Prisma error code ${error.code} - ${error.message}`
        )
      }
      throw new Error(
        `Error at delete user: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      )
    }
  }
}

export { DeleteUserUseCase }
