import { FastifyReply, FastifyRequest } from 'fastify';
import { AdminUseCases } from '../services/admin.services';
import { z } from 'zod';

const TaskUpdate = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  dueDate: z.date().optional(),
});

class AdminController {
  private adminUseCases: AdminUseCases;

  constructor() {
    this.adminUseCases = new AdminUseCases();
    this.getAllUsers = this.getAllUsers.bind(this);
    this.getAllTasks = this.getAllTasks.bind(this);
    this.getAnyTask = this.getAnyTask.bind(this);
    this.deleteAnyTask = this.deleteAnyTask.bind(this);
    this.modifyAnyTask = this.modifyAnyTask.bind(this);
    this.deleteAnyUser = this.deleteAnyUser.bind(this);
  }

  async getAllUsers(req: FastifyRequest, reply: FastifyReply) {
    const data = await this.adminUseCases.listAllUsersAndTasks();
    reply.status(data.success ? 200 : 500).send(data);
  }

  async getAllTasks(req: FastifyRequest, reply: FastifyReply) {
    const data = await this.adminUseCases.listAllTasks();
    reply.status(data.success ? 200 : 500).send(data);
  }

  async getAnyTask(req: FastifyRequest, reply: FastifyReply) {
    const { taskId } = req.params as { taskId: string };
    const data = await this.adminUseCases.listOneTask(Number(taskId));
    reply.status(data.success ? 200 : 500).send(data);
  }

  async modifyAnyTask(req: FastifyRequest, reply: FastifyReply) {
    const { taskId } = req.params as { taskId: string };
    const task = TaskUpdate.parse(req.body);
    const data = await this.adminUseCases.modifyAnyTask({ id: Number(taskId), ...task });
    reply.status(data.success ? 200 : 500).send(data);
  }

  async deleteAnyTask(req: FastifyRequest, reply: FastifyReply) {
    const { taskId } = req.params as { taskId: string };
    const data = await this.adminUseCases.deleteAnyTask(Number(taskId));
    reply.status(data.success ? 200 : 500).send(data);
  }

  async deleteAnyUser(req: FastifyRequest, reply: FastifyReply) {
    const { userId } = req.params as { userId: string };
    const data = await this.adminUseCases.deleteAnyUser(userId);
    reply.status(data.success ? 200 : 500).send(data);
  }
}

export { AdminController };
