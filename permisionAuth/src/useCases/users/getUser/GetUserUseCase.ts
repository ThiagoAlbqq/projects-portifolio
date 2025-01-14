import { Prisma } from '@prisma/client'
import { prisma } from '../../../database/prisma.config'

class GetUserUseCase {
  async findUserByEmail(email: string) {
    try {
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) {
        throw new Error('User not found')
      }
      return user
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(
          `Error at create user: Prisma error code ${error.code} - ${error.message}`
        )
      }
      throw new Error(
        `Unknown error at create user: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      )
    }
  }

  async findUserById(id: number) {
    try {
      const user = await prisma.user.findUnique({ where: { id } })
      if (!user) {
        throw new Error('User not found')
      }
      return user
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(
          `Error at create user: Prisma error code ${error.code} - ${error.message}`
        )
      }
      throw new Error(
        `Unknown error at create user: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      )
    }
  }
}

export { GetUserUseCase }
