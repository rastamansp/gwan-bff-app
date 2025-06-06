# Workers

Esta documentação descreve os workers do GWAN BFF, responsáveis por processar tarefas assíncronas.

## 🏗️ Arquitetura dos Workers

Os workers são implementados usando RabbitMQ como message broker e seguem o padrão de processamento de mensagens com filas.

### Estrutura
```
src/workers/
├── base/                   # Classes base
│   ├── worker.base.ts      # Worker base
│   └── queue.base.ts       # Queue base
├── email/                  # Worker de email
├── chatbot/                # Worker de chatbot
├── knowledge/              # Worker de knowledge base
└── index.ts                # Ponto de entrada
```

## 🤖 Workers Disponíveis

### Email Worker
Processa o envio de emails assíncronos.

#### Filas
- `email.notification`: Emails de notificação
- `email.verification`: Emails de verificação
- `email.password-reset`: Emails de recuperação de senha

#### Configuração
```typescript
interface EmailWorkerConfig {
  queue: string;
  prefetch: number;
  retryDelay: number;
  maxRetries: number;
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
}
```

#### Exemplo de Uso
```typescript
// Publicar mensagem
await emailQueue.publish({
  type: 'notification',
  to: 'user@example.com',
  subject: 'Bem-vindo!',
  template: 'welcome',
  data: {
    name: 'João',
    activationLink: 'https://...'
  }
});

// Processar mensagem
@Worker('email.notification')
async processEmail(message: EmailMessage): Promise<void> {
  await this.mailerService.sendMail({
    to: message.to,
    subject: message.subject,
    template: message.template,
    context: message.data
  });
}
```

### Chatbot Worker
Processa mensagens de chatbots de forma assíncrona.

#### Filas
- `chatbot.message`: Processamento de mensagens
- `chatbot.training`: Treinamento de chatbots
- `chatbot.embedding`: Geração de embeddings

#### Configuração
```typescript
interface ChatbotWorkerConfig {
  queue: string;
  prefetch: number;
  retryDelay: number;
  maxRetries: number;
  openai: {
    apiKey: string;
    model: string;
    maxTokens: number;
  };
}
```

#### Exemplo de Uso
```typescript
// Publicar mensagem
await chatbotQueue.publish({
  type: 'message',
  botId: '123',
  message: 'Olá, como posso ajudar?',
  conversationId: '456'
});

// Processar mensagem
@Worker('chatbot.message')
async processMessage(message: ChatbotMessage): Promise<void> {
  const response = await this.chatbotService.processMessage(
    message.botId,
    message.message,
    message.conversationId
  );
  
  await this.notificationService.notifyUser(
    message.userId,
    response
  );
}
```

### Knowledge Worker
Processa documentos enviados via API start-process de forma assíncrona.

#### Fluxo de Processamento
1. API `/user/knowledge-base/:id/start-process` envia mensagem para RabbitMQ
2. Knowledge Worker consome mensagem da fila
3. Worker faz download do arquivo do MinIO
4. Processa documento (chunking + embeddings)
5. Salva chunks e embeddings no MongoDB
6. Atualiza status do arquivo

#### Filas
- `knowledge.process`: Processamento de documentos PDF

#### Mensagem RabbitMQ
```typescript
interface ProcessDocumentMessage {
  action: 'process_document';
  userId: string;
  knowledgeBaseId: string;
  fileId: string;
  priority: 'low' | 'normal' | 'high';
  timestamp: string;
}
```

#### Configuração
```typescript
interface KnowledgeWorkerConfig {
  queue: string;
  prefetch: number;
  retryDelay: number;
  maxRetries: number;
  minio: {
    endpoint: string;
    port: number;
    useSSL: boolean;
    accessKey: string;
    secretKey: string;
    bucket: string;
  };
  openai: {
    apiKey: string;
    embeddingModel: string;
  };
}
```

