import WebSocket from 'ws';

const port = 1234;

// Cliente 2
const ws2 = new WebSocket(`ws://localhost:${port}`);

ws2.on('open', () => {
  console.log(`[CLIENTE 2] Conectado ao servidor`);
  ws2.send(`Oi, eu sou o Cliente 2`);
  ws2.send(`Meu nome é João, tudo bem?`);
});

ws2.on('message', (data) => {
  console.log(`[CLIENTE 2] Mensagem recebida: ${data}`);
});

ws2.on('close', () => {
  console.log('[CLIENTE 2] Conexão fechada');
});

ws2.on('error', (error) => {
  console.error('[CLIENTE 2] Erro na conexão:', error);
});
