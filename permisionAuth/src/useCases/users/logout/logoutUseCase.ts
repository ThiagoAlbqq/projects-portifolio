import { prisma } from '../../../database/prisma.config'
import { verifyToken } from '../../../utils/createTokenAndRefreshToken'

interface ILogoutRequest {
  token: string
  refresh: string
}

class LogoutUseCase {
  async logout({ token, refresh }: ILogoutRequest) {
    if (!token || !refresh) {
      throw new Error('Token e refresh token são obrigatórios')
    }

    try {
      const session = await this.getSession(token)
      this.verifyTokenData(token)

      await this.verifyRefreshToken({ token, refresh })

      await this.invalidateSession(token)
      await this.addTokenToBlacklist(token)

      console.log(
        `Logout realizado com sucesso para o usuário: ${session.userId}`
      )
      return true
    } catch (error) {
      console.error('Erro ao realizar logout:', error)
      throw error
    }
  }

  private async getSession(token: string) {
    const session = await prisma.userSessions.findUnique({
      where: { token, isValid: true },
    })
    if (!session) throw new Error('Sessão não encontrada')
    return session
  }

  private verifyTokenData(token: string) {
    const decodedToken = verifyToken(token)
    if (!decodedToken || !decodedToken.id) {
      throw new Error('Token inválido ou expirado')
    }
  }

  private async verifyRefreshToken({ token, refresh }: ILogoutRequest) {
    const decodedToken = verifyToken(token)
    const refreshTokenIsValid = await prisma.refreshToken.findUnique({
      where: { token: refresh },
    })

    if (
      !refreshTokenIsValid ||
      !refreshTokenIsValid.isValid ||
      refreshTokenIsValid.userId !== decodedToken.id
    ) {
      throw new Error('Refresh token inválido')
    }
  }

  private async invalidateSession(token: string) {
    await prisma.userSessions.update({
      where: { token },
      data: { isValid: false },
    })
  }

  private async addTokenToBlacklist(token: string) {
    const existingBlacklistEntry = await prisma.tokenBlackList.findUnique({
      where: { token },
    })

    if (!existingBlacklistEntry) {
      await prisma.tokenBlackList.create({
        data: { token },
      })
    }
  }
}

export { LogoutUseCase }
