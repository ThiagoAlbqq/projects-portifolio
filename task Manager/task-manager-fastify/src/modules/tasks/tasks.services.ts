import { prisma } from '../../infra/prisma.config';
import { Task, TaskCreateService } from '../tasks/tasks.schema';

interface TaskUpdate {
  id: number;
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
  userId: string;
}

class TaskUseCases {
  async getUnique(userId: string, id: number) {
    try {
      const task = await prisma.task.findUnique({ where: { id, userId } });
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

  async create({ title, description, priority, completed, userId, dueDate }: TaskCreateService) {
    try {
      // Se `dueDate` não for fornecido, define a data de vencimento como 3 dias após a data atual
      let newDueDate = dueDate;
      if (!newDueDate) {
        newDueDate = new Date(); // Cria a data atual
        newDueDate.setDate(newDueDate.getDate() + 3); // Define a data como 3 dias depois
      }

      // Criação da nova tarefa
      const newTask = await prisma.task.create({
        data: { title, description, completed, priority, dueDate: newDueDate, userId },
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
        message: 'Erro ao criar a tarefa',
      };
    }
  }

  async update({ userId, id, description, dueDate, priority, title, completed }: TaskUpdate) {
    try {
      const updatedTask = await prisma.task.update({
        where: { id, userId },
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

  async delete(userId: string, id: number) {
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
