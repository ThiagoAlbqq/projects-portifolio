import { WebSocketServer, WebSocket } from 'ws';

const port = 1234;
const wss = new WebSocketServer({ port }); // Cria um servidor WebSocket na porta 1234

wss.on('connection', (ws) => {
  console.log('Novo cliente conectado');

  // Envia uma mensagem de boas-vindas para o cliente
  ws.send('Bem-vindo ao servidor de notificações!');

  // Envia mensagens periódicas para o cliente
  const interval = setInterval(() => {
    ws.send(`Hora atual: ${new Date().toLocaleTimeString()}`);
  }, 5000); // Envia a cada 5 segundos

  // Fecha a conexão após 30 segundos (apenas para demonstração)
  setTimeout(() => {
    clearInterval(interval);
    ws.close();
    console.log('Conexão fechada após 30 segundos');
  }, 30000);

  // Trata erros na conexão
  ws.on('error', (error) => {
    console.error('Erro na conexão:', error);
  });
});

// wss.on('connection', (ws: WebSocket) => {
//   console.log('Novo cliente conectado');

//   // Lidar com mensagens recebidas dos clientes
//   ws.on('message', (data: Buffer) => {
//     const message = data.toString(); // Converte o buffer para string
//     console.log(`Mensagem recebida: ${message}`);

//     // Transmitir a mensagem para todos os clientes conectados, exceto o remetente
//     wss.clients.forEach((client) => {
//       if (client !== ws && client.readyState === WebSocket.OPEN) {
//         client.send(`Broadcast: ${message}`);
//       }
//     });
//   });

//   // Enviar uma mensagem de boas-vindas para o cliente
//   ws.send('Olá, este é o servidor WebSocket!');

//   // Lidar com a desconexão do cliente
//   ws.on('close', () => {
//     console.log('Cliente desconectado');
//   });

//   // Lidar com erros na conexão WebSocket
//   ws.on('error', (error: Error) => {
//     console.error('Erro no WebSocket:', error);
//   });
// });

// Lidar com o desligamento do servidor de forma adequada
process.on('SIGINT', () => {
  console.log('Desligando o servidor...');
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.close(); // Fecha a conexão de cada cliente
    }
  });
  wss.close(() => {
    process.exit(0); // Encerra o processo do servidor
  });
});

console.log(`Servidor WebSocket rodando na porta ${port}...`);
