import { prisma } from '../database/prisma.config';
import { Response } from '../utils/globals.interfaces';

interface UserModel {}

class UserUseCases {
  async listUser(id: string): Promise<Response<UserModel | null>> {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      return {
        success: true,
        message: 'Usuario encontrado com exito',
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Não foi possivel encontrar o usuario',
      };
    }
  }
}

export { UserUseCases };
