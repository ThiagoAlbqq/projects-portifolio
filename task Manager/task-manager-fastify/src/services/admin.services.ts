import { prisma } from '../database/prisma.config';

interface Response<T> {
  success: boolean;
  message: string;
  data?: T;
}

interface DataResponse {
  id: string;
  nome: string;
  Task: {
    title: string;
    priority: string;
    completed: boolean;
  }[];
}

class AdminUseCases {
  async listAllUsersAndTasks(): Promise<Response<DataResponse[]>> {
    try {
      const allUsers = await prisma.user.findMany({ select: { id: true, nome: true, Task: { select: { title: true, priority: true, completed: true } } } });
      return {
        success: true,
        message: 'Usuarios encontrados',
        data: allUsers,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Não foi possivel encontrar os usuarios',
      };
    }
  }
}

export { AdminUseCases };
