import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import RoleMiddleware, { restricted } from '../middlewares/roleMiddleware'
import JwtMiddleware from '../middlewares/jwtMiddleware'
import { authenticate } from '../middlewares/authenticate'
import { newAuthenticate } from '../middlewares/authenticate'
import { ListUsersController } from '../useCases/users/listUser/ListUsersController'

export default async function privateRoutes(app: FastifyInstance) {
  app.get(
    '/private',
    {
      preHandler: [authenticate, RoleMiddleware],
      config: { roles: ['ADMIN'] },
    },
    async (req: FastifyRequest, reply: FastifyReply) => {
      console.log('------------------------------------')
      console.log(
        `Parabens, o usuario de ID: ${req.user?.id} e ROLE: ${req.user?.role} está logado!`
      )
      console.log('------------------------------------')
    }
  )
}
