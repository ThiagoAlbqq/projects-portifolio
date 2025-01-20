import { JsonWebTokenError } from 'jsonwebtoken'
import { prisma } from '../../../database/prisma.config'
import bcrypt from 'bcrypt'
import {
  createRefreshToken,
  createToken,
} from '../../../utils/createTokenAndRefreshToken'
import { handleError } from '../../../utils/handleError'
import {
  REFRESH_TOKEN_EXPIRATION_TIME,
  TOKEN_EXPIRATION_TIME,
} from '../../../config/config.token'
import { InvalidCredentialsError } from '../../../errors/errors'

interface ILoginRequest {
  email: string
  password: string
  ipAddress: string
}

class LoginUseCase {
  private async findUserByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } })
  }

  private async validatePassword(
    inputPassword: string,
    storedPassword: string
  ) {
    return await bcrypt.compare(inputPassword, storedPassword)
  }

  async login({ email, password, ipAddress }: ILoginRequest) {
    try {
      const user = await this.findUserByEmail(email)
      if (!user) throw new InvalidCredentialsError()

      const isValid = await this.validatePassword(password, user.password)
      if (!isValid) throw new InvalidCredentialsError()

      await prisma.refreshToken.deleteMany({
        where: {
          userId: user.id,
          ipAddress,
          isValid: true,
        },
      })

      const token = createToken(
        { id: user.id, role: user.role },
        TOKEN_EXPIRATION_TIME
      )
      const refresh = createRefreshToken(
        { id: user.id, role: user.role },
        REFRESH_TOKEN_EXPIRATION_TIME
      )

      const expiresAt = new Date(Date.now() + 3600 * 1000)

      await prisma.refreshToken.create({
        data: {
          userId: user.id,
          token: refresh,
          isValid: true,
          ipAddress,
        },
      })

      return { token, refresh, expiresAt, role: user.role }
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw handleError('Erro ao validar o token JWT', error)
      }
      console.log(error)
      throw error
    }
  }
}

export { LoginUseCase }
