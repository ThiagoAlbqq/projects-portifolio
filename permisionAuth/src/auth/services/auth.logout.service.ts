import { prisma } from '../../users/database/prisma.config'
import { logout, tokenSession } from '../interfaces/auth.interface'
import { verifyToken } from '../jwt/auth.jwt'

class LogoutService implements logout {
  /**
   * Realiza o logout do usuário, invalidando o token e refresh token.
   * @param token - O token de sessão do usuário.
   * @param refreshToken - O refresh token associado à sessão do usuário.
   * @returns Boolean - Retorna true se o logout for bem-sucedido.
   */
  async logout(
    token: tokenSession,
    refreshToken: tokenSession
  ): Promise<boolean> {
    try {
      // Verificar a validade da sessão
      const session = await this.getSession(token)
      this.verifyTokenData(token)

      // Verificar a validade do refresh token
      await this.verifyRefreshToken(refreshToken, token)

      // Invalidar sessão e adicionar token à blacklist
      await this.invalidateSession(token)
      await this.addTokenToBlacklist(token)

      return true
    } catch (error) {
      console.error('Erro ao realizar logout:', error)
      throw error
    }
  }

  private async getSession(token: tokenSession) {
    const session = await prisma.userSessions.findUnique({
      where: { token, isValid: true },
    })
    if (!session) throw new Error('Sessão não encontrada')
    return session
  }

  private verifyTokenData(token: tokenSession) {
    const decodedToken = verifyToken(token)
    if (!decodedToken || !decodedToken.id || !decodedToken.email) {
      throw new Error('Token inválido ou expirado')
    }
  }

  private async verifyRefreshToken(
    refreshToken: tokenSession,
    token: tokenSession
  ) {
    const decodedToken = verifyToken(token)
    const refreshTokenIsValid = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    })

    if (
      !refreshTokenIsValid ||
      !refreshTokenIsValid.isValid ||
      refreshTokenIsValid.userId !== decodedToken.id
    ) {
      throw new Error('Refresh token inválido')
    }
  }

  private async invalidateSession(token: tokenSession) {
    await prisma.userSessions.update({
      where: { token },
      data: { isValid: false },
    })
  }

  private async addTokenToBlacklist(token: tokenSession) {
    await prisma.tokenBlackList.create({
      data: { token },
    })
  }
}

export { LogoutService }
