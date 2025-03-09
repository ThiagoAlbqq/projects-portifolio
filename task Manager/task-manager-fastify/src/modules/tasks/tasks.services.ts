import { prisma } from '../../infra/prisma.config';
import { Response } from '../../utils/globals.interfaces';
import { ITask, SecureITask, TaskCreateService, TaskUpdateService } from '../tasks/tasks.schema';

class TaskUseCases {
  async getUnique(userId: string, id: number): Promise<Response<SecureITask | null>> {
    try {
      const task = await prisma.task.findUnique({ where: { id, userId }, select: { id: true, title: true, description: true, priority: true, completed: true, dueDate: true } });
      return {
        success: !!task,
        message: task ? 'Tarefa encontrada' : 'Tarefa não encontrada',
        data: task,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao buscar a tarefa: ' + error,
      };
    }
  }

  async get(userId: string): Promise<Response<SecureITask[]>> {
    try {
      const tasks = await prisma.task.findMany({ where: { userId }, select: { id: true, title: true, description: true, priority: true, completed: true, dueDate: true } });
      return {
        success: true,
        message: 'Tarefas listadas com sucesso',
        data: tasks,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao listar as tarefas: ' + error,
      };
    }
  }

  async create({ title, description, priority, completed, userId, dueDate }: TaskCreateService): Promise<Response<SecureITask>> {
    try {
      if (dueDate === undefined) {
        dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 3);
      }

      const newTask = await prisma.task.create({
        data: { title, description, completed, priority, dueDate, userId },
        select: { id: true, title: true, description: true, priority: true, completed: true, dueDate: true },
      });

      return {
        success: true,
        message: 'Tarefa criada com sucesso',
        data: newTask,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao criar a tarefa',
      };
    }
  }

  async update({ userId, id, description, dueDate, priority, title, completed }: TaskUpdateService): Promise<Response<SecureITask>> {
    try {
      if (dueDate === undefined) {
        dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 3);
      }

      const updatedTask = await prisma.task.update({
        where: { id, userId },
        data: {
          ...(title && { title }),
          ...(description && { description }),
          ...(priority && { priority }),
          ...(completed !== undefined && { completed }),
          ...(dueDate && { dueDate }),
        },
        select: { id: true, title: true, description: true, priority: true, completed: true, dueDate: true },
      });
      return {
        success: true,
        message: 'Tarefa modificada com sucesso',
        data: updatedTask,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao modificar a tarefa: ' + error,
      };
    }
  }

  async delete(userId: string, id: number): Promise<Response<null>> {
    try {
      await prisma.task.delete({ where: { id, userId } });
      return {
        success: true,
        message: 'Tarefa deletada com sucesso',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao deletar a tarefa: ' + error,
      };
    }
  }
}

export { TaskUseCases };
