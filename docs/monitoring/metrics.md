# Métricas de Monitoramento

Esta documentação descreve o sistema de monitoramento do GWAN BFF.

## 📊 Visão Geral

O sistema utiliza as seguintes ferramentas para monitoramento:

- **Winston**: Logs estruturados
- **Health Checks**: Verificação de saúde dos serviços
- **Logs de Sistema**: Monitoramento de recursos

## 🔍 Métricas Principais

### Métricas de Aplicação

#### Health Checks
```typescript
// Endpoint: GET /api/health
{
  "status": "healthy",
  "timestamp": "2024-03-21T10:00:00.000Z",
  "service": "gwan-bff-app",
  "checks": {
    "database": "up",
    "rabbitmq": "up",
    "minio": "up"
  }
}
```

#### Logs de Requisições
```json
{
  "timestamp": "2024-03-21T10:00:00.000Z",
  "level": "info",
  "context": "HTTP",
  "method": "POST",
  "path": "/api/v1/chatbots",
  "statusCode": 200,
  "duration": 150,
  "userAgent": "Mozilla/5.0...",
  "ip": "127.0.0.1"
}
```

#### Logs de Autenticação
```json
{
  "timestamp": "2024-03-21T10:00:00.000Z",
  "level": "info",
  "context": "AuthService",
  "action": "login",
  "status": "success",
  "userId": "user123",
  "ip": "127.0.0.1"
}
```

#### Logs de Chatbots
```json
{
  "timestamp": "2024-03-21T10:00:00.000Z",
  "level": "info",
  "context": "ChatbotService",
  "action": "process_message",
  "botId": "bot123",
  "messageId": "msg123",
  "duration": 150,
  "tokens": 100,
  "status": "success"
}
```

#### Logs de Knowledge Base
```json
{
  "timestamp": "2024-03-21T10:00:00.000Z",
  "level": "info",
  "context": "KnowledgeService",
  "action": "process_document",
  "baseId": "base123",
  "documentId": "doc123",
  "status": "processing",
  "progress": 50
}
```

### Métricas de Sistema

#### Logs de Recursos
```json
{
  "timestamp": "2024-03-21T10:00:00.000Z",
  "level": "info",
  "context": "SystemMetrics",
  "cpu": {
    "usage": 45.2,
    "cores": 4
  },
  "memory": {
    "total": 8589934592,
    "used": 4294967296,
    "free": 4294967296
  },
  "disk": {
    "total": 107374182400,
    "used": 53687091200,
    "free": 53687091200
  }
}
```

#### Logs de Banco de Dados
```json
{
  "timestamp": "2024-03-21T10:00:00.000Z",
  "level": "info",
  "context": "DatabaseService",
  "action": "query",
  "collection": "users",
  "operation": "find",
  "duration": 50,
  "status": "success"
}
```

#### Logs de RabbitMQ
```json
{
  "timestamp": "2024-03-21T10:00:00.000Z",
  "level": "info",
  "context": "RabbitMQService",
  "action": "publish",
  "queue": "notifications",
  "messageId": "msg123",
  "status": "success"
}
```

#### Logs de MinIO
```json
{
  "timestamp": "2024-03-21T10:00:00.000Z",
  "level": "info",
  "context": "MinioService",
  "action": "upload",
  "bucket": "datasets",
  "fileId": "file123",
  "size": 1048576,
  "status": "success"
}
```

## 📈 Dashboards

### Logs Consolidados
- Visão geral do sistema
- Status dos serviços
- Erros e avisos
- Performance

### Logs de Aplicação
- Requisições HTTP
- Autenticação
- Operações de negócio
- Erros

### Logs de Sistema
- Uso de recursos
- Conexões de banco
- Filas de mensagens
- Armazenamento

## 🚨 Alertas

### Alertas de Sistema
- Serviço indisponível
- Erros críticos
- Uso alto de recursos
- Falhas de integração

### Alertas de Negócio
- Falhas de processamento
- Erros de integração
- Problemas de performance
- Violações de segurança

## 📝 Logs

### Estrutura dos Logs
```json
{
  "timestamp": "2024-03-21T10:00:00.000Z",
  "level": "info",
  "context": "ServiceName",
  "action": "action_name",
  "message": "Descrição da ação",
  "metadata": {
    "key1": "value1",
    "key2": "value2"
  }
}
```

### Níveis de Log
- `error`: Erros críticos
- `warn`: Avisos
- `info`: Informações gerais
- `debug`: Debug
- `trace`: Rastreamento detalhado

### Filtros de Log
```typescript
// Configuração por ambiente
const logConfig = {
  production: {
    level: 'info',
    exclude: ['debug', 'trace']
  },
  development: {
    level: 'debug',
    exclude: ['trace']
  },
  test: {
    level: 'trace',
    exclude: []
  }
};
```

## 🔄 Retenção de Dados

### Logs
- Produção: 30 dias
- Desenvolvimento: 7 dias
- Teste: 3 dias

## 📚 Próximos Passos

- [Logs](logs.md)
- [Alertas](alerts.md)
- [Guia de Desenvolvimento](../development/guide.md) 