// src/types/fastify.d.ts
import { FastifyRequest } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      // Aqui você pode definir o formato de 'user'
      id: string;
      role: string;
    };
  }
}
