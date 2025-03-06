export interface Task {
  title: string; // Título da tarefa
  description?: string; // Descrição opcional da tarefa
  completed: boolean; // Status da tarefa (concluída ou não)
  priority: 'low' | 'medium' | 'high'; // Prioridade da tarefa
  dueDate?: Date; // Data de vencimento (opcional)
  userId: string; // ID do usuário que criou a tarefa (para controle de acesso)
}

export interface TaskModel {
  title: string;
  description: string | null;
  completed: boolean;
  priority: string;
  dueDate: Date | null;
  userId: string;
}
