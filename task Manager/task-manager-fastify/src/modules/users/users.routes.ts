import { FastifyInstance } from 'fastify';
import { TaskController } from '../tasks/tasks.controller';
import { UserController } from './users.controller';
import { authenticate } from '../../middlewares/authenticate';

const taskController = new TaskController();
const userController = new UserController();

export async function userTasksRoutes(app: FastifyInstance) {
  app.get('/', { preValidation: [authenticate] }, taskController.get);
  app.get('/:id', { preValidation: [authenticate] }, taskController.getUnique);
  app.post('/', { preValidation: [authenticate] }, taskController.create);
  app.put('/:id', { preValidation: [authenticate] }, taskController.update);
  app.delete('/:id', { preValidation: [authenticate] }, taskController.delete);
}

export async function userConfigRoutes(app: FastifyInstance) {
  app.get('/', { preValidation: [authenticate] }, userController.list);
  app.put('/', { preValidation: [authenticate] }, userController.update);
  app.delete('/', { preValidation: [authenticate] }, userController.delete);
}

// GET /tasks – Listar todas as tarefas do usuário autenticado.
// GET /tasks/:id – Detalhes de uma tarefa específica.
// POST /tasks – Criar uma nova tarefa.
// PUT /tasks/:id – Atualizar uma tarefa específica.
// DELETE /tasks/:id – Deletar uma tarefa específica.

// GET /user - Lista os dados do usuario loggado
// PUT /user - Modifica os dados do usuario loggado
// DELETE / user - Deleta os dados do usuario loggado
