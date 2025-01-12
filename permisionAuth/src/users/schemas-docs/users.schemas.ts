// Schema para respostas de erro genéricas
const errorResponseSchema = {
  type: 'object',
  properties: {
    message: {
      type: 'string',
      example: 'Invalid input data',
    },
    details: {
      type: 'array',
      items: { type: 'string' },
      example: ['Field "email" must be a valid email address'],
    },
  },
}

// Schema para respostas de erro 401 (Unauthorized)
const unauthorizedSchema = {
  type: 'object',
  properties: {
    error: {
      type: 'string',
      example: 'Token missing or invalid',
    },
  },
}

// Schema para respostas de erro 403 (Forbidden)
const forbiddenSchema = {
  type: 'object',
  properties: {
    error: {
      type: 'string',
      example: 'Access denied. ADMIN role required',
    },
  },
}

// Schema para query params ao listar usuários
const listUsersQuerySchema = {
  type: 'object',
  properties: {
    page: {
      type: 'integer',
      default: 1,
      description: 'Page number to retrieve. Must be greater than 0.',
    },
    limit: {
      type: 'integer',
      default: 10,
      description: 'Number of users per page. Maximum is 100.',
    },
  },
}

// Schema para listar usuários
export const listUsersSchema = {
  schema: {
    tags: ['Users'],
    summary: 'Lista todos os usuários',
    description: 'Requires an ADMIN token to access.',
    querystring: listUsersQuerySchema,
    response: {
      200: {
        description: 'Lista de usuários cadastrados',
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
              example: 1,
              description: 'Unique identifier for the user',
            },
            name: {
              type: 'string',
              example: 'Thiago',
              description: 'Name of the user',
            },
            email: {
              type: 'string',
              example: 'thiago@gmail.com',
              description: 'Email address of the user',
            },
            role: {
              type: 'string',
              example: 'ADMIN',
              description: 'Role assigned to the user (e.g., ADMIN or USER)',
            },
          },
        },
      },
      400: errorResponseSchema,
      401: unauthorizedSchema,
      403: forbiddenSchema,
      500: {
        description: 'Internal server error',
        type: 'object',
        properties: {
          message: { type: 'string' },
          details: { type: 'string' },
        },
      },
    },
  },
}

// Schema para criação de usuários
export const createUsersSchema = {
  schema: {
    tags: ['Users'],
    summary: 'Cria um novo usuário',
    body: {
      type: 'object',
      required: ['name', 'email', 'plainPassword', 'role'],
      properties: {
        name: { type: 'string', description: 'Name of the user' },
        email: {
          type: 'string',
          format: 'email',
          description: 'Valid email address',
        },
        plainPassword: {
          type: 'string',
          description: 'Raw password for the user',
        },
        role: {
          type: 'string',
          enum: ['ADMIN', 'USER'],
          description: 'Role to assign to the user',
        },
      },
    },
    response: {
      201: {
        description: 'User created successfully',
        type: 'object',
        properties: {
          message: { type: 'string' },
          data: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              name: { type: 'string', example: 'user' },
              email: { type: 'string', example: 'user@test.com' },
              role: { type: 'string', example: 'ADMIN' },
              lastLogout: {
                type: 'string',
                nullable: true,
                example: null,
                description: 'Timestamp of the last logout',
              },
            },
          },
        },
      },
      400: errorResponseSchema,
      500: {
        description: 'Internal server error',
        type: 'object',
        properties: {
          message: { type: 'string' },
          details: { type: 'string' },
        },
      },
    },
  },
}

// Schema para atualização de usuários
export const updateUsersSchema = {
  schema: {
    tags: ['Users'],
    summary: 'Atualiza as informações de um usuário',
    description: 'Token is necessary for this operation.',
    body: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Updated name of the user' },
        email: {
          type: 'string',
          format: 'email',
          description: 'Updated email address',
        },
        plainPassword: {
          type: 'string',
          description: 'Updated password',
        },
        role: {
          type: 'string',
          enum: ['ADMIN', 'USER'],
          description: 'Updated role of the user',
        },
      },
    },
    response: {
      201: {
        description: 'User updated successfully',
        type: 'object',
        properties: {
          message: { type: 'string' },
          data: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              name: { type: 'string', example: 'user' },
              email: { type: 'string', example: 'user@test.com' },
              role: { type: 'string', example: 'ADMIN' },
              lastLogout: {
                type: 'string',
                nullable: true,
                example: null,
              },
            },
          },
        },
      },
      400: errorResponseSchema,
      500: {
        description: 'Internal server error',
        type: 'object',
        properties: {
          message: { type: 'string' },
          details: { type: 'string' },
        },
      },
    },
  },
}

// Schema para exclusão de usuários
export const deleteUsersSchema = {
  schema: {
    tags: ['Users'],
    summary: 'Exclui um usuário',
    description: 'Token is necessary to perform this operation.',
    response: {
      201: {
        description: 'User deleted successfully',
        type: 'object',
        properties: {
          message: { type: 'string' },
          data: {
            type: 'boolean',
            description: 'Indicates if deletion was successful',
          },
        },
      },
      400: errorResponseSchema,
      500: {
        description: 'Internal server error',
        type: 'object',
        properties: {
          message: { type: 'string' },
          details: { type: 'string' },
        },
      },
    },
  },
}
