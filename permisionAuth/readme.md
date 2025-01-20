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

| Método | Endpoint      | Descrição                    | Autenticação Necessária |
| ------ | ------------- | ---------------------------- | ----------------------- |
| POST   | `/api/login`  | Autentica o usuário.         | Não                     |
| POST   | `/api/logout` | Realiza o logout do usuário. | Sim                     |
| POST   | `/api/users`  | Cria um novo usuário.        | Sim (ADMIN)             |
| GET    | `/api/users`  | Lista todos os usuários.     | Sim                     |

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
      "token": "Bearer abcdef...",
      "refresh": "xyz123..."
    }
  }
  ```

### POST `/api/logout`

**Descrição:** Finaliza a sessão do usuário, removendo o refresh token.

- **Headers:**
  ```json
  {
    "Authorization": "Bearer {token}"
  }
  ```
- **Resposta (200):**
  ```json
  {
    "success": true,
    "message": "Logout successful"
  }
  ```

### POST `/api/users`

**Descrição:** Cria um novo usuário.

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
- **Resposta (201):**
  ```json
  {
    "success": true,
    "message": "User created successfully",
    "data": {
      "id": "123",
      "name": "John Doe",
      "email": "johndoe@example.com",
      "role": "USER"
    }
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
