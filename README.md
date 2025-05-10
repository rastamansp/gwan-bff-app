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

- Node.js (v18 ou superior)
- MongoDB
- RabbitMQ
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

## ⚙️ Configuração

O arquivo `.env` deve conter as seguintes variáveis:

```env
# Server Configuration
PORT=3000
NODE_ENV=development
API_PREFIX=api/v1
TZ=America/Sao_Paulo

# MongoDB Configuration
MONGODB_URI=mongodb://user:password@host:port/database

# RabbitMQ Configuration
RABBITMQ_URI=amqp://user:password@host

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
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174,https://bff.gwan.com.br,https://www.bff.gwan.com.br,https://admin.gwan.com.br,https://www.admin.gwan.com.br

# MinIO Configuration
MINIO_ENDPOINT=minio.gwan.com.br
MINIO_PORT=9000
MINIO_USE_SSL=true
MINIO_ACCESS_KEY=your-access-key
MINIO_SECRET_KEY=your-secret-key
MINIO_BUCKET=datasets
```

## 🚀 Executando o projeto

### Desenvolvimento
```bash
npm run start:dev
```

### Produção
```bash
npm run build
npm run start:prod
```

### Email Worker
```bash
npm run start:email-worker
```

### Testes
```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📦 Estrutura do Projeto

```
src/
├── config/             # Configurações da aplicação
├── modules/           # Módulos da aplicação
│   ├── auth/         # Autenticação
│   ├── hello/        # Exemplo de módulo
│   └── health/       # Health check
├── workers/          # Workers da aplicação
│   └── email/        # Worker de email
└── main.ts           # Arquivo principal
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
- `POST /user/knowledge` - Criar uma nova base de conhecimento
  ```json
  Request Body:
  {
    "fileId": "507f1f77bcf86cd799439011",
    "name": "Base de Conhecimento de Marketing",
    "description": "Base de conhecimento contendo informações sobre estratégias de marketing digital",
    "filename": "marketing_strategies.pdf"
  }

  Response (201 Created):
  {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439012",
    "fileId": "507f1f77bcf86cd799439013",
    "name": "Base de Conhecimento de Marketing",
    "description": "Base de conhecimento contendo informações sobre estratégias de marketing digital",
    "filename": "marketing_strategies.pdf",
    "status": "processing",
    "createdAt": "2024-03-21T10:00:00.000Z",
    "updatedAt": "2024-03-21T10:00:00.000Z"
  }

  Errors:
  - 400 Bad Request: Dados inválidos fornecidos
  - 401 Unauthorized: Não autorizado
  ```

- `GET /user/knowledge` - Listar bases de conhecimento
  ```json
  Response (200 OK):
  [
    {
      "_id": "507f1f77bcf86cd799439011",
      "userId": "507f1f77bcf86cd799439012",
      "fileId": "507f1f77bcf86cd799439013",
      "name": "Base de Conhecimento de Marketing",
      "description": "Base de conhecimento contendo informações sobre estratégias de marketing digital",
      "filename": "marketing_strategies.pdf",
      "status": "processing",
      "createdAt": "2024-03-21T10:00:00.000Z",
      "updatedAt": "2024-03-21T10:00:00.000Z"
    }
  ]

  Errors:
  - 401 Unauthorized: Não autorizado
  ```

- `GET /user/knowledge/:id` - Obter base de conhecimento específica
  ```json
  Response (200 OK):
  {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439012",
    "fileId": "507f1f77bcf86cd799439013",
    "name": "Base de Conhecimento de Marketing",
    "description": "Base de conhecimento contendo informações sobre estratégias de marketing digital",
    "filename": "marketing_strategies.pdf",
    "status": "processing",
    "createdAt": "2024-03-21T10:00:00.000Z",
    "updatedAt": "2024-03-21T10:00:00.000Z"
  }

  Errors:
  - 401 Unauthorized: Não autorizado
  - 404 Not Found: Base de conhecimento não encontrada
  ```

