import { FastifyInstance } from 'fastify'
import { CreateUserController } from '../useCases/users/createUser/CreateUserController'
import { GetUserController } from '../useCases/users/getUser/GetUserController'
import { DeleteUserController } from '../useCases/users/deleteUser/DeleteUserController'
import { UpdateUserController } from '../useCases/users/updateUser/UpdateUserController'
import RoleMiddleware from '../middlewares/roleMiddleware'
import { authenticate } from '../middlewares/authenticate'

export async function userRoutes(app: FastifyInstance) {
  const global = ['ADMIN', 'USER', 'MODERATOR']

  const authenticateAndAuthorized = [authenticate, RoleMiddleware]

  app.get(
    '/user',
    { preHandler: authenticateAndAuthorized, config: { roles: global } },
    new GetUserController().handle
  )

  app.post('/users', new CreateUserController().handle)

  app.put(
    '/user',
    { preHandler: authenticateAndAuthorized, config: { roles: global } },
    new UpdateUserController().handle
  )

  app.delete(
    '/user',
    {
      preHandler: authenticateAndAuthorized,
      config: { roles: global },
    },
    new DeleteUserController().handle
  )
}
