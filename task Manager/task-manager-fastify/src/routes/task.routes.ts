import { FastifyInstance } from 'fastify';

export default async function taskRoutes(app: FastifyInstance) {}

// /users/{userId}/tasks – Para usuários comuns, onde {userId} é o ID do usuário autenticado. Isso pode garantir que o usuário só tenha acesso às suas próprias tarefas.
// /admin/tasks – Para administradores, acessando todas as tarefas.
// /admin/users – Para administradores, acessando todos os usuários.
