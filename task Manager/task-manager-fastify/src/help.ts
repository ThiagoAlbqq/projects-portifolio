import { FastifyInstance } from 'fastify';

export class WebSocketAdapter {
  private fastify: FastifyInstance;

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
  }

  handleConnection(connection: any): void {
    connection.socket.on('message', async (message: any) => {
      try {
        console.log('Mensagem recebida:', message.toString());
        connection.socket.send(`Resposta do servidor: Você disse "${message.toString()}"`);
      } catch (error) {
        this.handleError(error, connection);
      }
    });
  }

  private handleError(error: any, connection: any): void {
    console.error('Error processing message', error);
    connection.socket.send('Error processing message');
  }
}
