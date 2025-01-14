import { ZodError } from 'zod'

export function handleValidationError(error: ZodError): void {
  throw new Error(
    `Erro de validação: ${error.errors.map((e) => e.message).join(', ')}`
  )
}
