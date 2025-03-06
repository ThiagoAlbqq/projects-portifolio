import { FastifyReply, FastifyRequest } from 'fastify';
import { UserUseCases } from '../services/user.services';

class UserController {
  private userUseCases: UserUseCases;

  constructor() {
    this.userUseCases = new UserUseCases();
    this.getUser = this.getUser.bind(this);
  }

  async getUser(req: FastifyRequest, reply: FastifyReply) {
    const userId = req.user?.id;
    if (!userId) {
      return reply.status(500).send({ success: false, message: 'Erro interno do servidor' });
    }
    const data = await this.userUseCases.listUser(userId);
    reply.status(data.success ? 200 : 500).send(data);
  }
}

export { UserController };
