import { FastifyInstance } from 'fastify'
import { LoginController } from '../useCases/auth/login/LoginController'
import { LogoutController } from '../useCases/auth/logout/LogoutController'
import { RefreshController } from '../useCases/auth/refresh/RefreshController'
import { authenticate } from '../middlewares/authenticate'
import refreshMiddleware from '../middlewares/refresh.middleware'
import { loginSchema } from '../schemas-docs/auth/login.schema'
import { logoutSchema } from '../schemas-docs/auth/logout.schema'

export async function authRoutes(app: FastifyInstance) {
  app.post('/login', { schema: loginSchema }, new LoginController().handle)
  app.post(
    '/logout',
    { preHandler: authenticate },
    new LogoutController().handle
  )
  app.post(
    '/refresh',
    { preHandler: refreshMiddleware },
    new RefreshController().handle
  )
}
