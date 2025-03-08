import { prisma } from '../database/prisma.config';
import { Response } from '../utils/globals.interfaces';
import { hash } from 'bcrypt';

interface UserModel {
  id: string;
  nome: string;
  email: string;
  password: string;
  role: string;
}

interface UserModify {
  id: string;
  nome?: string;
  email?: string;
  newPassword?: string;
}

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

  async modifyUser({ id, email, nome, newPassword }: UserModify): Promise<Response<UserModel>> {
    try {
      const saltRounds = parseInt(process.env.SALTS || '8', 10);
      const user = await prisma.user.update({
        where: { id },
        data: {
          ...(email && { email }),
          ...(nome && { nome }),
          ...(newPassword && { password: await hash(newPassword, saltRounds) }),
        },
      });
      return {
        success: true,
        message: 'Usuario modificado com exito',
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Não foi possivel modificar o usuario',
      };
    }
  }

  async deleteUser(id: string): Promise<Response<null>> {
    try {
      await prisma.user.delete({ where: { id } });
      return {
        success: false,
        message: 'Usuario deletado com exito',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Não foi possivel deletar o usuario',
      };
    }
  }
}

export { UserUseCases };
