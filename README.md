# GWAN BFF (Backend for Frontend)

Backend for Frontend application for GWAN, built with NestJS.

[![NestJS](https://img.shields.io/badge/NestJS-EA2845?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)](https://www.rabbitmq.com/)

## 🚀 Tecnologias

- [NestJS](https://nestjs.com/) - Framework Node.js
- [TypeScript](https://www.typescriptlang.org/) - Superset JavaScript
- [MongoDB](https://www.mongodb.com/) - Banco de dados
- [RabbitMQ](https://www.rabbitmq.com/) - Message broker
- [Nodemailer](https://nodemailer.com/) - Envio de emails

## 📋 Pré-requisitos

- Node.js (v20 ou superior)
- MongoDB (v6 ou superior)
- RabbitMQ (v3.12 ou superior)
- MinIO (v8 ou superior)
- SMTP Server (ou serviço de email)

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/gwan/gwan-bff-app.git
cd gwan-bff-app
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas configurações.

## 📦 Estrutura do Projeto

```
src/
├── config/             # Configurações da aplicação
├── core/              # Camadas da Clean Architecture
│   ├── domain/       # Regras de negócio e entidades
│   ├── application/  # Casos de uso
│   └── infrastructure/ # Implementações concretas
├── modules/          # Módulos da aplicação
│   ├── auth/        # Autenticação
│   ├── chatbots/    # Gerenciamento de chatbots
│   ├── dataset/     # Gerenciamento de datasets
│   ├── health/      # Health check
│   ├── knowledge/   # Bases de conhecimento
│   ├── profile/     # Perfil de usuário
│   ├── rabbitmq/    # Configuração RabbitMQ
│   └── users/       # Gerenciamento de usuários
├── shared/          # Código compartilhado
├── tests/           # Testes da aplicação
├── types/           # Definições de tipos
└── workers/         # Workers da aplicação
```

## 🔍 Endpoints

### Autenticação
- `POST /auth/register` - Registro de usuário
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- `POST /auth/verify` - Verificação de código
  ```json
  {
    "email": "user@example.com",
    "code": "123456"
  }
  ```
- `POST /auth/login` - Login
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- `POST /auth/verify-login` - Verificação de login
  ```json
  {
    "email": "user@example.com",
    "code": "123456"
  }
  ```

### Health Check
- `GET /health` - Status da aplicação
  ```json
  {
    "status": "ok",
    "timestamp": "2024-03-21T10:00:00.000Z"
  }
  ```

### Dataset
- `GET /user/dataset/list` - Lista arquivos do bucket
  ```json
  Response (200 OK):
  [
    {
      "name": "1679676892123-exemplo.pdf",
      "size": 12345,
      "lastModified": "2024-04-30T14:25:43.000Z",
      "etag": "abc123"
    }
  ]

  Errors:
  - 500 Internal Server Error: Se houver erro ao listar arquivos ou se o bucket não existir
  ```

- `POST /user/dataset/upload` - Upload de dataset (PDF)
  ```
  Content-Type: multipart/form-data
  
  Request Body:
  - file: [PDF File] (campo do tipo arquivo, máximo 5MB)
  ```

### Knowledge Base

#### Fluxo de Base de Conhecimento

**1. Criar Base de Conhecimento**
- `POST /user/knowledge-base` - Criar uma nova base de conhecimento
  ```json
  Request Body:
  {
    "name": "Base de Suporte Técnico",
    "description": "Base contendo manuais e documentação técnica"
  }

  Response (201 Created):
  {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439012",
    "name": "Base de Suporte Técnico",
    "description": "Base contendo manuais e documentação técnica",
    "status": "created",
    "fileCount": 0,
    "createdAt": "2024-03-21T10:00:00.000Z",
    "updatedAt": "2024-03-21T10:00:00.000Z"
  }

  Errors:
  - 400 Bad Request: Dados inválidos fornecidos
  - 401 Unauthorized: Não autorizado
  ```

**2. Upload de Arquivo**
- `POST /user/files/upload` - Upload de arquivo para MinIO
  ```
  Content-Type: multipart/form-data
  
  Request Body:
  - file: [PDF File] (máximo 5MB)
  - knowledgeBaseId: "507f1f77bcf86cd799439011"

  Response (201 Created):
  {
    "fileId": "507f1f77bcf86cd799439014",
    "filename": "manual_usuario.pdf",
    "originalName": "Manual do Usuário.pdf",
    "size": 2048576,
    "mimeType": "application/pdf",
    "bucketPath": "user123/knowledge-base/kb456/20240321-manual_usuario.pdf",
    "status": "uploaded",
    "createdAt": "2024-03-21T10:05:00.000Z"
  }

  Errors:
  - 400 Bad Request: Arquivo inválido ou muito grande
  - 401 Unauthorized: Não autorizado
  - 404 Not Found: Base de conhecimento não encontrada
  ```

**3. Listar Bases de Conhecimento**
- `GET /user/knowledge-base` - Listar bases de conhecimento do usuário
  ```json
  Response (200 OK):
  [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Base de Suporte Técnico",
      "description": "Base contendo manuais e documentação técnica",
      "status": "active",
      "fileCount": 3,
      "createdAt": "2024-03-21T10:00:00.000Z",
      "updatedAt": "2024-03-21T10:00:00.000Z"
    }
  ]

  Errors:
  - 401 Unauthorized: Não autorizado
  ```

**4. Buscar Base por ID**
- `GET /user/knowledge-base/:id` - Obter base de conhecimento específica
  ```json
  Response (200 OK):
  {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439012",
    "name": "Base de Suporte Técnico",
    "description": "Base contendo manuais e documentação técnica",
    "status": "active",
    "fileCount": 3,
    "files": [
      {
        "fileId": "507f1f77bcf86cd799439014",
        "filename": "manual_usuario.pdf",
        "status": "processed",
        "uploadedAt": "2024-03-21T10:05:00.000Z"
      }
    ],
    "createdAt": "2024-03-21T10:00:00.000Z",
    "updatedAt": "2024-03-21T10:00:00.000Z"
  }

  Errors:
  - 401 Unauthorized: Não autorizado
  - 404 Not Found: Base de conhecimento não encontrada
  ```

**5. Iniciar Processamento**
- `POST /user/knowledge-base/:id/start-process` - Iniciar processamento de arquivo
  ```json
  Request Body:
  {
    "fileId": "507f1f77bcf86cd799439014"
  }

  Response (202 Accepted):
  {
    "message": "Processamento iniciado",
    "queueId": "process_507f1f77bcf86cd799439015",
    "estimatedTime": "2-5 minutos"
  }

  Errors:
  - 400 Bad Request: Arquivo não encontrado ou já processado
  - 401 Unauthorized: Não autorizado
  - 404 Not Found: Base ou arquivo não encontrado
  ```

**6. Exclusão de Arquivo**
- `DELETE /user/files/:fileId` - Remover arquivo da base de conhecimento
  ```json
  Response (200 OK):
  {
    "message": "Arquivo removido com sucesso"
  }

  Errors:
  - 401 Unauthorized: Não autorizado
  - 404 Not Found: Arquivo não encontrado
  ```

**7. Exclusão de Base**
- `DELETE /user/knowledge-base/:id` - Excluir base de conhecimento
  ```json
  Response (200 OK):
  {
    "message": "Base de conhecimento excluída com sucesso"
  }

  Errors:
  - 401 Unauthorized: Não autorizado
  - 404 Not Found: Base de conhecimento não encontrada
  ```

### Chatbots
- `POST /user/chatbots` - Criar um novo chatbot
  ```json
  Request Body:
  {
    "name": "Chatbot de Suporte",
    "description": "Chatbot para atendimento ao cliente",
    "knowledgeBaseId": "507f1f77bcf86cd799439011",
    "settings": {
      "temperature": 0.7,
      "maxTokens": 1000
    }
  }

  Response (201 Created):
  {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439012",
    "name": "Chatbot de Suporte",
    "description": "Chatbot para atendimento ao cliente",
    "knowledgeBaseId": "507f1f77bcf86cd799439013",
    "settings": {
      "temperature": 0.7,
      "maxTokens": 1000
    },
    "status": "active",
    "createdAt": "2024-03-21T10:00:00.000Z",
    "updatedAt": "2024-03-21T10:00:00.000Z"
  }
  ```

- `GET /user/chatbots` - Listar chatbots do usuário
- `GET /user/chatbots/:id` - Obter detalhes de um chatbot
- `PUT /user/chatbots/:id` - Atualizar configurações do chatbot
- `DELETE /user/chatbots/:id` - Remover chatbot

### Profile
- `GET /user/profile` - Obter perfil do usuário
  ```json
  Response (200 OK):
  {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "Nome do Usuário",
    "company": "Empresa",
    "role": "admin",
    "preferences": {
      "notifications": {
        "email": true,
        "whatsapp": false
      },
      "language": "pt-BR"
    },
    "createdAt": "2024-03-21T10:00:00.000Z",
    "updatedAt": "2024-03-21T10:00:00.000Z"
  }
  ```

- `PUT /user/profile` - Atualizar perfil do usuário
- `PUT /user/profile/preferences` - Atualizar preferências do usuário

### Users (Admin)
- `GET /admin/users` - Listar todos os usuários (apenas admin)
- `GET /admin/users/:id` - Obter detalhes de um usuário
- `PUT /admin/users/:id` - Atualizar dados de um usuário
- `DELETE /admin/users/:id` - Desativar usuário

## 🏗️ Arquitetura

O projeto segue os princípios da Clean Architecture, dividindo a aplicação em camadas bem definidas:

### Core Layer
```
src/core/
├── domain/           # Camada de domínio
│   ├── entities/    # Entidades de negócio
│   ├── errors/      # Erros específicos do domínio
│   ├── services/    # Serviços de domínio
│   └── value-objects/ # Objetos de valor
├── application/      # Camada de aplicação
│   └── use-cases/   # Casos de uso da aplicação
└── infrastructure/   # Camada de infraestrutura
    ├── repositories/ # Implementações dos repositórios
    └── services/    # Serviços externos
```

### Módulos
Cada módulo segue a estrutura da Clean Architecture:
```
modules/{module-name}/
├── domain/          # Entidades e regras específicas do módulo
├── application/     # Casos de uso do módulo
├── infrastructure/  # Implementações específicas
└── presentation/    # Controllers e DTOs
```

## ⚙️ Configuração

O arquivo `.env` deve conter as seguintes variáveis:

```env
# Server Configuration
PORT=3000
NODE_ENV=production
API_PREFIX=api/v1
TZ=America/Sao_Paulo

# MongoDB Configuration
MONGODB_URI=mongodb://user:password@host:port/database?authSource=admin

# RabbitMQ Configuration
RABBITMQ_URL=amqp://user:password@host:port
RABBITMQ_QUEUE=notifications

# SMTP Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-password
SMTP_FROM_NAME=GWAN
SMTP_FROM_EMAIL=noreply@gwan.com.br

# JWT Configuration
JWT_SECRET=your-secret-key
JWT_EXPIRATION=1d

# WhatsApp Configuration
WHATSAPP_API_URL=https://graph.facebook.com/v17.0
WHATSAPP_API_TOKEN=your-whatsapp-api-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
WHATSAPP_BUSINESS_ACCOUNT_ID=your-business-account-id

# CORS Configuration
ALLOWED_ORIGINS=https://bff.gwan.com.br,https://www.bff.gwan.com.br,https://admin.gwan.com.br,https://www.admin.gwan.com.br

# MinIO Configuration
MINIO_ENDPOINT=minio.gwan.com.br
MINIO_PORT=443
MINIO_USE_SSL=true
MINIO_ACCESS_KEY=your-access-key
MINIO_SECRET_KEY=your-secret-key
MINIO_BUCKET=datasets

# Chatbot Configuration
OPENAI_API_KEY=your-openai-api-key
CHATBOT_MAX_TOKENS=1000
CHATBOT_DEFAULT_TEMPERATURE=0.7

# User Profile Configuration
DEFAULT_USER_ROLE=user
ALLOWED_USER_ROLES=user,admin,manager

# RabbitMQ Workers
RABBITMQ_WORKER_PREFETCH=1
RABBITMQ_WORKER_QUEUE=chatbot-processing
RABBITMQ_WORKER_RETRY_DELAY=5000
RABBITMQ_WORKER_MAX_RETRIES=3
```

## 🚀 Workers

O projeto utiliza workers para processamento assíncrono:

### Email Worker
```bash
npm run start:email-worker
```

### Chatbot Processing Worker
```bash
npm run start:chatbot-worker
```

### Knowledge Base Processing Worker
```bash
npm run start:knowledge-worker
```

## 🧪 Testes

### Estrutura de Testes
```
src/tests/
├── unit/           # Testes unitários
├── integration/    # Testes de integração
└── e2e/           # Testes end-to-end
```

### Comandos de Teste
```bash
# Testes unitários
npm run test

# Testes de integração
npm run test:integration

# Testes e2e
npm run test:e2e

# Cobertura de testes
npm run test:cov

# Testes específicos de um módulo
npm run test:module -- --module=auth
npm run test:module -- --module=chatbots
```

## 📊 Monitoramento

### Logs
Os logs são gerados em diferentes níveis:
- `[Bootstrap]` - Logs de inicialização
- `[EmailWorker]` - Logs do worker de email
- `[ChatbotWorker]` - Logs do worker de chatbots
- `[KnowledgeWorker]` - Logs do worker de bases de conhecimento
- `[MongoDB]` - Logs de conexão com o MongoDB
- `[RabbitMQ]` - Logs de conexão com o RabbitMQ

### Métricas
- Tempo de resposta por endpoint
- Taxa de erros por módulo
- Uso de recursos dos workers
- Status das filas RabbitMQ
- Conexões ativas com MongoDB

## 🚀 Deploy

### Docker Compose
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file: .env.production
    depends_on:
      - mongodb
      - rabbitmq
      - minio

  email-worker:
    build: .
    command: npm run start:email-worker
    env_file: .env.production
    depends_on:
      - rabbitmq

  chatbot-worker:
    build: .
    command: npm run start:chatbot-worker
    env_file: .env.production
    depends_on:
      - rabbitmq

  knowledge-worker:
    build: .
    command: npm run start:knowledge-worker
    env_file: .env.production
    depends_on:
      - rabbitmq

  mongodb:
    image: mongo:6
    volumes:
      - mongodb_data:/data/db

  rabbitmq:
    image: rabbitmq:3.12-management
    ports:
      - "5672:5672"
      - "15672:15672"

  minio:
    image: minio/minio
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/data
    environment:
      MINIO_ROOT_USER: ${MINIO_ACCESS_KEY}
      MINIO_ROOT_PASSWORD: ${MINIO_SECRET_KEY}

volumes:
  mongodb_data:
  minio_data:
```

### Configurações de Produção

1. **Segurança**
   - Use HTTPS em todas as conexões
   - Configure certificados SSL válidos
   - Mantenha as chaves JWT seguras
   - Use senhas fortes para todos os serviços
   - Configure CORS adequadamente

2. **Monitoramento**
   - Configure logs estruturados
   - Implemente health checks
   - Monitore uso de recursos
   - Configure alertas
   - Monitore status dos workers
   - Configure métricas de performance

3. **Backup**
   - Configure backup regular do MongoDB
   - Mantenha backup dos arquivos do MinIO
   - Documente procedimentos de recuperação

4. **Escalabilidade**
   - Configure limites de recursos no Docker
   - Implemente rate limiting
   - Configure conexões pool para serviços externos
   - Configure auto-scaling para workers
   - Implemente circuit breakers

## 🔧 Troubleshooting

### Problemas Comuns

1. **Erro de conexão com MongoDB**
   - Verifique se o MongoDB está rodando
   - Confirme as credenciais no arquivo .env
   - Verifique se a porta está correta

2. **Erro de conexão com RabbitMQ**
   - Verifique se o RabbitMQ está rodando
   - Confirme as credenciais no arquivo .env
   - Verifique se a porta está correta

3. **Erro de envio de email**
   - Verifique as configurações do SMTP
   - Confirme se o serviço de email está funcionando
   - Verifique os logs do worker de email

## 🤝 Contribuindo

1. Faça o fork do projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **GWAN Team** - *Desenvolvimento* - [gwan](https://github.com/gwan)

## 🙏 Agradecimentos

- NestJS Team
- MongoDB Team
- RabbitMQ Team
- MinIO Team
- Todos os contribuidores

## Estrutura de Armazenamento de Arquivos

O sistema utiliza uma combinação de MinIO para armazenamento de arquivos e MongoDB para metadados, proporcionando uma solução robusta e escalável.

### Configuração do MinIO

O sistema requer as seguintes variáveis de ambiente para configuração do MinIO:

```env
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=datasets
```

### Estrutura de Diretórios

Os arquivos são organizados no MinIO seguindo a estrutura:
```
datasets/
  └── {userId}/
      └── {timestamp}-{filename}
```

### Modelos de Dados

#### BucketFile (MongoDB)
```typescript
{
    _id: ObjectId;           // ID único do arquivo
    userId: ObjectId;        // ID do usuário proprietário
    knowledgeBaseId: ObjectId; // ID da base de conhecimento
    originalName: string;    // Nome original do arquivo
    filename: string;        // Nome do arquivo no MinIO (com timestamp)
    size: number;           // Tamanho em bytes
    mimeType: string;       // Tipo MIME do arquivo
    bucketPath: string;     // Caminho completo no MinIO
    status: string;         // Status: 'uploaded' | 'processing' | 'processed' | 'failed'
    uploadedAt: Date;       // Data do upload
    processedAt?: Date;     // Data do processamento (opcional)
}
```

#### KnowledgeBase (MongoDB)
```typescript
{
    _id: ObjectId;          // ID único da base
    userId: ObjectId;       // ID do usuário proprietário
    name: string;           // Nome da base de conhecimento
    description: string;    // Descrição da base
    status: string;         // Status: 'created' | 'active' | 'processing' | 'error'
    fileCount: number;      // Número de arquivos vinculados
    createdAt: Date;        // Data de criação
    updatedAt: Date;        // Data da última atualização
}
```

#### Document (MongoDB - chunks processados)
```typescript
{
    _id: ObjectId;          // ID único do documento processado
    fileId: ObjectId;       // ID do arquivo original
    chunks: string[];       // Array de chunks de texto
    embeddings: number[][]; // Array de embeddings dos chunks
    metadata: {             // Metadados do processamento
        totalChunks: number;
        totalTokens: number;
        chunkSize: number;
        embeddingModel: string;
    };
    processedAt: Date;      // Data do processamento
}
```

### Funcionalidades Implementadas

#### DatasetService

1. **Upload de Arquivos**
   ```typescript
   handleFileUpload(file: Express.Multer.File, userId: string): Promise<BucketFile>
   ```
   - Faz upload do arquivo para o MinIO
   - Gera URL temporária de acesso
   - Salva metadados no MongoDB
   - Organiza arquivos por usuário

2. **Listagem de Arquivos**
   ```typescript
   listBucketContents(userId: string): Promise<BucketFile[]>
   ```
   - Lista todos os arquivos do usuário
   - Atualiza URLs temporárias
   - Retorna metadados completos

3. **Deleção de Arquivos**
   ```typescript
   deleteFile(fileId: string, userId: string): Promise<void>
   ```
   - Remove arquivo do MinIO
   - Remove metadados do MongoDB
   - Verifica permissões do usuário

4. **Geração de URLs**
   ```typescript
   getFileUrl(fileId: string, userId: string): Promise<string>
   ```
   - Gera URL temporária para acesso
   - Valida permissões do usuário
   - URLs expiram em 24 horas

### Segurança

- Autenticação via JWT
- URLs temporárias com expiração
- Validação de propriedade dos arquivos
- Isolamento de dados por usuário

### Boas Práticas

1. **Organização de Arquivos**
   - Estrutura hierárquica por usuário
   - Nomes únicos com timestamp
   - Metadados completos

2. **Tratamento de Erros**
   - Logs detalhados
   - Mensagens de erro claras
   - Rollback em caso de falha

3. **Performance**
   - URLs temporárias para acesso
   - Metadados em MongoDB para consultas rápidas
   - Processamento assíncrono

### Exemplo de Uso

```typescript
// Upload de arquivo
const file = await datasetService.handleFileUpload(uploadedFile, userId);

// Listar arquivos
const files = await datasetService.listBucketContents(userId);

// Deletar arquivo
await datasetService.deleteFile(fileId, userId);

// Obter URL temporária
const url = await datasetService.getFileUrl(fileId, userId);
```

### Monitoramento

O sistema inclui logs detalhados para:
- Uploads de arquivos
- Geração de URLs
- Deleção de arquivos
- Erros e exceções

### Próximos Passos

1. Implementar sistema de cache
2. Adicionar suporte a múltiplos buckets
3. Implementar sistema de backup
4. Adicionar suporte a compressão
5. Implementar sistema de versionamento 

## 🔒 Autenticação

Todos os endpoints de usuário (exceto autenticação) requerem um token JWT válido no header `Authorization`:

```
Authorization: Bearer <token>
```

## 📝 Status da Base de Conhecimento

As bases de conhecimento podem ter os seguintes status:

- `processing`: Base está sendo processada
- `completed`: Processamento concluído com sucesso
- `failed`: Falha no processamento

## 🔄 Processamento Assíncrono

O processamento das bases de conhecimento é feito de forma assíncrona através do RabbitMQ. Após a criação da base, o sistema:

1. Envia uma mensagem para a fila de processamento
2. Atualiza o status da base para `processing`
3. Um worker processa o arquivo em background
4. O status é atualizado para `completed` ou `failed` após o processamento 

## Design Patterns Utilizados

### Clean Architecture
O projeto segue os princípios da Clean Architecture, dividindo a aplicação em camadas bem definidas:

- **Domain Layer**: Contém as regras de negócio, entidades e value objects
- **Application Layer**: Implementa os casos de uso que orquestram as operações
- **Infrastructure Layer**: Fornece implementações concretas (repositórios, serviços externos)
- **Presentation Layer**: Gerencia a interface com o usuário (controllers, DTOs)

### Value Objects
Utilizamos Value Objects para encapsular regras de validação e garantir a integridade dos dados:

- `Email`: Validação de formato e normalização de emails
- `Password`: Validação de complexidade de senhas
- `VerificationCode`: Geração e validação de códigos de verificação

### Repository Pattern
Implementado para abstrair o acesso aos dados:

- `IUserRepository`: Interface que define as operações de persistência
- `PrismaUserRepository`: Implementação concreta usando Prisma ORM

### Use Case Pattern
Cada operação de negócio é encapsulada em um caso de uso:

- `RegisterUseCase`: Registro de novos usuários
- `LoginUseCase`: Autenticação de usuários
- `VerifyCodeUseCase`: Verificação de códigos de verificação
- `VerifyLoginCodeUseCase`: Verificação de códigos de login

### Factory Pattern
Utilizado para criar instâncias de objetos complexos:

- `UserFactory`: Criação de usuários com validações
- `VerificationCodeFactory`: Geração de códigos de verificação

### Strategy Pattern
Implementado para diferentes estratégias de notificação:

- `EmailNotificationStrategy`: Envio de notificações por email
- `WhatsAppNotificationStrategy`: Envio de notificações por WhatsApp

## Módulo de Autenticação

O módulo de autenticação (`src/modules/auth`) foi recentemente atualizado para seguir estritamente os princípios da Clean Architecture. As principais mudanças incluem:

### Reorganização da Estrutura
```
src/modules/auth/
├── application/
│   └── use-cases/
│       ├── register.use-case.ts
│       ├── login.use-case.ts
│       ├── verify-code.use-case.ts
│       └── verify-login-code.use-case.ts
├── domain/
│   ├── entities/
│   │   └── user.entity.ts
│   ├── errors/
│   │   ├── invalid-email.error.ts
│   │   └── invalid-password.error.ts
│   ├── services/
│   │   └── notification.service.ts
│   └── value-objects/
│       ├── email.value-object.ts
│       └── password.value-object.ts
├── infrastructure/
│   ├── controllers/
│   └── repositories/
└── presentation/
    └── controllers/
        └── auth.controller.ts
```

### Melhorias Implementadas

1. **Value Objects**:
   - Implementação de `Email` e `Password` como value objects
   - Validações encapsuladas e imutáveis
   - Regras de negócio centralizadas

2. **Casos de Uso**:
   - Movidos para a camada `application`
   - Melhor separação de responsabilidades
   - Testes mais focados e isolados

3. **Documentação**:
   - Adição de decoradores Swagger
   - Documentação clara dos endpoints
   - Descrição dos códigos de status HTTP

4. **Tratamento de Erros**:
   - Erros específicos do domínio
   - Mensagens de erro mais descritivas
   - Melhor rastreabilidade

5. **Logging**:
   - Logs estruturados
   - Rastreamento de operações
   - Facilidade de debug

### Exemplo de Uso

```typescript
// Exemplo de uso do value object Email
const email = Email.create('user@example.com');

// Exemplo de uso do value object Password
const password = Password.create('StrongP@ss123');

// Exemplo de caso de uso
@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly notificationService: INotificationService,
  ) {}

  async execute(data: RegisterDto): Promise<User> {
    const email = Email.create(data.email);
    const password = Password.create(data.password);
    
    const user = await this.userRepository.create({
      email: email.getValue(),
      password: password.getValue(),
      // ... outros dados
    });

    await this.notificationService.sendVerificationCode(user);
    return user;
  }
}
```

### Benefícios das Atualizações

1. **Manutenibilidade**:
   - Código mais organizado e coeso
   - Responsabilidades bem definidas
   - Facilidade de manutenção

2. **Testabilidade**:
   - Testes mais isolados
   - Mocks mais simples
   - Cobertura de código melhorada

3. **Escalabilidade**:
   - Fácil adição de novos casos de uso
   - Implementações alternativas simplificadas
   - Baixo acoplamento entre camadas

4. **Segurança**:
   - Validações centralizadas
   - Regras de negócio protegidas
   - Dados imutáveis quando necessário

## 📚 Documentação da API

A documentação completa da API está disponível através do Swagger UI quando a aplicação está em execução:

```
http://localhost:3000/api/docs
```

### Autenticação

Todos os endpoints (exceto `/auth/*`) requerem autenticação via JWT. O token deve ser enviado no header:

```
Authorization: Bearer <token>
```

### Endpoints Principais

#### Autenticação
- `POST /auth/register` - Registro de novo usuário
- `POST /auth/login` - Login com email
- `POST /auth/verify-code` - Verificação de código de ativação
- `POST /auth/verify-login-code` - Verificação de código de login

#### Dataset
- `GET /user/dataset/list` - Lista arquivos do usuário
- `POST /user/dataset/upload` - Upload de arquivo PDF
- `DELETE /user/dataset/:id` - Remove arquivo

#### Knowledge Base
- `POST /user/knowledge-base` - Cria base de conhecimento (nome + descrição)
- `GET /user/knowledge-base` - Lista bases de conhecimento do usuário
- `GET /user/knowledge-base/:id` - Obtém base específica com arquivos
- `PUT /user/knowledge-base/:id` - Atualiza informações da base
- `DELETE /user/knowledge-base/:id` - Remove base e arquivos
- `POST /user/knowledge-base/:id/start-process` - Inicia processamento assíncrono

#### Files
- `POST /user/files/upload` - Upload de arquivo para MinIO
- `GET /user/files` - Lista arquivos do usuário
- `DELETE /user/files/:fileId` - Remove arquivo do MinIO + MongoDB

#### Chatbots
- `POST /user/chatbots` - Cria novo chatbot
- `GET /user/chatbots` - Lista chatbots do usuário
- `GET /user/chatbots/:id` - Obter detalhes de um chatbot
- `PUT /user/chatbots/:id` - Atualizar configurações do chatbot
- `DELETE /user/chatbots/:id` - Remover chatbot

#### Profile
- `GET /user/profile`