- `DELETE /user/knowledge/:id` - Excluir base de conhecimento
  ```json
  Response (200 OK):
  {
    "message": "Base de conhecimento excluída com sucesso"
  }

  Errors:
  - 401 Unauthorized: Não autorizado
  - 404 Not Found: Base de conhecimento não encontrada
  ```

## 📁 Estrutura de Armazenamento

### MinIO (Bucket Storage)
Os arquivos são armazenados no MinIO em uma estrutura organizada por usuário:

```
datasets/
  ├── {userId}/
  │   ├── {timestamp}-{filename}.pdf
  │   └── {timestamp}-{filename}.pdf
  └── {outroUserId}/
      └── {timestamp}-{filename}.pdf
```

Exemplo:
```
datasets/
  ├── 681156721df613b75b7a833f/
  │   ├── 1714567890123-documento1.pdf
  │   └── 1714567890124-documento2.pdf
  └── 681156721df613b75b7a833g/
      └── 1714567890125-documento3.pdf
```

### MongoDB (Metadata Storage)
Os metadados dos arquivos são armazenados na collection `bucketfiles` com a seguinte estrutura:

```javascript
{
  _id: ObjectId,
  userId: String,          // ID do usuário que fez o upload
  originalName: String,    // Nome original do arquivo
  fileName: String,        // Nome do arquivo no bucket (inclui userId/timestamp)
  size: Number,           // Tamanho em bytes
  mimeType: String,       // Tipo do arquivo (ex: application/pdf)
  url: String,            // URL temporária para acesso
  bucketName: String,     // Nome do bucket (datasets)
  createdAt: Date,        // Data de criação
  updatedAt: Date         // Data da última atualização
}
```

### Queries Úteis MongoDB

1. Listar todos os arquivos de um usuário:
```javascript
db.bucketfiles.find({ userId: "681156721df613b75b7a833f" })
```

2. Listar arquivos ordenados por data:
```javascript
db.bucketfiles.find().sort({ createdAt: -1 })
```

3. Total de arquivos por usuário:
```javascript
db.bucketfiles.aggregate([
  { $group: { _id: "$userId", total: { $sum: 1 } } }
])
```

4. Tamanho total dos arquivos por usuário:
```javascript
db.bucketfiles.aggregate([
  { $group: { _id: "$userId", totalSize: { $sum: "$size" } } }
])
```

## 🗄️ Serviço de Arquivos (MinIO)

O serviço de arquivos utiliza o MinIO como storage para armazenamento de datasets em PDF. 

### Características
- Armazenamento de arquivos PDF
- Limite de 5MB por arquivo
- URLs temporárias válidas por 24 horas
- Bucket padrão: `datasets`

### Configuração MinIO
O serviço requer as seguintes variáveis de ambiente:
```env
MINIO_ENDPOINT=minio.gwan.com.br
MINIO_PORT=9000
MINIO_USE_SSL=true
MINIO_ACCESS_KEY=your-access-key
MINIO_SECRET_KEY=your-secret-key
```

### Pré-requisitos
- Bucket `datasets` deve ser criado manualmente no console do MinIO
- Configurar as políticas de acesso apropriadas no bucket
- Garantir que o MinIO está acessível no endpoint configurado

### Uso
1. **Listar Arquivos**
   - Endpoint: `GET /user/dataset/list`
   - Retorna lista de arquivos no bucket com metadados

2. **Upload de Arquivo**
   - Endpoint: `POST /user/dataset/upload`
   - Aceita apenas PDFs até 5MB
   - Retorna URL temporária para acesso ao arquivo

### Segurança
- Arquivos acessíveis apenas via URLs temporárias
- Validação de tipo de arquivo
- Limite de tamanho para prevenir abusos
- Logs detalhados para auditoria

## 📝 Logs

Os logs são gerados em diferentes níveis:
- `[Bootstrap]` - Logs de inicialização
- `[EmailWorker]` - Logs do worker de email
- `[MongoDB]` - Logs de conexão com o MongoDB
- `[RabbitMQ]` - Logs de conexão com o RabbitMQ

