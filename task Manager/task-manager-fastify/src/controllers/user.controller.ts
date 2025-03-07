import { FastifyReply, FastifyRequest } from 'fastify';
import { UserUseCases } from '../services/user.services';
import { z } from 'zod';

const userUpdateSchema = z.object({
  nome: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
});

class UserController {
  private userUseCases: UserUseCases;

  constructor() {
    this.userUseCases = new UserUseCases();
    this.list = this.list.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async list(req: FastifyRequest, reply: FastifyReply) {
    const userId = req.user?.id;
    if (!userId) {
      return reply.status(500).send({ success: false, message: 'Erro interno do servidor' });
    }
    const data = await this.userUseCases.listUser(userId);
    reply.status(data.success ? 200 : 500).send(data);
  }

  async update(req: FastifyRequest, reply: FastifyReply) {
    const userId = req.user?.id;
    if (!userId) {
      return reply.status(500).send({ success: false, message: 'Erro interno do servidor' });
    }
    const userData = userUpdateSchema.parse(req.body);
    const data = await this.userUseCases.modifyUser({ id: userId, ...userData });
    reply.status(data.success ? 200 : 500).send(data);
  }

  async delete(req: FastifyRequest, reply: FastifyReply) {
    const userId = req.user?.id;
    if (!userId) {
      return reply.status(500).send({ success: false, message: 'Erro interno do servidor' });
    }
    const data = await this.userUseCases.deleteUser(userId);
    reply.status(data.success ? 200 : 500).send(data);
  }
}

export { UserController };
