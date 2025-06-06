# API de Profile

Esta documentação descreve os endpoints disponíveis para gerenciamento de perfis de usuário.

## 🔐 Autenticação

Todos os endpoints requerem autenticação via JWT. O token deve ser enviado no header:

```
Authorization: Bearer <token>
```

## 📡 Endpoints

### Obter Perfil
`GET /user/profile`

Obtém o perfil do usuário autenticado.

#### Response (200 OK)
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "userId": "507f1f77bcf86cd799439012",
  "name": "João Silva",
  "email": "joao.silva@example.com",
  "phone": "+5511999999999",
  "company": {
    "name": "Empresa XYZ",
    "position": "Gerente de TI",
    "department": "Tecnologia"
  },
  "preferences": {
    "language": "pt-BR",
    "timezone": "America/Sao_Paulo",
    "notifications": {
      "email": true,
      "whatsapp": true,
      "push": false
    }
  },
  "subscription": {
    "plan": "premium",
    "status": "active",
    "expiresAt": "2024-12-31T23:59:59.999Z"
  },
  "createdAt": "2024-03-21T10:00:00.000Z",
  "updatedAt": "2024-03-21T10:00:00.000Z"
}
```

#### Erros
- `401 Unauthorized`: Não autorizado
- `404 Not Found`: Perfil não encontrado

### Atualizar Perfil
`PUT /user/profile`

Atualiza o perfil do usuário.

#### Request Body
```json
{
  "name": "João Silva Atualizado",
  "phone": "+5511988888888",
  "company": {
    "name": "Nova Empresa XYZ",
    "position": "Diretor de TI",
    "department": "Tecnologia"
  },
  "preferences": {
    "language": "en-US",
    "timezone": "UTC",
    "notifications": {
      "email": true,
      "whatsapp": false,
      "push": true
    }
  }
}
```

#### Response (200 OK)
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "João Silva Atualizado",
  "phone": "+5511988888888",
  "company": {
    "name": "Nova Empresa XYZ",
    "position": "Diretor de TI",
    "department": "Tecnologia"
  },
  "preferences": {
    "language": "en-US",
    "timezone": "UTC",
    "notifications": {
      "email": true,
      "whatsapp": false,
      "push": true
    }
  },
  "updatedAt": "2024-03-21T16:00:00.000Z"
}
```

### Upload de Avatar
`POST /user/profile/avatar`

Faz upload da foto de perfil do usuário.

#### Request Body (multipart/form-data)
- `file`: Imagem (JPG, PNG, max 5MB)

#### Response (201 Created)
```json
{
  "avatarUrl": "https://storage.gwan.com.br/avatars/507f1f77bcf86cd799439011.jpg",
  "message": "Avatar atualizado com sucesso"
}
```

### Remover Avatar
`DELETE /user/profile/avatar`

Remove a foto de perfil do usuário.

#### Response (200 OK)
```json
{
  "message": "Avatar removido com sucesso"
}
```

### Atualizar Preferências
`PATCH /user/profile/preferences`

Atualiza apenas as preferências do usuário.

#### Request Body
```json
{
  "language": "pt-BR",
  "timezone": "America/Sao_Paulo",
  "notifications": {
    "email": true,
    "whatsapp": true,
    "push": true
  }
}
```

#### Response (200 OK)
```json
{
  "preferences": {
    "language": "pt-BR",
    "timezone": "America/Sao_Paulo",
    "notifications": {
      "email": true,
      "whatsapp": true,
      "push": true
    }
  },
  "updatedAt": "2024-03-21T16:30:00.000Z"
}
```

### Atualizar Assinatura
`PATCH /user/profile/subscription`

Atualiza a assinatura do usuário.

#### Request Body
```json
{
  "plan": "enterprise",
  "paymentMethod": "credit_card",
  "billingCycle": "annual"
}
```

#### Response (200 OK)
```json
{
  "subscription": {
    "plan": "enterprise",
    "status": "active",
    "paymentMethod": "credit_card",
    "billingCycle": "annual",
    "expiresAt": "2025-03-21T23:59:59.999Z"
  },
  "updatedAt": "2024-03-21T16:45:00.000Z"
}
```

## 📊 Status da Assinatura

As assinaturas podem ter os seguintes status:

- `active`: Assinatura ativa
- `pending`: Pagamento pendente
- `expired`: Assinatura expirada
- `cancelled`: Assinatura cancelada

## ⚙️ Configurações

### Preferências
```typescript
interface UserPreferences {
  language: string;           // Código do idioma (pt-BR, en-US)
  timezone: string;          // Fuso horário
  notifications: {
    email: boolean;          // Notificações por email
    whatsapp: boolean;       // Notificações por WhatsApp
    push: boolean;          // Notificações push
  }
}
```

### Assinatura
```typescript
interface Subscription {
  plan: string;             // Plano (free, premium, enterprise)
  status: string;           // Status da assinatura
  paymentMethod: string;    // Método de pagamento
  billingCycle: string;     // Ciclo de cobrança (monthly, annual)
  expiresAt: Date;          // Data de expiração
}
```

## 📚 Próximos Passos

- [API de Users](users.md)
- [Guia de Desenvolvimento](../development/guide.md)
- [Monitoramento](../monitoring/metrics.md) 