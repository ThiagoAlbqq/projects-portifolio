import { FastifyInstance } from 'fastify'
import JwtMiddleware from '../middlewares/jwtMiddleware'
import { CreateUserController } from '../useCases/users/createUser/CreateUserController'
import { GetUserController } from '../useCases/users/getUser/GetUserController'
import { DeleteUserController } from '../useCases/users/deleteUser/DeleteUserController'
import { UpdateUserController } from '../useCases/users/updateUser/UpdateUserController'
import { ListUsersController } from '../useCases/users/listUser/ListUsersController'
import RoleMiddleware from '../middlewares/roleMiddleware'
import { LoginController } from '../useCases/users/login/LoginController'
import { LogoutController } from '../useCases/users/logout/logoutController'
import { jwtAndLogoutMiddleware } from '../middlewares/logout.middleware'
import { RefreshController } from '../useCases/users/refresh/RefreshController'
import jwtAndRefreshMiddleware from '../middlewares/refresh.middleware'
import { authenticate } from '../middlewares/authenticate'

export async function userRoutes(app: FastifyInstance) {
  const restricted = ['ADMIN']
  const global = ['ADMIN', 'USER', 'MODERATOR']

  const createUserController = new CreateUserController()
  app.post(
    '/refactoring',
    { preHandler: authenticate },
    createUserController.handle
  )

  const deleteUserController = new DeleteUserController()
  app.delete(
    '/refactoring',
    { config: { roles: global }, preHandler: JwtMiddleware },
    deleteUserController.handle
  )

  const getUserController = new GetUserController()
  app.get(
    '/refactoring',
    {
      preHandler: [JwtMiddleware, RoleMiddleware],
      config: { roles: restricted },
    },
    getUserController.handle
  )

  const listUsersController = new ListUsersController()
  app.get(
    '/refactoring/list',
    {
      config: { roles: restricted },
      preHandler: [JwtMiddleware, RoleMiddleware],
    },
    listUsersController.handle
  )

  const updateUserController = new UpdateUserController()
  app.put(
    '/refactoring',
    { preHandler: JwtMiddleware, config: { roles: global } },
    updateUserController.handle
  )

  const loginController = new LoginController()
  app.post('/login', loginController.handle)

  const logoutController = new LogoutController()
  app.post(
    '/logout',
    { preHandler: jwtAndLogoutMiddleware, config: { roles: global } },
    logoutController.handle
  )

  const refreshController = new RefreshController()
  app.post(
    '/refresh',
    { preHandler: jwtAndRefreshMiddleware, config: { roles: global } },
    refreshController.handle
  )
}

// O ADMIN poderá deletar e criar pessoas de modo diferenciado
