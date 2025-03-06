import { FastifyInstance } from 'fastify';
import { createToken } from '../utils/createToken';

export default async function loginRoute(app: FastifyInstance) {
  app.get('/login', (req, reply) => {
    const token = createToken({ id: '1d9c07e7-534f-4625-a550-324952c0c604', role: 'ADMIN' }, 3600);
    reply.status(200).send(token);
  });
}
