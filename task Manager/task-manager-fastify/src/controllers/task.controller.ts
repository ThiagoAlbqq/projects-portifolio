import { FastifyReply, FastifyRequest } from 'fastify';
import { TaskUseCases } from '../services/task.services';
import { z } from 'zod';

const taskCreate = z.object({
  title: z.string(),
  description: z.string().optional(),
  completed: z.boolean(),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.date().optional(),
});

const TaskUpdate = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  dueDate: z.date().optional(),
});

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

  async create(req: FastifyRequest, reply: FastifyReply) {
    const userId = req.user?.id;
    if (!userId) {
      return reply.status(500).send({ success: false, message: 'Erro interno do servidor' });
    }
    const task = taskCreate.parse(req.body);
    const data = await this.taskUseCases.create({ userId, ...task });
    reply.status(data.success ? 200 : 500).send(data);
  }

  async update(req: FastifyRequest, reply: FastifyReply) {
    const userId = req.user?.id;
    if (!userId) {
      return reply.status(500).send({ success: false, message: 'Erro interno do servidor' });
    }
    const { id } = req.params as { id: number };
    const task = TaskUpdate.parse(req.body);
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
