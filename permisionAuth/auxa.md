### PUT `/api/admin/user`

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
