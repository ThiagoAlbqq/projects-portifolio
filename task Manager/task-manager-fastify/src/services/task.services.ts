import { prisma } from '../database/prisma.config';
import { Task } from '../entities/task.entity';

interface TaskUpdate {
  id: number;
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
}

class TaskUseCases {
  async getUnique(id: number) {
    try {
      const task = await prisma.task.findUnique({ where: { id } });
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

  async get(userId: string) {
    try {
      const tasks = await prisma.task.findMany({ where: { userId } });
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

  async create({ title, description, priority, completed, userId, dueDate }: Task) {
    try {
      const newTask = await prisma.task.create({
        data: { title, description, completed, priority, dueDate, userId },
        select: { title: true, description: true, priority: true, completed: true, userId: true },
      });
      return {
        success: true,
        message: 'Tarefa criada com sucesso',
        data: newTask,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao criar a tarefa: ' + error,
      };
    }
  }

  async update({ id, description, dueDate, priority, title, completed }: TaskUpdate) {
    try {
      const updatedTask = await prisma.task.update({
        where: { id },
        data: {
          ...(title && { title }),
          ...(description && { description }),
          ...(priority && { priority }),
          ...(completed && { completed }),
          ...(dueDate && { dueDate }),
        },
        select: {
          title: true,
          description: true,
          priority: true,
          completed: true,
          userId: true,
        },
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

  async delete(id: number) {
    try {
      await prisma.task.delete({ where: { id } });
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
