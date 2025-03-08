import WebSocket from 'ws';

const port = 1234;

// Cliente 1
const ws1 = new WebSocket(`ws://localhost:${port}`);

ws1.on('open', () => {
  console.log(`[CLIENTE 1] Conectado ao servidor`);
  ws1.send(`Oi, eu sou o Cliente 1`);
  ws1.send(`Meu nome é Thiago, como você está?`);
});

ws1.onmessage = (event) => {
  // Verifica se event.data é uma string
  if (typeof event.data === 'string') {
    const mensagem = JSON.parse(event.data);
    console.log('[CLIENTE] Notificação recebida:', mensagem.message);
  } else {
    console.error('[CLIENTE] Mensagem recebida em formato não suportado:', event.data);
  }
};

ws1.on('message', (data) => {
  console.log(`[CLIENTE 1] Mensagem recebida: ${data}`);
});

ws1.on('close', () => {
  console.log('[CLIENTE 1] Conexão fechada');
});

ws1.on('error', (error) => {
  console.error('[CLIENTE 1] Erro na conexão:', error);
});
