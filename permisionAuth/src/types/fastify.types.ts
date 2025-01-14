import { FastifyRequest } from 'fastify'

// Extende o FastifyRequest para incluir a propriedade userId
declare module 'fastify' {
  interface FastifyRequest {
    user?: { id: string; role: string }
    tokens?: { token: string; refresh: string }
    Querystring: { id?: string; email?: string }
  }
  interface FastifyContextConfig {
    roles: string[]
  }
}
