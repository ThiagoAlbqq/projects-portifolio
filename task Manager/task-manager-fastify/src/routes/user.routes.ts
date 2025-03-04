import { FastifyInstance } from 'fastify';
import { TaskController } from '../controllers/task.controller';

export default async function userRoutes(app: FastifyInstance) {
  app.get('/tasks/:userId', new TaskController().get);
  app.get('/task/:id', new TaskController().getUnique);
  app.post('/tasks', new TaskController().create);
  app.put('/tasks/:id', new TaskController().update);
  app.delete('/tasks/:id', new TaskController().delete);
}

// GET /tasks – Listar todas as tarefas do usuário autenticado.
// GET /tasks/:id – Detalhes de uma tarefa específica.
// POST /tasks – Criar uma nova tarefa.
// PUT /tasks/:id – Atualizar uma tarefa específica.
// DELETE /tasks/:id – Deletar uma tarefa específica.
