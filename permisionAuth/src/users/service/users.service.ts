import { Prisma } from '@prisma/client'
import { prisma } from '../database/prisma.config'
import {
  UserCreate,
  UserSafe,
  UserServices,
  UserUpdate,
} from '../interface/users.interface'
import bcrypt from 'bcrypt'
import { UserNotFound } from '../errors/errors'

class UserServicesPrisma implements UserServices {
  // Método para criar um usuário
  async create(user: UserCreate): Promise<UserSafe> {
    try {
      const passwordHash = await bcrypt.hash(user.plainPassword, 10)
      const result = await prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: passwordHash,
          role: user.role,
        },
      })
      return result
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

  // Método para encontrar um usuário pelo ID
  async findUserById(id: number): Promise<UserSafe | null> {
    try {
      const result = await prisma.user.findFirst({
        where: { id },
        select: { id: true, name: true, email: true, role: true },
      })
      if (!result) {
        throw new UserNotFound()
      }
      return result
    } catch (error) {
      console.error('Error:', error)
      if (error instanceof UserNotFound) {
        throw error
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(
          `Error at find user by ID: Prisma error code ${error.code} - ${error.message}`
        )
      }
      throw new Error(
        `Unknown error at find user by ID: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      )
    }
  }

  // Método para encontrar um usuário pelo email
  async findUserByEmail(email: string): Promise<UserSafe | null> {
    try {
      const result = await prisma.user.findFirst({ where: { email } })
      if (!result) {
        throw new UserNotFound()
      }
      return result
    } catch (error) {
      if (error instanceof UserNotFound) {
        throw error
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(
          `Error at find user by email: Prisma error code ${error.code} - ${error.message}`
        )
      }
      throw new Error(
        `Unknown error at find user by email: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      )
    }
  }

  // Método para encontrar todos os usuários com limitação e paginação
  async findUsers(limit?: number, offset?: number): Promise<UserSafe[]> {
    try {
      const result = await prisma.user.findMany({
        take: limit,
        skip: offset,
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

  // Método para atualizar um usuário
  async updateUser(id: number, user: UserUpdate): Promise<UserSafe> {
    try {
      // Desestruturação para melhor legibilidade
      const { name, email, plainPassword, role } = user

      // Validação inicial
      if (!id) {
        throw new Error('ID is required for updating the user')
      }

      // Hash da senha, se for fornecida
      let passwordHash: string | undefined
      if (plainPassword) {
        passwordHash = await bcrypt.hash(plainPassword, 10)
      }

      // Atualização do usuário
      const result = await prisma.user.update({
        where: { id },
        data: {
          ...(name && { name: name }),
          ...(role && { role: role }),
          ...(email && { email: email }),
          ...(plainPassword && { password: passwordHash }),
        },
      })

      return result
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(
          `Error at update user: Prisma error code ${error.code} - ${error.message}`
        )
      }
      throw new Error(
        `Unknown error at update user: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      )
    }
  }

  // Método para deletar um usuário
  async deleteUser(id: number): Promise<boolean> {
    try {
      const userExists = await prisma.user.findFirst({ where: { id } })
      if (!userExists) {
        throw new Error('User not found')
      }
      await prisma.user.delete({
        where: { id: id },
      })
      return true
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(
          `Error at delete user: Prisma error code ${error.code} - ${error.message}`
        )
      }
      throw new Error(
        `Unknown error at delete user: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      )
    }
  }
}

export { UserServicesPrisma }
