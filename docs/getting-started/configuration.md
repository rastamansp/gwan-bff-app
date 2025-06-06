# Configuração

Este documento detalha todas as configurações necessárias para o GWAN BFF.

## ⚙️ Variáveis de Ambiente

O arquivo `.env` deve conter as seguintes variáveis:

### Server Configuration
```env
PORT=3000
NODE_ENV=production
API_PREFIX=api/v1
TZ=America/Sao_Paulo
```

### MongoDB Configuration
```env
MONGODB_URI=mongodb://user:password@host:port/database?authSource=admin
```

### RabbitMQ Configuration
```env
RABBITMQ_URL=amqp://user:password@host:port
RABBITMQ_QUEUE=notifications
RABBITMQ_WORKER_PREFETCH=1
RABBITMQ_WORKER_QUEUE=chatbot-processing
RABBITMQ_WORKER_RETRY_DELAY=5000
RABBITMQ_WORKER_MAX_RETRIES=3
```

### SMTP Configuration
```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-password
SMTP_FROM_NAME=GWAN
SMTP_FROM_EMAIL=noreply@gwan.com.br
```

### JWT Configuration
```env
JWT_SECRET=your-secret-key
JWT_EXPIRATION=1d
```

### WhatsApp Configuration
```env
WHATSAPP_API_URL=https://graph.facebook.com/v17.0
WHATSAPP_API_TOKEN=your-whatsapp-api-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
WHATSAPP_BUSINESS_ACCOUNT_ID=your-business-account-id
```

### CORS Configuration
```env
ALLOWED_ORIGINS=https://bff.gwan.com.br,https://www.bff.gwan.com.br,https://admin.gwan.com.br,https://www.admin.gwan.com.br
```

### MinIO Configuration
```env
MINIO_ENDPOINT=minio.gwan.com.br
MINIO_PORT=443
MINIO_USE_SSL=true
MINIO_ACCESS_KEY=your-access-key
MINIO_SECRET_KEY=your-secret-key
MINIO_BUCKET=datasets
```

### Chatbot Configuration
```env
OPENAI_API_KEY=your-openai-api-key
CHATBOT_MAX_TOKENS=1000
CHATBOT_DEFAULT_TEMPERATURE=0.7
```

### User Profile Configuration
```env
DEFAULT_USER_ROLE=user
ALLOWED_USER_ROLES=user,admin,manager
```

## 🔐 Configurações de Segurança

### Produção
Para ambiente de produção, certifique-se de:
1. Usar HTTPS em todas as conexões
2. Configurar certificados SSL válidos
3. Manter as chaves JWT seguras
4. Usar senhas fortes para todos os serviços
5. Configurar CORS adequadamente

### Variáveis Críticas
As seguintes variáveis são críticas para segurança:
```env
NODE_ENV=production
JWT_SECRET=<chave-secreta-forte>
MINIO_USE_SSL=true
```

## 📊 Configurações de Performance

```env
# MongoDB
MONGODB_POOL_SIZE=10

# RabbitMQ
RABBITMQ_PREFETCH=1

# SMTP
SMTP_POOL_MAX=5
```

## 🔍 Monitoramento

```env
LOG_LEVEL=info
ENABLE_HEALTH_CHECKS=true
```

## 🐳 Configuração Docker

Veja [Docker](../deployment/docker.md) para configurações específicas do Docker.

## 📚 Próximos Passos

- [Executando o Projeto](running.md)
- [Ambiente de Produção](../deployment/production.md)
- [Monitoramento](../monitoring/metrics.md) 