import { FastifyReply, FastifyRequest } from 'fastify';
import jwt, { JwtPayload } from 'jsonwebtoken';

export async function authenticate(req: FastifyRequest, reply: FastifyReply) {
  const authHeader = req.headers.authorization;
  const secretKey = process.env.SECRET_KEY;

  if (!authHeader) {
    return reply.status(401).send({ success: 'failed', message: 'Token não informado' });
  }

  const token = authHeader.split(' ')[1];

  if (!secretKey) {
    console.error('Erro: SECRET_KEY não definida');
    return reply.status(500).send({ success: 'failed', message: 'Erro interno de configuração' });
  }

  try {
    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    req.user = { id: decoded.id, role: decoded.role };
  } catch {
    return reply.status(401).send({ success: 'failed', message: 'Token inválido ou expirado' });
  }
}
