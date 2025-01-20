import { FastifyReply, FastifyRequest } from 'fastify'
import { LoginUseCase } from './LoginUseCase'
import { z, ZodError } from 'zod'
import {
  handleValidateZodError,
  handleValidationError,
} from '../../../utils/handleValidationError'
import { PrismaClientValidationError } from '@prisma/client/runtime/library'
import { InvalidCredentialsError } from '../../../errors/errors'

const LoginBodySchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email format' }),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required'),
})

class LoginController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const loginUseCase = new LoginUseCase()
    try {
      const { email, password } = LoginBodySchema.parse(request.body!)
      const ipAddress = request.ip

      console.info(`[LOGIN] Tentativa de login para o e-mail: ${email}`)

      const { token, refresh, role } = await loginUseCase.login({
        email,
        password,
        ipAddress,
      })

      console.log(`O usuario de ROLE: ${role}, está logado no IP: ${ipAddress}`)

      reply
        .setCookie('refresh', refresh, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          domain: process.env.COOKIE_DOMAIN || undefined,
          maxAge: 7 * 24 * 60 * 60,
        })
        .status(200)
        .send({
          success: true,
          message: 'User successfully logged in',
          data: { token, refresh },
        })
    } catch (error) {
      if (error instanceof ZodError) {
        console.warn(`[LOGIN] Erro de validação: ${error.message}`)
        return reply.status(400).send({
          success: false,
          message: handleValidationError(error),
        })
      }

      if (error instanceof PrismaClientValidationError) {
        console.error(`[LOGIN] Erro de validação do Prisma: ${error.message}`)
        return reply.status(500).send({
          success: false,
          message: error.message,
        })
      }

      if (error instanceof InvalidCredentialsError) {
        console.error(`[LOGIN] Erro de credenciais: ${error.message}`)
        return reply.status(401).send({
          success: false,
          message: error.message,
        })
      }

      console.error(`[LOGIN] Erro inesperado: ${error}`)
      return reply.status(500).send({
        success: false,
        message: 'Internal Server Error',
      })
    }
  }
}

export { LoginController }
