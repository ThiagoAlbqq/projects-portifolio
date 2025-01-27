# API de Autenticação e Controle de Acessos

## Visão Geral

Esta é uma API desenvolvida para gerenciar autenticação de usuários e controle de acessos em aplicações web. Ela oferece funcionalidades como login, logout, criação de usuários e verificação de permissões (roles).

### Tecnologias Utilizadas

- **Node.js**
- **Fastify**
- **Prisma**
- **Zod**
- **JWT**

---

## Como Executar o Projeto

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-repositorio.git
   cd seu-repositorio
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente no arquivo `.env`:

   ```env
   DATABASE_URL=URL_DO_BANCO_DE_DADOS
   JWT_SECRET=SEGREDO_DO_JWT
   COOKIE_DOMAIN=DOMINIO_DOS_COOKIES
   NODE_ENV=development
   ```

4. Execute as migrações do Prisma:

   ```bash
   npx prisma migrate dev
   ```

5. Inicie o servidor:
   ```bash
   npm run dev
   ```

---

## Rotas da API

### Autenticação

| Método | Endpoint       | Descrição                    | Autenticação Necessária |
| ------ | -------------- | ---------------------------- | ----------------------- |
| POST   | `/api/login`   | Autentica o usuário.         | Não                     |
| POST   | `/api/logout`  | Realiza o logout do usuário. | Sim                     |
| POST   | `/api/refresh` | Realiza o refresh do token.  | Sim                     |

### Publicas

| Método | Endpoint    | Descrição                  | Autenticação Necessária |
| ------ | ----------- | -------------------------- | ----------------------- |
| POST   | `/api/user` | Cria um novo usuário.      | Não                     |
| GET    | `/api/user` | Lista o usuário.           | Sim                     |
| PUT    | `/api/user` | Modifica dados do usuário. | Sim                     |
| DELETE | `/api/user` | Deleta o usuário.          | Sim                     |

### Privadas (ADMINS)

| Método | Endpoint              | Descrição                  | Autenticação Necessária |
| ------ | --------------------- | -------------------------- | ----------------------- |
| POST   | `/api/admin/user`     | Cria um novo usuário.      | Sim (ADMIN)             |
| GET    | `/api/admin/users`    | Lista todos os usuários.   | Sim (ADMIN)             |
| GET    | `/api/admin/user`     | Lista qualquer usuário.    | Sim (ADMIN)             |
| PUT    | `/api/admin/user/:id` | Modifica qualquer usuário. | Sim (ADMIN)             |
| DELETE | `/api/admin/user/:id` | Deleta qualquer usuário.   | Sim (ADMIN)             |

---

## Detalhamento das Rotas

### POST `/api/login`

**Descrição:** Realiza a autenticação do usuário e retorna tokens.

- **Headers:**
  ```json
  {
    "Content-Type": "application/json"
  }
  ```
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "123456"
  }
  ```
- **Resposta (200):**
  ```json
  {
    "success": true,
    "message": "User successfully logged in",
    "data": {
      "token": "abcdef...",
      "refresh": "xyz123..."
    }
  }
  ```
- **Resposta (400):**
  ```json
  {
    "success": false,
    "message": "Invalid email format"
  }
  ```
- **Resposta (401):**
  ```json
  {
    "success": false,
    "message": "Invalid email or password"
  }
  ```
- **Resposta (500):**
  ```json
  {
    "success": false,
    "message": "Internal Server Error"
  }
  ```
  - Em caso de erro durante a comunicação com o banco, a mensagem pode incluir detalhes como "Prisma error" no ambiente de desenvolvimento.

### POST `/api/logout`

**Descrição:** Finaliza a sessão do usuário, removendo o refresh token.

- **Headers:**
  ```json
  {
    "Authorization": "Bearer {token}"
  }
  ```
- **Cookies:**
  ```json
  {
    "refresh": "xyz123.."
  }
  ```
- **Resposta (200):**
  ```json
  {
    "success": true,
    "message": "Logout successful"
  }
  ```
- **Resposta (400):**
  ```json
  {
    "success": false,
    "message": "Token is required"
  }
  ```
- **Resposta (500):**
  ```json
  {
    "success": false,
    "message": "Internal Server Error"
  }
  ```

### POST `/api/refresh`

**Descrição:** Cria um novo token a partir do refresh token (chamada pelo middleware)

- **Headers:**
  ```json
  {
    "Content-Type": "application/json"
  }
  ```
- **Tokens:**
  ```json
  {
    "token": "abcdef...",
    "refresh": "xyz123..."
  }
  ```
- **User:**
  ```json
  {
    "id": "33489e18-1553-4d09-aa28-1eec77c7ad1a",
    "role": "ADMIN"
  }
  ```
- **Resposta (200):**
  ```json
  {
    "success": true,
    "message": "Token obtained by refresh token",
    "data": {
      "token": "abcdef..."
    }
  }
  ```
- **Resposta (400):**
  ```json
  {
    "success": false,
    "message": "Token is required"
  }
  ```
- **Resposta (500):**
  ```json
  {
    "success": false,
    "message": "Internal Server Error"
  }
  ```

### POST `/api/admin/user`

**Descrição:** Admin cria um novo usuário.

- **Headers:**
  ```json
  {
    "Authorization": "Bearer {admin_token}"
  }
  ```
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "password": "securepassword",
    "role": "USER"
  }
  ```
- **Resposta (200):**
  ```json
  {
    "success": true,
    "message": "User created successfully",
    "data": {
      "id": "123",
      "name": "John Doe",
      "email": "johndoe@example.com",
      "password": "{password_hash}",
      "role": "USER",
      "lastLogout": null
    }
  }
  ```
