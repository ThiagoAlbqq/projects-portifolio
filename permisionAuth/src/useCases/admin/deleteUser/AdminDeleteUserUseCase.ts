import { Prisma } from '@prisma/client'
import { prisma } from '../../../database/prisma.config'

class AdminDeleteUserUseCase {
  async execute(id: string) {
    try {
      const isUserExists = await prisma.user.findUnique({ where: { id } })

      if (!isUserExists) {
        throw new Error('User not found')
      }

      const data = await prisma.user.delete({ where: { id } })
      return data
    } catch (error) {
      console.log(error)
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

export { AdminDeleteUserUseCase }
