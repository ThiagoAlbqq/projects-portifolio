import { FastifyReply, FastifyRequest } from 'fastify';
import { TaskUseCases } from './tasks.services';
import { TaskCreateController, taskCreateController, taskCreateService, taskUpdate } from './tasks.schema';

class TaskController {
  private taskUseCases: TaskUseCases;

  constructor() {
    this.taskUseCases = new TaskUseCases();
    this.get = this.get.bind(this);
    this.getUnique = this.getUnique.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async getUnique(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: number };
    const userId = req.user?.id;
    if (!userId) {
      return reply.status(500).send({ success: false, message: 'Erro interno do servidor' });
    }
    const data = await this.taskUseCases.getUnique(userId, Number(id));
    reply.status(data.success ? 200 : 500).send(data);
  }

  async get(req: FastifyRequest, reply: FastifyReply) {
    const userId = req.user?.id;
    if (!userId) {
      return reply.status(500).send({ success: false, message: 'Erro interno do servidor' });
    }
    const data = await this.taskUseCases.get(userId);
    reply.status(data.success ? 200 : 500).send(data);
  }

  async create(req: FastifyRequest<{ Body: TaskCreateController }>, reply: FastifyReply) {
    req.user = { id: '1d9c07e7-534f-4625-a550-324952c0c604', role: 'ADMIN' };
    const userId = req.user?.id;
    if (!userId) {
      return reply.status(500).send({ success: false, message: 'Erro interno do servidor' });
    }
    const task = taskCreateService.parse({ userId, ...req.body });
    const data = await this.taskUseCases.create(task);
    reply.status(data.success ? 200 : 500).send(data);
  }

  async update(req: FastifyRequest, reply: FastifyReply) {
    const userId = req.user?.id;
    if (!userId) {
      return reply.status(500).send({ success: false, message: 'Erro interno do servidor' });
    }
    const { id } = req.params as { id: number };
    const task = taskUpdate.parse(req.body);
    const data = await this.taskUseCases.update({ userId, id: Number(id), ...task });
    reply.status(data.success ? 200 : 500).send(data);
  }

  async delete(req: FastifyRequest, reply: FastifyReply) {
    const userId = req.user?.id;
    if (!userId) {
      return reply.status(500).send({ success: false, message: 'Erro interno do servidor' });
    }
    const { id } = req.params as { id: number };
    const data = await this.taskUseCases.delete(userId, Number(id));
    reply.status(data.success ? 200 : 500).send(data);
  }
}

export { TaskController };