#### Exemplo de Uso
```typescript
// API start-process publica na fila
await knowledgeQueue.publish({
  action: 'process_document',
  userId: '507f1f77bcf86cd799439012',
  knowledgeBaseId: '507f1f77bcf86cd799439011',
  fileId: '507f1f77bcf86cd799439014',
  priority: 'normal',
  timestamp: new Date().toISOString()
});

// Processar documento
@Worker('knowledge.process')
async processDocument(message: ProcessDocumentMessage): Promise<void> {
  try {
    // 1. Atualizar status para 'processing'
    await this.fileService.updateStatus(message.fileId, 'processing');
    
    // 2. Download do arquivo do MinIO
    const fileBuffer = await this.minioService.downloadFile(
      message.userId,
      message.fileId
    );
    
    // 3. Extrair texto do PDF
    const text = await this.pdfService.extractText(fileBuffer);
    
    // 4. Dividir em chunks
    const chunks = await this.chunkingService.createChunks(text, {
      chunkSize: 1000,
      chunkOverlap: 200
    });
    
    // 5. Gerar embeddings
    const embeddings = await this.embeddingService.generateEmbeddings(chunks);
    
    // 6. Salvar documento processado
    await this.documentService.create({
      fileId: message.fileId,
      chunks,
      embeddings,
      metadata: {
        totalChunks: chunks.length,
        totalTokens: chunks.join('').length,
        chunkSize: 1000,
        embeddingModel: 'text-embedding-ada-002'
      }
    });
    
    // 7. Atualizar status para 'processed'
    await this.fileService.updateStatus(message.fileId, 'processed');
    
    // 8. Atualizar contador da knowledge base
    await this.knowledgeBaseService.incrementProcessedCount(
      message.knowledgeBaseId
    );
    
  } catch (error) {
    // Atualizar status para 'failed'
    await this.fileService.updateStatus(message.fileId, 'failed');
    throw error;
  }
}
```

## 🔄 Fluxo de Processamento

1. **Publicação**
   - Serviço publica mensagem na fila
   - Mensagem é persistida no RabbitMQ
   - Confirmação de recebimento

2. **Consumo**
   - Worker consome mensagem da fila
   - Processa a mensagem
   - Confirma o processamento

3. **Retry**
   - Em caso de erro, mensagem é reenviada
   - Número máximo de tentativas configurável
   - Delay entre tentativas configurável

4. **Dead Letter**
   - Mensagens com falha após max retries
   - Enviadas para fila de dead letter
   - Notificação de erro

## 📊 Monitoramento

### Métricas
```prometheus
# Mensagens processadas
worker_messages_processed_total{worker="email",queue="notification"}

# Tempo de processamento
worker_processing_time_seconds{worker="email",queue="notification"}

# Erros
worker_errors_total{worker="email",queue="notification"}

# Retries
worker_retries_total{worker="email",queue="notification"}
```

### Logs
```json
{
  "timestamp": "2024-03-21T10:00:00.000Z",
  "level": "info",
  "worker": "email",
  "queue": "notification",
  "messageId": "abc123",
  "action": "process",
  "status": "success",
  "duration": 150,
  "metadata": {
    "to": "user@example.com",
    "template": "welcome"
  }
}
```

## 🚀 Executando Workers

### Desenvolvimento
```bash
# Iniciar todos os workers
npm run workers:dev

# Iniciar worker específico
npm run workers:dev -- --worker=email
```

### Produção
```bash
# Iniciar todos os workers
npm run workers:prod

# Iniciar worker específico
npm run workers:prod -- --worker=email
```

### Docker
```bash
# Iniciar workers
docker-compose up -d workers

# Logs
docker-compose logs -f workers
```

## 📚 Próximos Passos

- [Email Worker](email-worker.md)
- [Chatbot Worker](chatbot-worker.md)
- [Knowledge Worker](knowledge-worker.md)
- [Monitoramento](../monitoring/metrics.md) 