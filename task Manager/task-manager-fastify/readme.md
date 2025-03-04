# Gerenciamento de Tarefas - API

Este repositório contém uma implementação de uma API para gerenciamento de tarefas utilizando Prisma como ORM e um banco de dados relacional.

## Tecnologias Utilizadas

- Node.js
- Fastify
- Prisma ORM
- TypeScript
- SQLite (ou outro banco suportado pelo Prisma)

## Configuração do Banco de Dados

Antes de executar a aplicação, configure o Prisma para conectar-se ao banco de dados. No arquivo `prisma/.env`, defina a string de conexão:

```env
DATABASE_URL="file:./dev.db"
```

Em seguida, execute as migrações do Prisma:

```sh
npx prisma migrate dev --name init
```

## Estrutura de Dados

### Interface `Task`

```typescript
interface Task {
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  userId: string;
}
```

### Interface `TaskUpdate`

```typescript
interface TaskUpdate {
  id: number;
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
}
```

## Endpoints da API

### 1. Buscar uma tarefa pelo ID

**Rota:** `GET /tasks/:id`

**Resposta:**

```json
{
  "success": true,
  "message": "Tarefa encontrada",
  "data": {
    "title": "Minha Tarefa",
    "description": "Descrição da tarefa",
    "completed": false,
    "priority": "high",
    "userId": "123"
  }
}
```

### 2. Listar todas as tarefas de um usuário

**Rota:** `GET /tasks?userId=123`

**Resposta:**

```json
{
  "success": true,
  "message": "Tarefas listadas com sucesso",
  "data": [
    {
      "title": "Minha Tarefa",
      "description": "Descrição da tarefa",
      "completed": false,
      "priority": "high",
      "userId": "123"
    }
  ]
}
```

### 3. Criar uma nova tarefa

**Rota:** `POST /tasks`

**Body:**

```json
{
  "title": "Nova Tarefa",
  "description": "Descrição opcional",
  "completed": false,
  "priority": "medium",
  "userId": "123"
}
```

**Resposta:**

```json
{
  "success": true,
  "message": "Tarefa criada com sucesso",
  "data": {
    "title": "Nova Tarefa",
    "description": "Descrição opcional",
    "completed": false,
    "priority": "medium",
    "userId": "123"
  }
}
```

### 4. Atualizar uma tarefa existente

**Rota:** `PUT /tasks/:id`

**Body:**

```json
{
  "title": "Tarefa Atualizada",
  "completed": true
}
```

**Resposta:**

```json
{
  "success": true,
  "message": "Tarefa modificada com sucesso",
  "data": {
    "title": "Tarefa Atualizada",
    "description": "Descrição opcional",
    "completed": true,
    "priority": "medium",
    "userId": "123"
  }
}
```

### 5. Deletar uma tarefa

**Rota:** `DELETE /tasks/:id`

**Resposta:**

```json
{
  "success": true,
  "message": "Tarefa deletada com sucesso"
}
```

## Como Executar a API

1. Instale as dependências:
   ```sh
   npm install
   ```
2. Inicie a aplicação:
   ```sh
   npm run dev
   ```

A API estará disponível em `http://localhost:3000`.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).
