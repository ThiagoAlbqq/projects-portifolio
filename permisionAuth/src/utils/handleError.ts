export function handleError(message: string, error: Error): Error {
  console.error(`${message}: ${error.name} - ${error.message}`)
  return new Error(message)
}
