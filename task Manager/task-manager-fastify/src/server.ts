import Fastify from 'fastify';
import tasksRoutes from './modules/tasks/tasks.routes';

const fastify = Fastify();

fastify.get('/', async (request, reply) => {
  return { hello: 'world' };
});

fastify.register(tasksRoutes);

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
