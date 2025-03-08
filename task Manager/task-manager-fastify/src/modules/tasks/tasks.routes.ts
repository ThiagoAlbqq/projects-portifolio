import { FastifyInstance } from 'fastify';
import { TaskController } from './tasks.controller';

export default async function tasksRoutes(app: FastifyInstance) {
  const tasksController = new TaskController();

  app.get('/tasks/:id', tasksController.get);
  app.post('/tasks', tasksController.create);
  app.put('/tasks/:id', tasksController.update);
  app.delete('/tasks/:id', tasksController.delete);
}
