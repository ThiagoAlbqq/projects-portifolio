import { FastifyInstance } from 'fastify'
import { UsersAuthController } from '../controller/auth.controller'
import { Credentials } from '../interfaces/auth.interface'
import jwtAndRefreshMiddleware from '../../middleware/refresh.middleware'
import { jwtAndLogoutMiddleware } from '../../middleware/logout.middleware'

export async function userAuthRoutes(app: FastifyInstance) {
  const userController = new UsersAuthController()

  app.post<{ Body: { credentials: Credentials } }>(
    '/login',

    async (req, reply) => {
      try {
        const token = await userController.login(req.body.credentials)
        reply.status(200).send({ token: token })
      } catch (error) {
        reply.status(500).send({
          message: 'Internal server error',
          details: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )

  app.post(
    '/logout',
    { preHandler: jwtAndLogoutMiddleware },
    async (req, reply) => {
      try {
        const { token, refreshToken } = req.tokens!
        const finalToken = await userController.logout(token, refreshToken)
        reply.status(200).send({
          token: finalToken
            ? 'Tokens invalidado com sucesso'
            : 'Erro ao invalidar tokens',
        })
      } catch (error) {
        reply.status(500).send({
          message: 'Internal server error',
          details: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )

  app.post(
    '/refresh',
    { preHandler: jwtAndRefreshMiddleware },
    async (req, reply) => {
      try {
        const { token, refreshToken } = req.tokens!
        const newToken = await userController.refresh(token, refreshToken)
        reply.status(200).send({ token: newToken })
      } catch (error) {
        reply.status(500).send({
          message: 'Internal server error',
          details: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )
}
