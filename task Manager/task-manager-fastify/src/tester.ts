import fastify, { FastifyInstance } from 'fastify';
import websocketPlugin from '@fastify/websocket';

// Criar uma instância do Fastify
const server: FastifyInstance = fastify({
  logger: true,
});

// Registrar o plugin WebSocket
server.register(websocketPlugin);

// Rota WebSocket
server.get('/ws', { websocket: true }, (connection, request) => {
  const socket = connection.socket;

  console.log('Cliente conectado');

  // Ouvinte de mensagens
  socket.on('message', (message: Buffer | string) => {
    console.log('Mensagem recebida:', message.toString());

    // Envia uma resposta para o cliente
    socket.send(`Resposta do servidor: Você disse "${message.toString()}"`);
  });

  // Ouvinte de fechamento
  socket.on('close', () => {
    console.log('Cliente desconectado');
  });

  // Ouvinte de erros
  socket.on('error', (error: Error) => {
    console.error('Erro no WebSocket:', error);
  });
});

// Iniciar o servidor
const start = async () => {
  try {
    await server.listen({ port: 3000 });
    console.log('Servidor Fastify rodando na porta 3000');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
