# Alertas

Esta documentação descreve o sistema de alertas do GWAN BFF.

## 📊 Visão Geral

O sistema utiliza logs estruturados e health checks para monitoramento e alertas. Os alertas são gerados com base em:

- Logs de erro
- Health checks
- Métricas de sistema
- Eventos de negócio

## 🚨 Tipos de Alertas

### Alertas Críticos

#### Aplicação
- Serviço indisponível
- Taxa de erro > 10%
- Latência > 2s
- Falhas de autenticação

#### Workers
- Worker indisponível
- Backlog de mensagens > 1000
- Taxa de erro > 5%
- Falhas de processamento

#### Banco de Dados
- Conexão indisponível
- Conexões ativas > 80%
- Operações lentas > 1s
- Erros de escrita

### Alertas de Aviso

#### Recursos
- CPU > 70%
- Memória > 80%
- Disco > 85%
- Conexões > 60%

#### Chatbots
- Taxa de erro > 2%
- Latência > 1s
- Quota OpenAI > 80%
- Falhas de integração

## 📨 Métodos de Notificação

### Email
```typescript
interface EmailAlert {
  to: string[];
  subject: string;
  body: string;
  priority: 'high' | 'normal' | 'low';
  metadata: {
    service: string;
    level: 'critical' | 'warning';
    timestamp: string;
  };
}
```

### Logs
```json
{
  "timestamp": "2024-03-21T10:00:00.000Z",
  "level": "error",
  "context": "AlertService",
  "type": "system_alert",
  "severity": "critical",
  "message": "Serviço indisponível",
  "metadata": {
    "service": "chatbot-api",
    "duration": "5m",
    "status": "down"
  }
}
```

## 🔕 Gerenciamento de Alertas

### Silenciamento
- Por serviço
- Por tipo de alerta
- Por duração
- Por ambiente

### Agrupamento
- Por serviço
- Por severidade
- Por tipo
- Por ambiente

### Rotas de Notificação
```typescript
interface AlertRoute {
  service: string;
  level: 'critical' | 'warning';
  channels: {
    email?: string[];
    slack?: string;
    telegram?: string;
  };
  schedule: {
    start: string;
    end: string;
    timezone: string;
  };
}
```

## 📊 Dashboard de Alertas

### Visão Geral
- Alertas ativos
- Histórico
- Estatísticas
- Tendências

### Filtros
- Por serviço
- Por severidade
- Por período
- Por status

## 📚 Próximos Passos

- [Métricas](metrics.md)
- [Logs](logs.md)
- [Guia de Troubleshooting](../troubleshooting/guide.md) 