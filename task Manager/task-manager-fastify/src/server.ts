import Fastify from 'fastify';
import { userConfigRoutes, userTasksRoutes } from './routes/user.routes';
import adminRoutes from './routes/admin.routes';
import loginRoute from './routes/login.route';

const fastify = Fastify();

fastify.get('/', async (request, reply) => {
  return { hello: 'world' };
});

fastify.register(userTasksRoutes, { prefix: '/tasks' });
fastify.register(userConfigRoutes, { prefix: '/user' });
fastify.register(adminRoutes, { prefix: '/admin' });
fastify.register(loginRoute);

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});

//socorro
