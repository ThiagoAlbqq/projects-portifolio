// Mensagens de Erro
export const ERRORS = {
  NO_TOKEN: 'Access Token não fornecido',
  MALFORMED_TOKEN: 'Access Token malformado',
  INVALID_TOKEN: 'Access Token inválido ou expirado',
  NO_REFRESH_TOKEN: 'Refresh Token não fornecido',
  INVALID_REFRESH_TOKEN: 'Refresh Token inválido ou expirado',
  SERVER_ERROR: 'Erro no servidor',
  INSUFFICIENT_PERMISSIONS: 'Permissão insuficiente para acessar este recurso',
  USER_NOT_FOUND: 'Usuario não encontrado',
}

// Classes de erro personalizadas
class InvalidCredentialsError extends Error {
  constructor(message = 'Invalid email or password') {
    super(message)
    this.name = 'InvalidCredentialsError'
  }
}

class TokenExpiredError extends Error {
  constructor(message = 'O token expirou') {
    super(message)
    this.name = 'TokenExpiredError'
  }
}

class PermissionDeniedError extends Error {
  constructor(message = 'Permissão insuficiente para acessar este recurso') {
    super(message)
    this.name = 'PermissionDeniedError'
  }
}

export { InvalidCredentialsError, TokenExpiredError, PermissionDeniedError }
