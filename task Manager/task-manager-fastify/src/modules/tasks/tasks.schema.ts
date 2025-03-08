import { z } from 'zod';

// Schema para uma tarefa completa (retorno de dados)
export const task = z.object({
  id: z.number(),
  userId: z.string().uuid(),
  title: z.string().min(1, 'O título é obrigatório'),
  description: z.string().optional(),
  completed: z.boolean().default(false),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.coerce.date().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
});

export const taskCreateController = task.omit({ id: true, createdAt: true, updatedAt: true, userId: true });

// Schema para criar uma tarefa (sem `id`, `createdAt`, `updatedAt`)
export const taskCreateService = task.omit({ id: true, createdAt: true, updatedAt: true });

// Schema para atualizar uma tarefa (todos os campos são opcionais)
export const taskUpdate = taskCreateService.partial();

// Schema para uma resposta de sucesso (típico em respostas de POST, PUT, DELETE)
export const successResponse = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.unknown().optional(), // Pode incluir dados adicionais, como a tarefa criada ou atualizada
});

// Schema para uma resposta de erro (usado para mensagens de erro)
export const errorResponse = z.object({
  success: z.boolean(),
  message: z.string(),
  error: z.string().optional(), // Pode conter detalhes adicionais sobre o erro
});

// Tipo para a criação da tarefa (sem id e datas)
export type TaskCreateService = z.infer<typeof taskCreateService>;
export type TaskCreateController = z.infer<typeof taskCreateController>;

// Tipo para a atualização da tarefa (campos opcionais)
export type TaskUpdate = z.infer<typeof taskUpdate>;

// Tipo para a tarefa (completa, incluindo `id`, `userId`, etc.)
export type Task = z.infer<typeof task>;

// Tipo para resposta de sucesso
export type SuccessResponse = z.infer<typeof successResponse>;

// Tipo para resposta de erro
export type ErrorResponse = z.infer<typeof errorResponse>;
