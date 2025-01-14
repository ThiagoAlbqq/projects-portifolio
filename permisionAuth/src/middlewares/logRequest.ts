import { FastifyReply, FastifyRequest } from 'fastify'

export async function logRequest(request: FastifyRequest, reply: FastifyReply) {
  console.log(`Requisição recebida: ${request.method} ${request.url}`)
}

// export async function logRequests(
//   request: FastifyRequest,
//   reply: FastifyReply
// ) {
//   console.log(`[${new Date().toISOString()}] ${request.method} ${request.url}`)
//   console.log('Headers:', request.headers)
//   console.log('Query Params:', request.query)
//   console.log('Body:', request.body)
// }
