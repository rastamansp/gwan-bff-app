# API de Chatbots

Esta documentação descreve os endpoints disponíveis para gerenciamento de chatbots.

## 🔐 Autenticação

Todos os endpoints requerem autenticação via JWT. O token deve ser enviado no header:

```
Authorization: Bearer <token>
```

## 📡 Endpoints

### Criar Chatbot
`POST /user/chatbots`

Cria um novo chatbot associado ao usuário.

#### Request Body
```json
{
  "name": "Chatbot de Suporte",
  "description": "Chatbot para atendimento ao cliente",
  "knowledgeBaseId": "507f1f77bcf86cd799439011",
  "settings": {
    "temperature": 0.7,
    "maxTokens": 1000,
    "model": "gpt-4",
    "systemPrompt": "Você é um assistente virtual especializado em atendimento ao cliente.",
    "welcomeMessage": "Olá! Como posso ajudar você hoje?",
    "fallbackMessage": "Desculpe, não entendi sua pergunta. Pode reformular?"
  }
}
```

#### Response (201 Created)
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "userId": "507f1f77bcf86cd799439012",
  "name": "Chatbot de Suporte",
  "description": "Chatbot para atendimento ao cliente",
  "knowledgeBaseId": "507f1f77bcf86cd799439013",
  "settings": {
    "temperature": 0.7,
    "maxTokens": 1000,
    "model": "gpt-4",
    "systemPrompt": "Você é um assistente virtual especializado em atendimento ao cliente.",
    "welcomeMessage": "Olá! Como posso ajudar você hoje?",
    "fallbackMessage": "Desculpe, não entendi sua pergunta. Pode reformular?"
  },
  "status": "active",
  "createdAt": "2024-03-21T10:00:00.000Z",
  "updatedAt": "2024-03-21T10:00:00.000Z"
}
```

#### Erros
- `400 Bad Request`: Dados inválidos fornecidos
- `401 Unauthorized`: Não autorizado
- `404 Not Found`: Base de conhecimento não encontrada

### Listar Chatbots
`GET /user/chatbots`

Lista todos os chatbots do usuário.

#### Query Parameters
- `page` (opcional): Número da página (default: 1)
- `limit` (opcional): Itens por página (default: 10)
- `status` (opcional): Filtrar por status (active, inactive, processing)

#### Response (200 OK)
```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Chatbot de Suporte",
      "description": "Chatbot para atendimento ao cliente",
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

### Obter Chatbot
`GET /user/chatbots/:id`

Obtém detalhes de um chatbot específico.

#### Response (200 OK)
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "userId": "507f1f77bcf86cd799439012",
  "name": "Chatbot de Suporte",
  "description": "Chatbot para atendimento ao cliente",
  "knowledgeBaseId": "507f1f77bcf86cd799439013",
  "settings": {
    "temperature": 0.7,
    "maxTokens": 1000,
    "model": "gpt-4",
    "systemPrompt": "Você é um assistente virtual especializado em atendimento ao cliente.",
    "welcomeMessage": "Olá! Como posso ajudar você hoje?",
    "fallbackMessage": "Desculpe, não entendi sua pergunta. Pode reformular?"
  },
  "status": "active",
  "createdAt": "2024-03-21T10:00:00.000Z",
  "updatedAt": "2024-03-21T10:00:00.000Z",
  "stats": {
    "totalConversations": 150,
    "averageRating": 4.5,
    "lastActive": "2024-03-21T15:30:00.000Z"
  }
}
```

#### Erros
- `401 Unauthorized`: Não autorizado
- `404 Not Found`: Chatbot não encontrado

### Atualizar Chatbot
`PUT /user/chatbots/:id`

Atualiza as configurações de um chatbot.

#### Request Body
```json
{
  "name": "Chatbot de Suporte Atualizado",
  "description": "Nova descrição do chatbot",
  "settings": {
    "temperature": 0.8,
    "maxTokens": 1500,
    "systemPrompt": "Novo prompt do sistema"
  }
}
```

#### Response (200 OK)
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Chatbot de Suporte Atualizado",
  "description": "Nova descrição do chatbot",
  "settings": {
    "temperature": 0.8,
    "maxTokens": 1500,
    "model": "gpt-4",
    "systemPrompt": "Novo prompt do sistema",
    "welcomeMessage": "Olá! Como posso ajudar você hoje?",
    "fallbackMessage": "Desculpe, não entendi sua pergunta. Pode reformular?"
  },
  "updatedAt": "2024-03-21T16:00:00.000Z"
}
```

### Remover Chatbot
`DELETE /user/chatbots/:id`

Remove um chatbot.

#### Response (200 OK)
```json
{
  "message": "Chatbot removido com sucesso"
}
```

### Iniciar Conversa
`POST /user/chatbots/:id/conversations`

Inicia uma nova conversa com o chatbot.

#### Request Body
```json
{
  "message": "Olá, preciso de ajuda com meu pedido"
}
```

#### Response (201 Created)
```json
{
  "conversationId": "507f1f77bcf86cd799439014",
  "message": {
    "id": "507f1f77bcf86cd799439015",
    "role": "assistant",
    "content": "Olá! Como posso ajudar você com seu pedido?",
    "timestamp": "2024-03-21T16:30:00.000Z"
  }
}
```

### Enviar Mensagem
`POST /user/chatbots/:id/conversations/:conversationId/messages`

Envia uma mensagem em uma conversa existente.

#### Request Body
```json
{
  "message": "Meu pedido #12345 está atrasado"
}
```

#### Response (201 Created)
```json
{
  "message": {
    "id": "507f1f77bcf86cd799439016",
    "role": "assistant",
    "content": "Vou verificar o status do seu pedido #12345...",
    "timestamp": "2024-03-21T16:35:00.000Z"
  }
}
```

## 📊 Status do Chatbot

Os chatbots podem ter os seguintes status:

- `active`: Chatbot ativo e pronto para uso
- `inactive`: Chatbot desativado
- `processing`: Chatbot em processamento (ex: atualizando base de conhecimento)
- `error`: Erro no chatbot

## ⚙️ Configurações

### Settings
```typescript
interface ChatbotSettings {
  temperature: number;      // 0.0 a 1.0
  maxTokens: number;        // Máximo de tokens por resposta
  model: string;           // Modelo de IA (gpt-4, gpt-3.5-turbo)
  systemPrompt: string;    // Prompt do sistema
  welcomeMessage: string;  // Mensagem de boas-vindas
  fallbackMessage: string; // Mensagem de fallback
}
```

## 📚 Próximos Passos

- [Knowledge Base API](knowledge-base.md)
- [Guia de Desenvolvimento](../development/guide.md)
- [Monitoramento](../monitoring/metrics.md) 