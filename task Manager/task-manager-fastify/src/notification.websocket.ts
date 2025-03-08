import { WebSocketServer, WebSocket } from 'ws';
import { prisma } from './database/prisma.config';

const port = 1234;
const wss = new WebSocketServer({ port });

// Função para buscar tasks do banco de dados
async function buscarTasks() {
  try {
    const tasks = await prisma.task.findMany();
    console.log('Tasks carregadas:', tasks);
    return tasks;
  } catch (error) {
    console.error('Erro ao buscar tasks:', error);
    return [];
  }
}

// Função para verificar prazos e enviar notificações
async function verificarPrazos() {
  const tasks = await buscarTasks();
  const agora = new Date();

  tasks.forEach((task) => {
    // Verifica se dueDate não é null
    if (task.dueDate !== null) {
      const dataVencimento = new Date(task.dueDate); // Converte para objeto Date
      const diferenca = dataVencimento.getTime() - agora.getTime(); // Diferença em milissegundos
      const horasRestantes = diferenca / (1000 * 60 * 60); // Converte para horas

      if (horasRestantes <= 10) {
        // 10 horas antes
        const mensagem = `A task "${task.title}" vence em 10 horas!`;

        // Envia notificação via WebSocket (para aplicativo aberto)
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'notificacao', message: mensagem }));
          }
        });

        console.log(`Notificação enviada: ${mensagem}`);
      }
    }
  });
}

// Verifica prazos a cada minuto
setInterval(verificarPrazos, 5000);

// Evento de conexão de clientes
wss.on('connection', (ws) => {
  console.log('Novo cliente conectado');

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });

  ws.on('error', (error) => {
    console.error('Erro na conexão:', error);
  });
});

console.log(`Servidor WebSocket rodando na porta ${port}...`);
