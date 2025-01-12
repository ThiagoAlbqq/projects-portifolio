export type tokenSession = string

export interface refreshAndToken {
  token: string
  refreshToken: string
}

export interface Credentials {
  email: string
  password: string
}

export interface UserSessionsData {
  userId: number
  token: string
  isValid: boolean
  expiresAt: Date
}

export interface login {
  login(creadentials: Credentials): Promise<refreshAndToken | null>
}

export interface logout {
  logout(token: tokenSession, refreshToken: tokenSession): Promise<Boolean>
}

export interface refresh {
  refresh(
    token: tokenSession,
    refreshToken: tokenSession
  ): Promise<tokenSession>
}
