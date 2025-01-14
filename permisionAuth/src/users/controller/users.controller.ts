import { z, ZodError } from 'zod'
import {
  UserCreate,
  UserServices,
  UserUpdate,
} from '../interface/users.interface'
import { UserServicesPrisma } from '../service/users.service'

class UserController {
  private userService: UserServices

  constructor() {
    this.userService = new UserServicesPrisma()
  }

  private handleValidationError(error: ZodError): void {
    throw new Error(
      `Erro de validação: ${error.errors.map((e) => e.message).join(', ')}`
    )
  }

  userCreateData = z.object({
    name: z.string().min(1, 'O nome é obrigatório'),
    email: z.string().email('E-mail inválido'),
    plainPassword: z
      .string()
      .min(6, 'A senha deve ter pelo menos 6 caracteres'),
    role: z.enum(['ADMIN', 'USER', 'MODERATOR']),
  })

  userUpdateData = z.object({
    name: z.string().min(1, 'O nome é obrigatório').optional(),
    email: z.string().email('E-mail inválido').optional(),
    plainPassword: z
      .string()
      .min(6, 'A senha deve ter pelo menos 6 caracteres')
      .optional(),
    role: z.enum(['ADMIN', 'USER', 'MODERATOR']).optional(),
  })

  async create(user: UserCreate) {
    try {
      const parseData = this.userCreateData.parse(user)
      const data = await this.userService.create(parseData)
      return data
    } catch (error) {
      if (error instanceof ZodError) {
        this.handleValidationError(error)
      }
      throw error
    }
  }

  async findUsers(limit?: number, offset?: number) {
    try {
      const data = await this.userService.findUsers(limit, offset)
      return data
    } catch (error) {
      if (error instanceof ZodError) {
        this.handleValidationError(error)
      }
      throw error
    }
  }

  async findUserById(id: number) {
    try {
      const data = await this.userService.findUserById(id)
      return data
    } catch (error) {
      if (error instanceof ZodError) {
        this.handleValidationError(error)
      }
      throw error
    }
  }

  async findUserByEmail(email: string) {
    try {
      const data = await this.userService.findUserByEmail(email)
      return data
    } catch (error) {
      if (error instanceof ZodError) {
        this.handleValidationError(error)
      }
      throw error
    }
  }

  async updateUser(id: number, user: UserUpdate) {
    try {
      const parseData = this.userUpdateData.parse(user)
      const data = await this.userService.updateUser(id, parseData)
      return data
    } catch (error) {
      if (error instanceof ZodError) {
        this.handleValidationError(error)
      }
      throw error
    }
  }

  async deleteUser(id: number) {
    try {
      const data = await this.userService.deleteUser(id)
      return data
    } catch (error) {
      if (error instanceof ZodError) {
        this.handleValidationError(error)
      }
      throw error
    }
  }
}

export { UserController }
