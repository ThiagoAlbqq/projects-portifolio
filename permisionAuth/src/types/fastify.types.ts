import { FastifyRequest } from 'fastify'

// Extende o FastifyRequest para incluir a propriedade userId
declare module 'fastify' {
  interface FastifyRequest {
    user?: { id: string; roles: string[] }
    tokens?: { token: string; refreshToken: string }
  }
  interface FastifyContextConfig {
    roles: string[]
  }
}
