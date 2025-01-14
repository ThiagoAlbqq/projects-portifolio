import { Prisma } from '@prisma/client'
import { prisma } from '../../../database/prisma.config'
import bcrypt from 'bcrypt'

interface IUserRequest {
  name: string
  email: string
  password: string
  role: 'ADMIN' | 'USER' | 'MODERATOR'
}

class CreateUserUseCase {
  async execute({ name, email, password, role }: IUserRequest) {
    try {
      const userAlreadyExists = await prisma.user.findUnique({
        where: { email },
      })
      if (userAlreadyExists) {
        throw new Error('User already exists')
      }

      const passwordHash = await bcrypt.hash(password, 10)

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: passwordHash,
          role,
        },
      })

      return newUser
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

export { CreateUserUseCase }
