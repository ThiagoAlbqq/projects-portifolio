import { Prisma } from '@prisma/client'
import { prisma } from '../../../database/prisma.config'
import bcrypt from 'bcrypt'
import { createPassword } from '../../../utils/createPassword'

interface IUserRequest {
  name: string
  email: string
  password: string
  role?: 'ADMIN' | 'USER' | 'MODERATOR'
}

class AdminCreateUserUseCase {
  async execute({ name, email, password, role }: IUserRequest) {
    try {
      const isNotUniqueEmail = await prisma.user.findUnique({
        where: { email },
      })

      if (isNotUniqueEmail) {
        throw new Error('Email already exists')
      }

      const passwordHash = await createPassword(password)

      const data = await prisma.user.create({
        data: {
          name,
          email,
          password: passwordHash,
          ...(role && { role: role }),
        },
      })
      return data
    } catch (error) {
      console.error('Erro no Prisma:', error)
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(
          `Error at create user: Prisma error code ${error.code} - ${error.message}`
        )
      }
      throw new Error(
        `Error at create user: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      )
    }
  }
}

export { AdminCreateUserUseCase }