## 🔐 Segurança

- Variáveis de ambiente sensíveis não são versionadas
- JWT para autenticação
- CORS configurado
- Rate limiting implementado
- Validação de dados com class-validator
- Sanitização de inputs

## 🚀 Deploy

O projeto pode ser deployado usando Docker:

```bash
# Build da imagem
docker build -t gwan-bff-app .

# Execução do container
docker run -p 3000:3000 --env-file .env gwan-bff-app
```

Para ambiente de desenvolvimento, use o docker-compose:

```bash
docker-compose up -d
```

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
    userId: string;          // ID do usuário proprietário
    originalName: string;    // Nome original do arquivo
    fileName: string;        // Nome do arquivo no MinIO
    size: number;           // Tamanho em bytes
    mimeType: string;       // Tipo MIME do arquivo
    url: string;            // URL temporária de acesso
    bucketName: string;     // Nome do bucket no MinIO
}
```

#### KnowledgeBase (MongoDB)
```typescript
{
    userId: string;          // ID do usuário proprietário
    name: string;           // Nome da base de conhecimento
    description: string;     // Descrição da base
    fileId: string;         // ID do arquivo associado
    status: string;         // Status: 'processing' | 'completed' | 'failed'
    error?: string;         // Mensagem de erro (opcional)
    metadata?: {            // Metadados do processamento
        totalChunks?: number;
        processedChunks?: number;
        totalTokens?: number;
    }
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

O token é obtido após o login bem-sucedido através do endpoint `/auth/login`.

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
- `VerifyCodeUseCase`: Verificação de códigos de ativação
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
- `POST /user/knowledge` - Cria base de conhecimento
- `GET /user/knowledge` - Lista bases de conhecimento
- `GET /user/knowledge/:id` - Obtém base específica
- `DELETE /user/knowledge/:id` - Remove base de conhecimento

## 🧪 Testes

O projeto utiliza diferentes tipos de testes para garantir a qualidade do código:

### Testes Unitários
```bash
npm run test
```

### Testes E2E
```bash
npm run test:e2e
```

### Cobertura de Testes
```bash
npm run test:cov
```

### Testes de Integração
```bash
npm run test:integration
```

## 📊 Monitoramento

O sistema inclui monitoramento através de:

1. **Logs Estruturados**
   - Níveis: error, warn, info, debug
   - Formato JSON para fácil parsing
   - Rotação de logs

2. **Métricas**
   - Tempo de resposta
   - Taxa de erros
   - Uso de recursos

3. **Health Checks**
   - Status da aplicação
   - Conexões com serviços
   - Uso de memória

## 🔄 CI/CD

O projeto utiliza GitHub Actions para CI/CD:

1. **Build**
   - Instalação de dependências
   - Compilação TypeScript
   - Testes unitários

2. **Test**
   - Testes E2E
   - Testes de integração
   - Análise de cobertura

3. **Deploy**
   - Build da imagem Docker
   - Push para registry
   - Deploy em ambiente

## 📈 Roadmap

### Fase 1 - MVP
- [x] Autenticação básica
- [x] Upload de arquivos
- [x] Processamento de PDFs
- [x] API REST

### Fase 2 - Melhorias
- [ ] Cache distribuído
- [ ] Sistema de backup
- [ ] Compressão de arquivos
- [ ] Versionamento de bases

### Fase 3 - Escalabilidade
- [ ] Load balancing
- [ ] Sharding de dados
- [ ] CDN para arquivos
- [ ] Monitoramento avançado

## 🤝 Contribuição

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Guia de Contribuição

1. **Código**
   - Siga os padrões de código
   - Adicione testes
   - Documente mudanças

2. **Commits**
   - Use mensagens claras
   - Referencie issues
   - Siga o padrão conventional commits

3. **Pull Requests**
   - Descreva as mudanças
   - Inclua testes
   - Atualize documentação

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

---

Made with ❤️ by GWAN Team 