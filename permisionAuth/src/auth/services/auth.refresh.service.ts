import { prisma } from '../../users/database/prisma.config'
import { refresh, tokenSession } from '../interfaces/auth.interface'
import { createRefreshToken, createToken, verifyToken } from '../jwt/auth.jwt'

/**
 * Verifica se o token está na lista negra de tokens.
 * @param token - Token a ser verificado.
 * @returns Verdadeiro se o token estiver na lista negra, falso caso contrário.
 */
async function isTokenBlacklisted(token: string): Promise<boolean> {
  const blacklistEntry = await prisma.tokenBlackList.findUnique({
    where: { token },
  })
  return blacklistEntry !== null
}

/**
 * Serviço de renovação de tokens.
 */
class RefreshService implements refresh {
  /**
   * Obtém o tempo de expiração do token de acesso.
   * @returns Tempo de expiração do token de acesso.
   */
  private getTokenExpirationTime(): number {
    return Number(process.env.TOKEN_EXPIRATION_TIME || 3600)
  }

  /**
   * Obtém o tempo de expiração do refresh token.
   * @returns Tempo de expiração do refresh token.
   */
  private getRefreshTokenExpirationTime(): number {
    return Number(process.env.REFRESH_TOKEN_EXPIRATION_TIME || 604800)
  }

  /**
   * Renova um token de acesso usando o refresh token.
   * @param token - Token de acesso a ser renovado.
   * @param refreshToken - Token de refresh utilizado para gerar um novo token de acesso.
   * @returns O novo token de acesso gerado.
   * @throws Erros relacionados à validade do token ou do refresh token.
   */
  async refresh(
    token: tokenSession,
    refreshToken: tokenSession
  ): Promise<tokenSession> {
    try {
      // Verificar se o token de acesso está na lista negra
      const tokenIsBlackListed = await isTokenBlacklisted(token)
      if (tokenIsBlackListed) throw new Error('Token inválido')

      // Verificar a validade do token de acesso
      const decodedToken = verifyToken(token)
      if (!decodedToken || !decodedToken.id || !decodedToken.email) {
        throw new Error('Token inválido ou expirado')
      }

      // Validar o refresh token
      const refreshTokenIsValid = await prisma.refreshToken.findUnique({
        where: { token: refreshToken, isValid: true, userId: decodedToken.id },
      })
      if (!refreshTokenIsValid) {
        throw new Error('Refresh token is not valid')
      }

      console.log('------------')
      console.log(decodedToken.id)
      console.log('------------')
      const user = await prisma.user.findUnique({
        where: { id: decodedToken.id },
      })

      if (!user) {
        throw new Error('User not found')
      }

      // Gerar o novo token de acesso
      const newToken = this.createNewToken(user.id, user.email, user.role)

      // Atualizar a sessão do usuário com o novo token
      const expiresAt = new Date(
        Date.now() + this.getTokenExpirationTime() * 1000
      )
      await this.updateUserSession(token, newToken, expiresAt)

      // Gerar o novo refresh token (opcional)
      // const newRefreshToken = this.createNewRefreshToken(decodedToken.id)

      // Atualizar o refresh token na base de dados (caso gere um novo refresh token)
      // await this.updateRefreshToken(refreshToken, newRefreshToken)

      return newToken
    } catch (error) {
      console.error('Erro ao tentar refresh do token:', error)
      throw new Error('Falha ao renovar o token')
    }
  }

  /**
   * Cria um novo token de acesso.
   * @param userId - ID do usuário.
   * @param userEmail - E-mail do usuário.
   * @returns O novo token de acesso.
   */
  private createNewToken(
    userId: number,
    userEmail: string,
    role: string
  ): string {
    return createToken(
      { id: userId, email: userEmail, role: role },
      this.getTokenExpirationTime()
    )
  }

  /**
   * Cria um novo refresh token.
   * @param userId - ID do usuário.
   * @returns O novo refresh token.
   */
  private createNewRefreshToken(userId: string): string {
    return createRefreshToken(
      { id: userId },
      this.getRefreshTokenExpirationTime()
    )
  }

  /**
   * Atualiza a sessão do usuário com o novo token.
   * @param oldToken - Token antigo.
   * @param newToken - Novo token.
   * @param expiresAt - Data de expiração do novo token.
   */
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

  /**
   * Atualiza o refresh token na base de dados.
   * @param oldRefreshToken - Refresh token antigo.
   * @param newRefreshToken - Novo refresh token.
   */
  private async updateRefreshToken(
    oldRefreshToken: string,
    newRefreshToken: string
  ): Promise<void> {
    await prisma.refreshToken.update({
      where: { token: oldRefreshToken },
      data: { token: newRefreshToken },
    })
  }
}

export { RefreshService }
