import { JwtPayload } from 'jsonwebtoken'
import { prisma } from '../../../database/prisma.config'
import {
  createToken,
  verifyRefreshToken,
} from '../../../utils/createTokenAndRefreshToken'

interface IRefreshRequest {
  token: string
  refresh: string
}

class RefreshUseCase {
  async verifyValidateOfRefreshToken(refresh: string) {
    return await prisma.refreshToken.findFirst({
      where: { token: refresh, isValid: true },
    })
  }

  private getTokenExpirationTime(): number {
    const expiration = Number(process.env.TOKEN_EXPIRATION_TIME || 3600)
    return !isNaN(expiration) && expiration > 0 ? expiration : 3600
  }

  async refresh({ token, refresh }: IRefreshRequest) {
    try {
      const decodedToken = verifyRefreshToken(refresh)

      if (!decodedToken || !decodedToken.id) {
        throw new Error('Token inválido ou expirado. Faça login novamente.')
      }

      const refreshTokenIsValid = await this.verifyValidateOfRefreshToken(
        refresh
      )

      if (!refreshTokenIsValid) {
        throw new Error('O refresh token é inválido. Faça login novamente.')
      }

      const user = await prisma.user.findUnique({
        where: { id: decodedToken.id },
      })

      if (!user) {
        throw new Error('Usuário não encontrado. Faça login novamente.')
      }

      const newToken = this.createNewToken(user.id, user.role)

      return {
        token: newToken,
      }
    } catch (error) {
      console.error('Erro ao tentar renovar o token')
      throw new Error('Falha ao renovar o token. Faça login novamente.')
    }
  }

  private createNewToken(userId: number, role: string): string {
    return createToken(
      { id: userId, role: role },
      this.getTokenExpirationTime()
    )
  }
}

export { RefreshUseCase }
