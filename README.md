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
- `POST /user/dataset/upload` - Upload de dataset (PDF)
  ```
  Content-Type: multipart/form-data
  
  Request Body:
  - file: [PDF File] (campo do tipo arquivo)

  Response (200 OK):
  {
    "originalname": "exemplo.pdf",
    "filename": "1679676892123-exemplo.pdf",
    "size": 12345,
    "mimetype": "application/pdf",
    "url": "https://minio.gwan.com.br/datasets/1679676892123-exemplo.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&..."
  }

  Errors:
  - 400 Bad Request: Se o arquivo não for PDF
  - 400 Bad Request: Se nenhum arquivo for enviado
  - 500 Internal Server Error: Se houver erro no upload para o MinIO
  ```

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