import { FastifyReply, FastifyRequest } from 'fastify'

// Definindo os papéis
export const restricted = ['ADMIN'] as const
const general = ['ADMIN', 'MODERATOR', 'USER'] as const

// Tipo de permissões
type Role = (typeof restricted)[number] | (typeof general)[number]

// Função para verificar permissões
function hasPermission(userRoles: string[], requiredRoles: Role[]): boolean {
  // Converte userRoles para o tipo Role, assumindo que a string seja válida
  return requiredRoles.some((role) => userRoles.includes(role))
}

export default async function verificarPermissoes(
  request: FastifyRequest,
  reply: FastifyReply
) {
  // Recupera os papéis exigidos da configuração da rota
  const requiredRoles = (request.routeOptions?.config?.roles || []) as Role[]

  // Recupera o papel do usuário
  const usuario = request.user
  if (!usuario || !usuario.roles || usuario.roles.length === 0) {
    reply
      .status(403)
      .send({ error: 'Usuário não autenticado ou sem papéis definidos' })
    return
  }

  const userRoles: string[] = usuario.roles // Papéis do usuário (deve ser um array de strings)

  // Verificando permissão com base nos papéis exigidos e os papéis do usuário
  if (!hasPermission(userRoles, requiredRoles)) {
    reply.status(403).send({ error: 'Permissão insuficiente' })
    return
  }

  // Se passou pela verificação de permissões, prossiga
  console.log('Acesso permitido aos dados')
}
