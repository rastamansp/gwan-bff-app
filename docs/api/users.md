# API de Users

Esta documentação descreve os endpoints disponíveis para gerenciamento de usuários.

## 🔐 Autenticação

Todos os endpoints requerem autenticação via JWT. O token deve ser enviado no header:

```
Authorization: Bearer <token>
```

## 📡 Endpoints

### Registrar Usuário
`POST /auth/register`

Registra um novo usuário no sistema.

#### Request Body
```json
{
  "name": "João Silva",
  "email": "joao.silva@example.com",
  "password": "Senha@123",
  "phone": "+5511999999999",
  "company": {
    "name": "Empresa XYZ",
    "position": "Gerente de TI",
    "department": "Tecnologia"
  }
}
```

#### Response (201 Created)
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "João Silva",
  "email": "joao.silva@example.com",
  "phone": "+5511999999999",
  "company": {
    "name": "Empresa XYZ",
    "position": "Gerente de TI",
    "department": "Tecnologia"
  },
  "role": "user",
  "status": "pending",
  "createdAt": "2024-03-21T10:00:00.000Z"
}
```

#### Erros
- `400 Bad Request`: Dados inválidos fornecidos
- `409 Conflict`: Email já cadastrado

### Login
`POST /auth/login`

Realiza o login do usuário.

#### Request Body
```json
{
  "email": "joao.silva@example.com",
  "password": "Senha@123"
}
```

#### Response (200 OK)
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "João Silva",
    "email": "joao.silva@example.com",
    "role": "user",
    "status": "active"
  }
}
```

#### Erros
- `400 Bad Request`: Dados inválidos fornecidos
- `401 Unauthorized`: Credenciais inválidas
- `403 Forbidden`: Usuário inativo

### Refresh Token
`POST /auth/refresh`

Renova o token de acesso usando o refresh token.

#### Request Body
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Response (200 OK)
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Logout
`POST /auth/logout`

Realiza o logout do usuário.

#### Response (200 OK)
```json
{
  "message": "Logout realizado com sucesso"
}
```

### Esqueci Minha Senha
`POST /auth/forgot-password`

Solicita a recuperação de senha.

#### Request Body
```json
{
  "email": "joao.silva@example.com"
}
```

#### Response (200 OK)
```json
{
  "message": "Email de recuperação enviado"
}
```

### Redefinir Senha
`POST /auth/reset-password`

Redefine a senha do usuário.

#### Request Body
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "password": "NovaSenha@123",
  "confirmPassword": "NovaSenha@123"
}
```

#### Response (200 OK)
```json
{
  "message": "Senha redefinida com sucesso"
}
```

### Verificar Email
`POST /auth/verify-email`

Verifica o email do usuário.

#### Request Body
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Response (200 OK)
```json
{
  "message": "Email verificado com sucesso"
}
```

### Listar Usuários (Admin)
`GET /admin/users`

Lista todos os usuários (apenas para administradores).

#### Query Parameters
- `page` (opcional): Número da página (default: 1)
- `limit` (opcional): Itens por página (default: 10)
- `role` (opcional): Filtrar por papel (user, admin, manager)
- `status` (opcional): Filtrar por status (active, inactive, pending)
- `search` (opcional): Buscar por nome ou email

#### Response (200 OK)
```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "João Silva",
      "email": "joao.silva@example.com",
      "role": "user",
      "status": "active",
      "createdAt": "2024-03-21T10:00:00.000Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

### Atualizar Usuário (Admin)
`PUT /admin/users/:id`

Atualiza um usuário (apenas para administradores).

#### Request Body
```json
{
  "role": "manager",
  "status": "active"
}
```

#### Response (200 OK)
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "João Silva",
  "email": "joao.silva@example.com",
  "role": "manager",
  "status": "active",
  "updatedAt": "2024-03-21T16:00:00.000Z"
}
```

### Remover Usuário (Admin)
`DELETE /admin/users/:id`

Remove um usuário (apenas para administradores).

#### Response (200 OK)
```json
{
  "message": "Usuário removido com sucesso"
}
```

## 📊 Status do Usuário

Os usuários podem ter os seguintes status:

- `active`: Usuário ativo
- `inactive`: Usuário inativo
- `pending`: Aguardando verificação de email
- `blocked`: Usuário bloqueado

## ⚙️ Configurações

### Papéis de Usuário
```typescript
type UserRole = 'user' | 'admin' | 'manager';

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: string;
  company?: {
    name: string;
    position: string;
    department: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Políticas de Senha
- Mínimo de 8 caracteres
- Pelo menos uma letra maiúscula
- Pelo menos uma letra minúscula
- Pelo menos um número
- Pelo menos um caractere especial

## 📚 Próximos Passos

- [API de Profile](profile.md)
- [Guia de Desenvolvimento](../development/guide.md)
- [Monitoramento](../monitoring/metrics.md) 