import { FastifyReply, FastifyRequest } from 'fastify';
import { AdminUseCases } from '../services/admin.services';

class AdminController {
  private adminUseCases: AdminUseCases;

  constructor() {
    this.adminUseCases = new AdminUseCases();
    this.getUsers = this.getUsers.bind(this);
  }

  async getUsers(req: FastifyRequest, reply: FastifyReply) {
    const data = await this.adminUseCases.listAllUsersAndTasks();
    reply.status(data.success ? 200 : 500).send(data);
  }
}

export { AdminController };
