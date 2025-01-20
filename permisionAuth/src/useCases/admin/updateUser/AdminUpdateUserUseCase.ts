import { Prisma } from '@prisma/client'
import { prisma } from '../../../database/prisma.config'
import { createPassword } from '../../../utils/createPassword'

interface IUserRequest {
  id: string
  name?: string
  email?: string
  password?: string
  role?: 'ADMIN' | 'USER' | 'MODERATOR'
}

class AdminUpdateUserUseCase {
  async execute(data: IUserRequest) {
    try {
      const { id, email, name, password, role } = data

      if (email) {
        const isNotUniqueEmail = await prisma.user.findFirst({
          where: {
            email,
            NOT: { id },
          },
        })

        if (isNotUniqueEmail) {
          throw new Error('Email already exists!')
        }
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(email && { email }),
          ...(password && { password: await createPassword(password) }),
          ...(role && { role }),
        },
      })

      return updatedUser
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(
          `Error at update user: Prisma error code ${error.code} - ${error.message}`
        )
      }
      throw new Error(
        `Error at update user: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      )
    }
  }
}

export { AdminUpdateUserUseCase }
