import { prisma } from '../../../database/prisma.config'
import {
  createToken,
  verifyToken,
} from '../../../utils/createTokenAndRefreshToken'

async function isTokenBlacklisted(token: string): Promise<boolean> {
  const blacklistEntry = await prisma.tokenBlackList.findUnique({
    where: { token },
  })
  return blacklistEntry !== null
}

interface IRefreshRequest {
  token: string
  refresh: string
}

class RefreshUseCase {
  private getTokenExpirationTime(): number {
    return Number(process.env.TOKEN_EXPIRATION_TIME || 3600)
  }
  async refresh({ token, refresh }: IRefreshRequest) {
    try {
      const tokenIsBlackListed = await isTokenBlacklisted(token)
      if (tokenIsBlackListed) throw new Error('Token inválido')

      const decodedToken = verifyToken(token)
      if (!decodedToken || !decodedToken.id || !decodedToken.email) {
        throw new Error('Token inválido ou expirado')
      }

      const refreshTokenIsValid = await prisma.refreshToken.findUnique({
        where: { token: refresh, isValid: true, userId: decodedToken.id },
      })
      if (!refreshTokenIsValid) {
        throw new Error('Refresh token is not valid')
      }

      const user = await prisma.user.findUnique({
        where: { id: decodedToken.id },
      })

      if (!user) {
        throw new Error('User not found')
      }

      const newToken = this.createNewToken(user.id, user.role)

      const expiresAt = new Date(
        Date.now() + this.getTokenExpirationTime() * 1000
      )
      await this.updateUserSession(token, newToken, expiresAt)

      return newToken
    } catch (error) {
      console.error('Erro ao tentar refresh do token:', error)
      throw new Error('Falha ao renovar o token')
    }
  }

  private createNewToken(userId: number, role: string): string {
    return createToken(
      { id: userId, role: role },
      this.getTokenExpirationTime()
    )
  }

  private async updateUserSession(
    oldToken: string,
    newToken: string,
    expiresAt: Date
  ): Promise<void> {
    await prisma.userSessions.update({
      where: { token: oldToken },
      data: { token: newToken, expiresAt },
    })
  }
}

export { RefreshUseCase }
