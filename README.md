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