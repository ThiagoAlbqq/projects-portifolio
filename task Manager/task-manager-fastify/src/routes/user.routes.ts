import { FastifyInstance } from 'fastify';
import { TaskController } from '../controllers/task.controller';

export default async function userRoutes(app: FastifyInstance) {
  const taskController = new TaskController();

  app.get('/tasks/:userId', taskController.get);
  app.get('/task/:id', taskController.getUnique);
  app.post('/tasks', taskController.create);
  app.put('/tasks/:id', taskController.update);
  app.delete('/tasks/:id', taskController.delete);
}

// GET /tasks – Listar todas as tarefas do usuário autenticado.
// GET /tasks/:id – Detalhes de uma tarefa específica.
// POST /tasks – Criar uma nova tarefa.
// PUT /tasks/:id – Atualizar uma tarefa específica.
// DELETE /tasks/:id – Deletar uma tarefa específica.
