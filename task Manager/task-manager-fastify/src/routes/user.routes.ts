import { FastifyInstance } from 'fastify';
import { TaskController } from '../controllers/task.controller';

export default async function userRoutes(app: FastifyInstance) {
  const taskController = new TaskController();

  app.get('/', taskController.get);
  app.get('/:id', taskController.getUnique);
  app.post('/', taskController.create);
  app.put('/:id', taskController.update);
  app.delete('/:id', taskController.delete);
}

// GET /tasks – Listar todas as tarefas do usuário autenticado.
// GET /tasks/:id – Detalhes de uma tarefa específica.
// POST /tasks – Criar uma nova tarefa.
// PUT /tasks/:id – Atualizar uma tarefa específica.
// DELETE /tasks/:id – Deletar uma tarefa específica.
