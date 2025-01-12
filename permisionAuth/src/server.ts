import { config } from 'dotenv'
import fastify from 'fastify'
import { userRoutes } from './users/routes/users.routes'
import { userAuthRoutes } from './auth/routes/auth.routes'
import fastifyCookie from '@fastify/cookie'

config()
const app = fastify()

// Configuração do Swagger
app.register(import('@fastify/swagger'), {
  swagger: {
    info: {
      title: 'API Documentation',
      description: 'Documentação da API do projeto',
      version: '1.0.0',
    },
    host: 'localhost:3000',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
})

app.register(import('@fastify/swagger-ui'), {
  routePrefix: '/docs', // Caminho onde a documentação será acessada
  staticCSP: true,
  transformStaticCSP: (header) => header,
  uiConfig: {
    docExpansion: 'list', // Lista as rotas de forma aberta
    deepLinking: true,
  },
  uiHooks: {
    onRequest: (request, reply, next) => next(),
    preHandler: (request, reply, next) => next(),
  },
})

app.register(userRoutes, { prefix: '/users' })
app.register(userAuthRoutes)
app.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET || 'chaveSecreta', // Opcional: para cookies assinados
})

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000

app.listen({ port: PORT }, (err, address) => {
  if (err) {
    console.error('Error starting server', err)
    process.exit(1)
  }
  console.log(`Server is running on ${address}`)
  console.log(`Swagger docs available at ${address}/docs`)
})
