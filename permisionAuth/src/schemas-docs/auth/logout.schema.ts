export const logoutSchema = {
  description: 'Realiza o logout do usuário',
  tags: ['Authentication'],
  summary: 'Logout do usuário',
  security: [
    {
      bearerAuth: [],
    },
  ],
  parameters: [
    {
      name: 'Authorization',
      in: 'header',
      required: true,
      description: 'Bearer token para autenticação',
      schema: {
        type: 'string',
        example: 'Bearer <access_token>',
      },
    },
  ],
  cookies: [
    {
      name: 'refresh',
      in: 'cookie',
      required: true,
      description: 'Refresh token armazenado no cookie do cliente',
      schema: {
        type: 'string',
        example: '<refresh_token>',
      },
    },
  ],
  response: {
    200: {
      description: 'Logout realizado com sucesso',
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
        message: {
          type: 'string',
          example: 'Logout successful',
        },
      },
      headers: {
        'Set-Cookie': {
          description: 'Clear the refresh token cookie',
          schema: {
            type: 'string',
            example: 'refresh=; Path=/; Max-Age=0',
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
          example: false,
        },
        message: {
          type: 'string',
          example: 'Validation error',
        },
      },
    },
    401: {
      description: 'Erro de autenticação',
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: false,
        },
        message: {
          type: 'string',
          example: 'Invalid token or refresh token',
        },
      },
    },
    500: {
      description: 'Erro interno do servidor',
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: false,
        },
        message: {
          type: 'string',
          example: 'Internal Server Error/Prisma error',
        },
      },
    },
  },
}
