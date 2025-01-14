import { z, ZodError } from 'zod'
import { Credentials, tokenSession } from '../interfaces/auth.interface'
import { LoginService } from '../services/auth.login.service'
import { LogoutService } from '../services/auth.logout.service'
import { RefreshService } from '../services/auth.refresh.service'

const credentialsParseData = z.object({
  email: z.string().email(),
  password: z.string(),
})

class UsersAuthController {
  private loginService: LoginService
  private logoutService: LogoutService
  private refreshService: RefreshService

  constructor() {
    this.loginService = new LoginService()
    this.logoutService = new LogoutService()
    this.refreshService = new RefreshService()
  }

  private handleValidationError(error: ZodError): void {
    throw new Error(
      `Erro de validação: ${error.errors.map((e) => e.message).join(', ')}`
    )
  }

  async login(credentials: Credentials) {
    try {
      const credentialsParse = credentialsParseData.parse(credentials)
      const token = await this.loginService.login(credentialsParse)
      return token
    } catch (error) {
      if (error instanceof ZodError) {
        this.handleValidationError(error)
      }
      throw error
    }
  }
  async logout(token: tokenSession, refreshToken: tokenSession) {
    try {
      console.log(refreshToken)
      const data = await this.logoutService.logout(token, refreshToken)
      return data
    } catch (error) {
      throw error
    }
  }

  async refresh(token: tokenSession, refreshToken: tokenSession) {
    try {
      const newToken = await this.refreshService.refresh(token, refreshToken)
      return newToken
    } catch (error) {
      throw error
    }
  }
}

export { UsersAuthController }
