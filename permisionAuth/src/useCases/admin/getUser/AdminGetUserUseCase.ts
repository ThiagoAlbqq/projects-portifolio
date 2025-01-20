import { Prisma } from '@prisma/client'
import { prisma } from '../../../database/prisma.config'

class AdminGetUserUseCase {
  async findByID(id: string) {
    try {
      const user = await prisma.user.findUnique({ where: { id } })
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

  async findByEmail(email: string) {
    try {
      const user = await prisma.user.findUnique({ where: { email } })
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

export { AdminGetUserUseCase }
