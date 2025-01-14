import { JsonWebTokenError } from 'jsonwebtoken'
import { prisma } from '../../../database/prisma.config'
import bcrypt from 'bcrypt'
import {
  createRefreshToken,
  createToken,
} from '../../../utils/createTokenAndRefreshToken'
import { handleError } from '../../../utils/handleError'

interface ILoginRequest {
  email: string
  password: string
  ipAddress: string
}

class LoginUseCase {
  private async findUserByEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) throw new Error('Usuário não encontrado')
    return user
  }

  private async validatePassword(
    inputPassword: string,
    storedPassword: string
  ) {
    const isValid = await bcrypt.compare(inputPassword, storedPassword)
    if (!isValid) throw new Error('Senha incorreta')
  }

  private getTokenExpirationTime() {
    return Number(process.env.TOKEN_EXPIRATION_TIME || 3600)
  }

  private getRefreshTokenExpirationTime() {
    return Number(process.env.REFRESH_TOKEN_EXPIRATION_TIME || 604800)
  }

  async login({ email, password, ipAddress }: ILoginRequest) {
    const TOKEN_EXPIRATION_TIME = this.getTokenExpirationTime()
    const REFRESH_TOKEN_EXPIRATION_TIME = this.getRefreshTokenExpirationTime()

    try {
      const user = await this.findUserByEmail(email)

      await this.validatePassword(password, user.password)

      // Invalida o refresh token anterior para o mesmo IP
      await prisma.refreshToken.updateMany({
        where: {
          userId: user.id,
          ipAddress: ipAddress, // Verifica pelo IP
          isValid: true,
        },
        data: {
          isValid: false, // Invalida o token anterior
        },
      })

      // Invalida todas as sessões anteriores do usuário
      await prisma.userSessions.updateMany({
        where: {
          userId: user.id,
          isValid: true,
          ipAddress: ipAddress,
        },
        data: {
          isValid: false, // Marca as sessões anteriores como inválidas
        },
      })

      // Criação do novo token de acesso
      const token = createToken(
        { id: user.id, role: user.role },
        TOKEN_EXPIRATION_TIME
      )

      // Criação do novo refresh token
      const refreshToken = createRefreshToken(
        { id: user.id },
        REFRESH_TOKEN_EXPIRATION_TIME
      )

      // Data de expiração do token de acesso
      const expiresAt = new Date(Date.now() + TOKEN_EXPIRATION_TIME * 1000)

      // Criação da sessão para o usuário
      await prisma.userSessions.create({
        data: {
          userId: user.id,
          token,
          isValid: true,
          ipAddress,
          expiresAt,
        },
      })

      // Criação do novo refresh token no banco
      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          isValid: true,
          ipAddress,
        },
      })

      // Retorna os tokens
      return { token, refreshToken }
    } catch (error) {
      // Tratamento de erros
      if (error instanceof JsonWebTokenError) {
        throw handleError('JWT error occurred while logging in', error)
      }
      throw handleError(
        'Unknown error occurred while logging in',
        error as Error
      )
    }
  }
}

export { LoginUseCase }
