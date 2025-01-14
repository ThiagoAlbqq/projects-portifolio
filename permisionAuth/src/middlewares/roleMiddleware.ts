import { FastifyReply, FastifyRequest } from 'fastify'

export const restricted = ['ADMIN'] as const
const general = ['ADMIN', 'MODERATOR', 'USER'] as const

type Role = (typeof restricted)[number] | (typeof general)[number]

export default async function RoleMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const requiredRoles = request.routeOptions?.config?.roles || ([] as Role[])

  if (requiredRoles.length === 0) {
    return reply
      .status(400)
      .send({ error: 'Nenhuma role configurada para esta rota' })
  }

  if (
    !request.user ||
    !requiredRoles.some((role) => request.user!.role.includes(role))
  ) {
    return reply.status(403).send({ error: 'Permissão insuficiente' })
  }
}
