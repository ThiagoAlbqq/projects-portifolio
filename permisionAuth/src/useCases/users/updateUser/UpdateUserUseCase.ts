import { Prisma } from '@prisma/client'
import { prisma } from '../../../database/prisma.config'
import { createPassword } from '../../../utils/createPassword'

interface IUserUpdateRequest {
  id: string
  name?: string
  email?: string
  password?: string
}

class UpdateUserUseCase {
  async execute({ id, name, email, password }: IUserUpdateRequest) {
    try {
      const user = await prisma.user.findUnique({ where: { id } })
      if (!user) {
        throw new Error('User not found')
      }

      if (email) {
        const emailExists = await prisma.user.findUnique({ where: { email } })
        if (emailExists && emailExists.id !== id) {
          throw new Error('Email already in use')
        }
      }

      let dataToUpdate: any = {
        ...(name && { name }),
        ...(email && { email }),
        ...(password && { password: await createPassword(password) }),
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: dataToUpdate,
      })

      return updatedUser
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(
          `Error updating user: Prisma error code ${error.code} - ${error.message}`
        )
      }
      throw new Error(
        `Unknown error updating user: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      )
    }
  }
}

export { UpdateUserUseCase }
