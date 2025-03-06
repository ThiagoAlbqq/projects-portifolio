import { FastifyInstance } from 'fastify';
import { TaskController } from '../controllers/task.controller';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middlewares/authenticate';

async function userTasksRoutes(app: FastifyInstance) {
  const taskController = new TaskController();

  app.get('/', taskController.get);
  app.get('/:id', taskController.getUnique);
  app.post('/', taskController.create);
  app.put('/:id', taskController.update);
  app.delete('/:id', taskController.delete);
}

async function userConfigRoutes(app: FastifyInstance) {
  const userController = new UserController();
  app.get('/user', { preValidation: [authenticate] }, userController.getUser);
  // app.put("/", userController.updateUser)
  // app.delete("/", userController.deleteUser)
}

export { userTasksRoutes, userConfigRoutes };

// GET /tasks – Listar todas as tarefas do usuário autenticado.
// GET /tasks/:id – Detalhes de uma tarefa específica.
// POST /tasks – Criar uma nova tarefa.
// PUT /tasks/:id – Atualizar uma tarefa específica.
// DELETE /tasks/:id – Deletar uma tarefa específica.
