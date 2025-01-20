export const loginSchema = {
  description: 'Realiza o login do usuário',
  tags: ['Authentication'],
  summary: 'Login de usuário com email e senha',
  body: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        format: 'email',
        description: 'Endereço de e-mail do usuário',
      },
      password: {
        type: 'string',
        description: 'Senha do usuário',
      },
    },
  },
  response: {
    200: {
      description: 'Login realizado com sucesso',
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: 'true',
        },
        message: {
          type: 'string',
          example: 'User successfully logged in',
        },
        data: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'Token de autenticação do usuário',
            },
            refresh: {
              type: 'string',
              description: 'Refresh token com validade de 7 dias',
            },
          },
        },
      },
    },
    400: {
      description: 'Erro de validação de dados',
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: 'false',
        },
        message: {
          type: 'string',
        },
      },
    },
    401: {
      description: 'Erro de validação de credenciais',
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: 'false',
        },
        message: {
          type: 'string',
          example: 'Invalid email or password',
        },
      },
    },
    500: {
      description: 'Erro de validação PRISMA/ Internal Server Error',
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: 'false',
        },
        message: {
          type: 'string',
          example: 'Internal Server Error/ Prisma error',
        },
      },
    },
  },
}
