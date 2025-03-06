import { string } from 'zod';
import { prisma } from '../database/prisma.config';
import { Task, TaskModel } from '../entities/task.entity';

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

interface TaskRespose {
  user: {
    id: string;
    nome: string;
  };
  title: string;
  description: string | null;
  completed: boolean;
  priority: string;
}

interface TaskUpdate {
  id: number;
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
}

interface UserModel {
  id: string;
  nome: string;
}

interface Response<T> {
  success: boolean;
  message: string;
  data?: T;
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
        message: 'Não foi possivel listar os usuarios',
      };
    }
  }

  async listAllTasks(): Promise<Response<TaskModel[]>> {
    try {
      const tasks = await prisma.task.findMany();
      return {
        success: true,
        message: 'Tasks encontradas',
        data: tasks,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Não foi possivel listar as tasks',
      };
    }
  }

  async listOneTask(taskId: number): Promise<Response<TaskRespose | null>> {
    try {
      const task = await prisma.task.findUnique({ where: { id: taskId }, select: { user: true, title: true, description: true, priority: true, completed: true } });
      return {
        success: true,
        message: 'Task encontrada',
        data: task,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Não foi possivel encontrar a task',
      };
    }
  }

  async modifyAnyTask({ id, completed, description, dueDate, priority, title }: TaskUpdate): Promise<Response<TaskModel>> {
    try {
      const task = await prisma.task.update({
        where: { id },
        data: {
          ...(title && { title }),
          ...(description && { description }),
          ...(priority && { priority }),
          ...(completed && { completed }),
          ...(dueDate && { dueDate }),
        },
        select: { title: true, description: true, completed: true, dueDate: true, priority: true, userId: true },
      });
      return {
        success: true,
        message: 'Task modificada com exito',
        data: task,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Não foi possivel modificar a task',
      };
    }
  }

  async deleteAnyTask(id: number): Promise<Response<TaskModel>> {
    try {
      const task = await prisma.task.delete({ where: { id }, select: { title: true, description: true, completed: true, dueDate: true, priority: true, userId: true } });
      return {
        success: true,
        message: 'Task deletada com exito',
        data: task,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Não foi possivel deletar a task',
      };
    }
  }

  async deleteAnyUser(id: string): Promise<Response<UserModel>> {
    try {
      const task = await prisma.user.delete({ where: { id }, select: { id: true, nome: true } });
      return {
        success: true,
        message: 'Usuario deletado com exito',
        data: task,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Não foi possivel deletar o usuario',
      };
    }
  }
}

export { AdminUseCases };
