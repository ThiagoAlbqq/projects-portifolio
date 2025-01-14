import { FastifyReply, FastifyRequest } from 'fastify'
import { LoginUseCase } from './LoginUseCase'
import { z, ZodError } from 'zod'
import { handleValidationError } from '../../../utils/handleValidationError'

const LoginBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

class LoginController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const loginUseCase = new LoginUseCase()
      const { email, password } = LoginBodySchema.parse(request.body!)
      const ipAddress = request.ip
      const { token, refreshToken } = await loginUseCase.login({
        email,
        password,
        ipAddress,
      })
      reply
        .setCookie('refresh', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          maxAge: 7 * 24 * 60 * 60,
        })
        .status(200)
        .send({ token: token, refresh: refreshToken })
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send(handleValidationError(error))
      }
      return reply.status(500).send(error)
    }
  }
}

export { LoginController }
