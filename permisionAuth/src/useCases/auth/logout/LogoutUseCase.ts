import { prisma } from '../../../database/prisma.config'
import { verifyRefreshToken } from '../../../utils/createTokenAndRefreshToken'

interface ILogoutRequest {
  refresh: string
}

class LogoutUseCase {
  async logout({ refresh }: ILogoutRequest) {
    if (!refresh) {
      throw new Error('O refresh token é obrigatório.')
    }

    try {
      const data = await this.verifyRefreshToken({ refresh })
      await this.addTokenToBlacklist(refresh)
      console.log(`Logout realizado com sucesso para o usuário: ${data.id}`)
      return { success: true, message: 'Logout realizado com sucesso.' }
    } catch (error) {
      console.error('Erro ao realizar logout:', error)
      throw new Error(
        'Erro ao realizar logout. Verifique os logs para mais detalhes.'
      )
    }
  }

  private async verifyRefreshToken({ refresh }: ILogoutRequest) {
    const decodedToken = verifyRefreshToken(refresh)

    if (!decodedToken || !decodedToken.id) {
      throw new Error('Token inválido ou expirado.')
    }

    const refreshTokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refresh },
    })

    if (!refreshTokenRecord || !refreshTokenRecord.isValid) {
      throw new Error('O refresh token fornecido é inválido.')
    }

    return decodedToken
  }

  private async addTokenToBlacklist(token: string) {
    const tokenInBlacklist = await prisma.tokenBlackList.findUnique({
      where: { token },
    })

    if (!tokenInBlacklist) {
      await prisma.tokenBlackList.create({
        data: { token },
      })
    }
  }
}

export { LogoutUseCase }
