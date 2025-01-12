import { FastifyInstance, FastifyRequest } from 'fastify'
import { UserController } from '../controller/users.controller'
import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'
import { UserCreate, UserUpdate } from '../interface/users.interface'
import jwtMiddleware from '../../middleware/auth.middleware'
import verificarPermissoes from '../../middleware/auth.permission.middleware'
import {
  createUsersSchema,
  deleteUsersSchema,
  listUsersSchema,
  updateUsersSchema,
} from '../schemas-docs/users.schemas'

const restricted = ['ADMIN']
const general = ['ADMIN', 'MODERATOR', 'USER']

export async function userRoutes(app: FastifyInstance) {
  const userController = new UserController()

  //Metodo FindUsersById e FindUsersByEmail
  app.get<{ Querystring: { email: string; id: string } }>(
    '/',
    {
      schema: listUsersSchema.schema,
      preHandler: [jwtMiddleware, verificarPermissoes],
      config: { roles: restricted },
    },
    async (req, reply) => {
      let data: any = null

      try {
        if (req.query.id) {
          data = await userController.findUserById(Number(req.query.id))
          console.log(req.query.id)
        } else if (req.query.email) {
          data = await userController.findUserByEmail(req.query.email)
        } else {
          reply
            .status(400)
            .send({ message: 'Missing email or id query parameter' })
          return
        }
        reply.status(200).send(data)
      } catch (error) {
        console.log(error)
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          reply
            .status(503)
            .send({ message: 'Database error', details: error.message })
        } else if (error instanceof ZodError) {
          reply
            .status(400)
            .send({ message: 'Invalid request data', details: error.errors })
        } else {
          reply.status(500).send({
            message: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error',
          })
        }
      }
    }
  )

  //Metodo Create
  app.post<{ Body: UserCreate }>(
    '/',
    { schema: createUsersSchema.schema },
    async (req, reply) => {
      try {
        if (!req.body) {
          return reply.status(400).send({
            message: 'User data is required',
          })
        }
        const data = await userController.create(req.body)
        reply.status(201).send({
          message: 'User created successfully',
          data: data,
        })
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          reply.status(503).send({
            message: 'Database error',
            details: error.message,
            code: error.code,
          })
        } else if (error instanceof ZodError) {
          reply.status(400).send({
            message: 'Invalid request data',
            details: error.errors,
          })
        } else {
          reply.status(500).send({
            message: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error',
          })
        }
      }
    }
  )

  //Metodo Update
  app.put<{ Body: UserUpdate }>(
    '/',
    {
      schema: updateUsersSchema.schema,
      preHandler: [jwtMiddleware, verificarPermissoes],
      config: { roles: general },
    },
    async (req, reply) => {
      try {
        const { id } = req.user!
        console.log(id)
        console.log(req.body)
        if (!req.body || !id) {
          return reply.status(400).send({
            message: 'User data is required',
          })
        }

        const data = await userController.updateUser(Number(id), req.body)
        reply.status(200).send({
          message: 'User updated successfully',
          data: data,
        })
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          reply.status(503).send({
            message: 'Database error',
            details: error.message,
            code: error.code,
          })
        } else if (error instanceof ZodError) {
          reply.status(400).send({
            message: 'Invalid request data',
            details: error.errors,
          })
        } else {
          reply.status(500).send({
            message: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error',
          })
        }
      }
    }
  )

  //Metodo Delete
  app.delete(
    '/',
    {
      schema: deleteUsersSchema.schema,
      preHandler: [jwtMiddleware, verificarPermissoes],
      config: { roles: general },
    },
    async (req, reply) => {
      try {
        const { id } = req.user!
        if (!id) {
          return reply.status(400).send({
            message: 'User data is required',
          })
        }
        const data = await userController.deleteUser(Number(id))
        reply.status(200).send({
          message: 'User deleted successfully',
          data: data,
        })
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          reply.status(503).send({
            message: 'Database error',
            details: error.message,
            code: error.code,
          })
        } else if (error instanceof ZodError) {
          reply.status(400).send({
            message: 'Invalid request data',
            details: error.errors,
          })
        } else {
          reply.status(500).send({
            message: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error',
          })
        }
      }
    }
  )
}
