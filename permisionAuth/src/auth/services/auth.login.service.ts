import { prisma } from '../../users/database/prisma.config'
import { InvalidCredentials } from '../errors/auth.errors'
import {
  Credentials,
  login,
  refreshAndToken,
} from '../interfaces/auth.interface'
import bcrypt from 'bcrypt'
import { JsonWebTokenError } from 'jsonwebtoken'
import { createRefreshToken, createToken } from '../jwt/auth.jwt'

/**
 * Função para lidar com erros de maneira mais informativa.
 * @param message - Mensagem de erro.
 * @param error - Objeto de erro.
 * @returns Um novo objeto de erro com a mensagem personalizada.
 */
function handleError(message: string, error: Error): Error {
  console.error(`${message}: ${error.name} - ${error.message}`)
  return new Error(message)
}

/**
 * Serviço de login de usuário.
 */
class LoginService implements login {
  private async findUserByEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) throw new InvalidCredentials('Usuário não encontrado')
    return user
  }

  private async validatePassword(
    inputPassword: string,
    storedPassword: string
  ) {
    const isValid = await bcrypt.compare(inputPassword, storedPassword)
    if (!isValid) throw new InvalidCredentials('Senha incorreta')
  }

  private getTokenExpirationTime(): number {
    return Number(process.env.TOKEN_EXPIRATION_TIME || 3600)
  }

  private getRefreshTokenExpirationTime(): number {
    return Number(process.env.REFRESH_TOKEN_EXPIRATION_TIME || 604800)
  }

  /**
   * Realiza o login do usuário, gerando tokens de acesso e refresh.
   * @param credentials - Dados de login do usuário.
   * @returns Objetos contendo o token de acesso e o refresh token.
   */
  async login(credentials: Credentials): Promise<refreshAndToken | null> {
    const TOKEN_EXPIRATION_TIME = this.getTokenExpirationTime()
    const REFRESH_TOKEN_EXPIRATION_TIME = this.getRefreshTokenExpirationTime()

    try {
      // Encontrar o usuário pelo e-mail
      const user = await this.findUserByEmail(credentials.email)

      // Validar a senha fornecida com a armazenada
      await this.validatePassword(credentials.password, user.password)

      // Criar os tokens
      const token = createToken(
        { id: user.id, email: user.email, role: user.role },
        TOKEN_EXPIRATION_TIME
      )
      const refreshToken = createRefreshToken(
        { id: user.id, email: user.email },
        REFRESH_TOKEN_EXPIRATION_TIME
      )

      const expiresAt = new Date(Date.now() + TOKEN_EXPIRATION_TIME * 1000)

      // Armazenar as sessões e os tokens
      await prisma.userSessions.create({
        data: {
          userId: user.id,
          token,
          isValid: true,
          expiresAt,
        },
      })

      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          isValid: true,
        },
      })

      return { token, refreshToken }
    } catch (error) {
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

export { LoginService }
