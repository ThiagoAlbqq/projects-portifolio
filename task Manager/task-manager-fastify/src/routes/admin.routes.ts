import { FastifyInstance } from 'fastify';
import { AdminController } from '../controllers/admin.controller';

export default async function adminRoutes(app: FastifyInstance) {
  const adminController = new AdminController();

  app.get('/admin/users', adminController.getUsers);
}

// GET /admin/tasks – Listar todas as tarefas de todos os usuários.
// GET /admin/tasks/:id – Detalhes de uma tarefa específica, de qualquer usuário.
// PUT /admin/tasks/:id – Atualizar qualquer tarefa.
// DELETE /admin/tasks/:id – Deletar qualquer tarefa.
// GET /admin/users – Listar todos os usuários.
// POST /admin/users – Criar um novo usuário.
// DELETE /admin/users/:id – Deletar um usuário específico.
