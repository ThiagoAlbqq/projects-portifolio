import { FastifyInstance } from 'fastify'
import { AdminCreateUserController } from '../useCases/admin/createUser/AdminCreateUserController'
import { AdminGetUserController } from '../useCases/admin/getUser/AdminGetUserController'
import { AdminListUsersController } from '../useCases/admin/listUsers/AdminListUsersController'
import { AdminUpdateUserController } from '../useCases/admin/updateUser/AdminUpdateUserController'
import { AdminDeleteUserController } from '../useCases/admin/deleteUser/AdminDeleteUserController'
import { authenticate } from '../middlewares/authenticate'
import RoleMiddleware from '../middlewares/roleMiddleware'

export async function adminRoutes(app: FastifyInstance) {
  const authenticateAndAuthorized = [authenticate, RoleMiddleware]
  const restricted = ['ADMIN']

  app.post(
    '/admin/user',
    { preHandler: authenticateAndAuthorized, config: { roles: restricted } },
    new AdminCreateUserController().handle
  )
  app.get(
    '/admin/user',
    { preHandler: authenticateAndAuthorized, config: { roles: restricted } },
    new AdminGetUserController().handle
  )
  app.get(
    '/admin/users',
    { preHandler: authenticateAndAuthorized, config: { roles: restricted } },
    new AdminListUsersController().handle
  )
  app.put(
    '/admin/user/:id',
    { preHandler: authenticateAndAuthorized, config: { roles: restricted } },
    new AdminUpdateUserController().handle
  )
  app.delete(
    '/admin/user/:id',
    { preHandler: authenticateAndAuthorized, config: { roles: restricted } },
    new AdminDeleteUserController().handle
  )
}