- **Resposta (400):**
  ```json
  {
    "success": false,
    "message": "Email is required"
  }
  ```
- **Resposta (500):**
  ```json
  {
    "success": false,
    "message": "Internal server error"
  }
  ```

### GET `/api/admin/users`

**Descrição:** Lista todos os usuarios.

- **Headers:**
  ```json
  {
    "Authorization": "Bearer {admin_token}"
  }
  ```
- **Resposta (200):**
  ```json
  {
    "success": true,
    "message": "2 users found",
    "data": [
      {
        "id": "33489e18-1553-4d09-aa28-1eec77c7ad1a",
        "name": "first",
        "email": "test1@gmail.com",
        "password": "$2b$10$0wAGATd6L9pGZPrWGqiLOeGrv8jZOugmdwm3n45B3gtEF1BLQAEMu",
        "role": "ADMIN",
        "lastLogout": null
      },
      {
        "id": "160d1c76-ef05-4bbe-8137-b2472e8d72ba",
        "name": "second",
        "email": "test2@gmail.com",
        "password": "$2b$08$8rarUqVbbSoZuU/EeGuSPOarrVEpS53PoDg.DGad0YeE82FSKvsOC",
        "role": "USER",
        "lastLogout": null
      }
    ]
  }
  ```
- **Resposta (500):**
  ```json
  {
    "success": false,
    "message": "Internal server error"
  }
  ```

### GET `/api/admin/user`

**Descrição:** Lista todos os usuarios.

- **Observação:** Quando não fornecido nenhuma query, o usuario é redirecionado para /api/admin/users

- **Headers:**
  ```json
  {
    "Authorization": "Bearer {admin_token}"
  }
  ```
- **Query:**
  ````json
  {
      "id": "33489e18-1553-4d09-aa28-1eec77c7ad1a",
      "email": "test1@gmail.com",
  }
  ```
  ````
- **Resposta (200):**
  ```json
  {
    "success": true,
    "message": "User found successfully",
    "data": {
      "id": "33489e18-1553-4d09-aa28-1eec77c7ad1a",
      "name": "first",
      "email": "test1@gmail.com",
      "password": "$2b$10$0wAGATd6L9pGZPrWGqiLOeGrv8jZOugmdwm3n45B3gtEF1BLQAEMu",
      "role": "ADMIN",
      "lastLogout": null
    }
  }
  ```
- **Resposta (400):**
  ```json
  {
    "success": false,
    "message": "Invalid email format"
  }
  ```
- **Resposta (500):**
  ```json
  {
    "success": false,
    "message": "Internal server error"
  }
  ```

### PUT `/api/admin/user/:id`

**Descrição:** Modifica um usuario.

- **Headers:**
  ```json
  {
    "Authorization": "Bearer {admin_token}"
  }
  ```
- **Params:**
  ```json
  {
    "id": "33489e18-1553-4d09-aa28-1eec77c7ad1a"
  }
  ```
- **Body:**
  ```json
  {
    "name": "first updated", (optional)
    "email": "test1@gmail.com", (optional)
    "password": "testando123", (optional)
    "role": "ADMIN" (optional)
  }
  ```
- **Resposta (200):**
  ```json
  {
    "success": true,
    "message": "User updated successfully",
    "data": {
      "id": "33489e18-1553-4d09-aa28-1eec77c7ad1a",
      "name": "first",
      "email": "test1@gmail.com",
      "password": "$2b$10$0wAGATd6L9pGZPrWGqiLOeGrv8jZOugmdwm3n45B3gtEF1BLQAEMu",
      "role": "ADMIN",
      "lastLogout": null
    }
  }
  ```
- **Resposta (400):**
  ```json
  {
    "success": false,
    "message": "Invalid id format"
  }
  ```
- **Resposta (500):**
  ```json
  {
    "success": false,
    "message": "Internal server error"
  }
  ```

### DELETE `/api/admin/user/:id`

**Descrição:** Deleta um usuario.

- **Headers:**
  ```json
  {
    "Authorization": "Bearer {admin_token}"
  }
  ```
- **Params:**
  ```json
  {
    "id": "33489e18-1553-4d09-aa28-1eec77c7ad1a"
  }
  ```
- **Resposta (200):**
  ```json
  {
    "success": true,
    "message": "User updated successfully",
    "data": {
      "id": "33489e18-1553-4d09-aa28-1eec77c7ad1a",
      "name": "first",
      "email": "test1@gmail.com",
      "password": "$2b$10$0wAGATd6L9pGZPrWGqiLOeGrv8jZOugmdwm3n45B3gtEF1BLQAEMu",
      "role": "ADMIN",
      "lastLogout": null
    }
  }
  ```
- **Resposta (400):**
  ```json
  {
    "success": false,
    "message": "ID is required"
  }
  ```
- **Resposta (500):**
  ```json
  {
    "success": false,
    "message": "Internal server error"
  }
  ```

---

## Códigos de Resposta

| Código | Descrição                   |
| ------ | --------------------------- |
| 200    | Requisição bem-sucedida.    |
| 201    | Recurso criado com sucesso. |
| 400    | Erro de validação de dados. |
| 401    | Não autorizado.             |
| 500    | Erro interno do servidor.   |

---

## Contato

Para mais informações ou dúvidas, entre em contato:

- **E-mail:** suporte@example.com
- **GitHub:** [Seu Repositório](https://github.com/seu-repositorio)
