import { ZodError } from 'zod'

export function handleValidationError(error: ZodError) {
  return error.errors.map((err) => `${err.message}`).join(', ')
}
export function handleValidateZodError(error: ZodError) {
  const errorMessages = error.errors.map((err) => {
    return `O campo '${err.path.join('.')}' é obrigatorio`
  })
  return errorMessages
}
