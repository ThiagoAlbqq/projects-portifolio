import { prisma } from '../database/prisma.config'

class CheckingTokenValidity {
  async execute(id: number, token: string) {
    const isValid = await prisma.userSessions.findUnique({
      where: { userId: id, token, isValid: true },
    })
    if (!isValid) {
      return false
    }
    return true
  }
}

export { CheckingTokenValidity }
