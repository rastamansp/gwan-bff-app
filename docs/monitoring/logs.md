# Logs

Esta documentação descreve o sistema de logs do GWAN BFF.

## 📊 Visão Geral

O sistema utiliza Winston para geração e gerenciamento de logs estruturados. Os logs são armazenados em arquivos e podem ser consultados através de ferramentas de busca.

## 📝 Estrutura dos Logs

### Formato JSON
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

### Contextos
- `AppModule`: Logs da aplicação
- `ChatbotService`: Logs de chatbots
- `KnowledgeService`: Logs de knowledge base
- `AuthService`: Logs de autenticação
- `UserService`: Logs de usuários
- `WorkerService`: Logs de workers
- `DatabaseService`: Logs de banco de dados
- `RabbitMQService`: Logs de mensageria
- `MinioService`: Logs de armazenamento

## 📚 Coleta de Logs

### Configuração do Winston
```typescript
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

const logConfig = {
  transports: [
    // Console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    }),
    // Arquivo
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ]
};

@Module({
  imports: [
    WinstonModule.forRoot(logConfig)
  ]
})
export class AppModule {}
```

## 🔍 Consulta de Logs

### Busca em Arquivos
```bash
# Buscar por nível
grep '"level":"error"' logs/combined.log

# Buscar por contexto
grep '"context":"ChatbotService"' logs/combined.log

# Buscar por período
grep '"timestamp":"2024-03-21"' logs/combined.log

# Buscar por traceId
grep '"traceId":"abc123"' logs/combined.log
```

### Filtros Comuns
```bash
# Erros de chatbot
grep '"context":"ChatbotService"\|"level":"error"' logs/combined.log

# Autenticação
grep '"context":"AuthService"\|"action":"login"' logs/combined.log

# Performance
grep '"duration":[0-9]\{3,\}' logs/combined.log

# Erros de banco
grep '"context":"DatabaseService"\|"level":"error"' logs/combined.log
```

## 📊 Visualização

### Logs por Nível
```bash
# Contar logs por nível
grep -o '"level":"[^"]*"' logs/combined.log | sort | uniq -c

# Contar erros por contexto
grep '"level":"error"' logs/combined.log | grep -o '"context":"[^"]*"' | sort | uniq -c

# Contar erros por ação
grep '"level":"error"' logs/combined.log | grep -o '"action":"[^"]*"' | sort | uniq -c
```

### Logs por Período
```bash
# Logs por hora
grep -o '"timestamp":"[^"]*"' logs/combined.log | cut -d'T' -f2 | cut -d':' -f1 | sort | uniq -c

# Logs por dia
grep -o '"timestamp":"[^"]*"' logs/combined.log | cut -d'T' -f1 | sort | uniq -c
```

## 🔄 Rotação de Logs

### Configuração
```bash
# /etc/logrotate.d/gwan-bff
/var/log/gwan-bff/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 0640 gwan gwan
    sharedscripts
    postrotate
        [ -f /var/run/gwan-bff.pid ] && kill -USR1 $(cat /var/run/gwan-bff.pid)
    endscript
}
```

## 🔒 Segurança

### Sanitização
```typescript
function sanitizeLogData(data: any): any {
  const sensitiveFields = [
    'password',
    'token',
    'secret',
    'key',
    'authorization'
  ];

  if (typeof data !== 'object' || data === null) {
    return data;
  }

  const sanitized = { ...data };
  for (const field of sensitiveFields) {
    if (field in sanitized) {
      sanitized[field] = '[REDACTED]';
    }
  }

  return sanitized;
}
```

### Retenção
- Produção: 30 dias
- Desenvolvimento: 7 dias
- Teste: 3 dias

## 📚 Próximos Passos

- [Métricas](metrics.md)
- [Alertas](alerts.md)
### Kibana
```json
// Exemplo de query
{
  "query": {
    "bool": {
      "must": [
        { "match": { "level": "error" } },
        { "match": { "context": "ChatbotService" } },
        { "range": {
            "timestamp": {
              "gte": "2024-03-21T00:00:00.000Z",
              "lte": "2024-03-21T23:59:59.999Z"
            }
          }
        }
      ]
    }
  }
}
```

### Elasticsearch
```bash
# Buscar erros
curl -X GET "localhost:9200/gwan-bff-*/_search" -H 'Content-Type: application/json' -d'
{
  "query": {
    "match": {
      "level": "error"
    }
  }
}'

# Buscar por contexto
curl -X GET "localhost:9200/gwan-bff-*/_search" -H 'Content-Type: application/json' -d'
{
  "query": {
    "match": {
      "context": "ChatbotService"
    }
  }
}'

# Buscar por traceId
curl -X GET "localhost:9200/gwan-bff-*/_search" -H 'Content-Type: application/json' -d'
{
  "query": {
    "match": {
      "traceId": "abc123"
    }
  }
}'
```

## 📈 Visualização

### Grafana
```json
// Exemplo de dashboard
{
  "panels": [
    {
      "title": "Logs por Nível",
      "type": "graph",
      "datasource": "Elasticsearch",
      "targets": [
        {
          "query": "level:error OR level:warn",
          "metrics": [
            {
              "type": "count",
              "field": "level"
            }
          ],
          "bucketAggs": [
            {
              "type": "date_histogram",
              "field": "timestamp",
              "interval": "1h"
            }
          ]
        }
      ]
    }
  ]
}
```

## 🔄 Rotação de Logs

### Logrotate
```conf
# /etc/logrotate.d/gwan
/var/log/gwan/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 0640 gwan gwan
    sharedscripts
    postrotate
        /usr/bin/killall -USR1 node
    endscript
}
```

## 🛡️ Segurança

### Sanitização
```typescript
// Sanitizar dados sensíveis
const sanitizeLog = (log: any) => {
  const sensitiveFields = ['password', 'token', 'apiKey'];
  
  return Object.entries(log).reduce((acc, [key, value]) => {
    if (sensitiveFields.includes(key)) {
      acc[key] = '***';
    } else if (typeof value === 'object') {
      acc[key] = sanitizeLog(value);
    } else {
      acc[key] = value;
    }
    return acc;
  }, {});
};
```

### Retenção
```yaml
# Elasticsearch ILM Policy
{
  "policy": {
    "phases": {
      "hot": {
        "min_age": "0ms",
        "actions": {
          "rollover": {
            "max_age": "7d",
            "max_size": "50gb"
          }
        }
      },
      "warm": {
        "min_age": "7d",
        "actions": {
          "shrink": {
            "number_of_shards": 1
          }
        }
      },
      "cold": {
        "min_age": "30d",
        "actions": {
          "searchable_snapshot": {
            "snapshot_repository": "backup"
          }
        }
      },
      "delete": {
        "min_age": "90d",
        "actions": {
          "delete": {}
        }
      }
    }
  }
}
```

## 📚 Próximos Passos

- [Métricas](metrics.md)
- [Alertas](alerts.md)
- [Troubleshooting](../troubleshooting/guide.md) 