# Guia de Desenvolvimento

Este guia fornece informações detalhadas sobre o desenvolvimento do GWAN BFF.

## 🏗️ Estrutura do Projeto

```
src/
├── core/                  # Núcleo da aplicação
│   ├── domain/            # Entidades e regras de negócio
│   ├── application/       # Casos de uso
│   └── infrastructure/    # Implementações concretas
├── modules/               # Módulos da aplicação
│   ├── auth/              # Autenticação
│   ├── chatbots/          # Chatbots
│   ├── dataset/           # Dataset
│   ├── knowledge/         # Knowledge Base
│   ├── profile/           # Perfil de usuário
│   └── users/             # Usuários
├── shared/                # Código compartilhado
│   ├── decorators/        # Decorators
│   ├── filters/           # Filtros
│   ├── guards/            # Guards
│   ├── interceptors/      # Interceptors
│   └── utils/             # Utilitários
├── config/                # Configurações
├── tests/                 # Testes
└── types/                 # Tipos TypeScript
```

## 📝 Padrões de Código

### Clean Architecture

O projeto segue os princípios da Clean Architecture:

1. **Domain Layer**
   - Entidades
   - Value Objects
   - Regras de Negócio
   - Interfaces dos Repositórios

2. **Application Layer**
   - Casos de Uso
   - DTOs
   - Interfaces dos Serviços

3. **Infrastructure Layer**
   - Implementações dos Repositórios
   - Implementações dos Serviços
   - Configurações de Banco de Dados

4. **Presentation Layer**
   - Controllers
   - Middlewares
   - Validações

### Convenções de Nomenclatura

- **Arquivos**:
  - `*.controller.ts`: Controllers
  - `*.service.ts`: Serviços
  - `*.repository.ts`: Repositórios
  - `*.entity.ts`: Entidades
  - `*.dto.ts`: DTOs
  - `*.interface.ts`: Interfaces
  - `*.enum.ts`: Enums
  - `*.constant.ts`: Constantes

- **Classes**:
  - `UserController`: Controllers
  - `UserService`: Serviços
  - `UserRepository`: Repositórios
  - `User`: Entidades
  - `CreateUserDto`: DTOs
  - `IUserRepository`: Interfaces

### Estilo de Código

- Usar TypeScript strict mode
- Seguir ESLint e Prettier configurados
- Documentar com JSDoc
- Usar async/await ao invés de Promises
- Usar injeção de dependência
- Usar decorators do NestJS

## 🧪 Testes

### Tipos de Testes

1. **Unitários**
   - Testar casos de uso
   - Testar entidades
   - Testar value objects
   - Testar serviços

2. **Integração**
   - Testar repositórios
   - Testar controllers
   - Testar fluxos completos

3. **E2E**
   - Testar endpoints
   - Testar integrações externas

### Estrutura de Testes

```
tests/
├── unit/                 # Testes unitários
│   ├── domain/           # Testes de domínio
│   ├── application/      # Testes de casos de uso
│   └── infrastructure/   # Testes de infraestrutura
├── integration/          # Testes de integração
│   ├── repositories/     # Testes de repositórios
│   └── services/         # Testes de serviços
└── e2e/                  # Testes end-to-end
    ├── auth/             # Testes de autenticação
    ├── chatbots/         # Testes de chatbots
    └── users/            # Testes de usuários
```

### Executando Testes

```bash
# Executar todos os testes
npm test

# Executar testes unitários
npm run test:unit

# Executar testes de integração
npm run test:integration

# Executar testes e2e
npm run test:e2e

# Executar testes com cobertura
npm run test:cov
```

## 🔄 Fluxo de Desenvolvimento

1. **Criar Branch**
   ```bash
   git checkout -b feature/nome-da-feature
   ```

2. **Desenvolver**
   - Seguir padrões de código
   - Escrever testes
   - Documentar mudanças

3. **Testar**
   - Executar testes unitários
   - Executar testes de integração
   - Executar testes e2e
   - Verificar cobertura

4. **Code Review**
   - Criar Pull Request
   - Solicitar revisão
   - Resolver comentários

5. **Merge**
   - Aprovar PR
   - Merge na main
   - Deploy

## 🚀 Deploy

### Ambiente de Desenvolvimento

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Iniciar em modo desenvolvimento
npm run start:dev
```

### Ambiente de Produção

```bash
# Build
npm run build

# Iniciar em modo produção
npm run start:prod
```

### Docker

```bash
# Build da imagem
docker build -t gwan-bff .

# Executar container
docker run -p 3000:3000 gwan-bff
```

## 📊 Monitoramento

### Logs

- Usar Winston para logs
- Estruturar logs em JSON
- Incluir correlationId
- Níveis de log:
  - error: Erros
  - warn: Avisos
  - info: Informações
  - debug: Debug
  - trace: Rastreamento

### Métricas

- Health checks
- Logs estruturados
- Métricas principais:
  - Requisições por segundo
  - Tempo de resposta
  - Taxa de erro
  - Uso de recursos

### Alertas

- Alertas baseados em logs
- Alertas principais:
  - Erros 5xx
  - Latência alta
  - Uso de CPU/Memória
  - Falhas de integração

## 🔐 Segurança

### Boas Práticas

1. **Autenticação**
   - Usar JWT
   - Implementar refresh token
   - Validar tokens
   - Implementar rate limiting

2. **Autorização**
   - Usar roles e permissions
   - Validar permissões
   - Implementar RBAC

3. **Dados**
   - Validar inputs
   - Sanitizar dados
   - Criptografar dados sensíveis
   - Implementar CORS

4. **Infraestrutura**
   - Usar HTTPS
   - Configurar firewalls
   - Manter dependências atualizadas
   - Implementar WAF

## 📚 Recursos

- [Documentação NestJS](https://docs.nestjs.com)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [TypeScript](https://www.typescriptlang.org/docs)
- [MongoDB](https://docs.mongodb.com)
- [RabbitMQ](https://www.rabbitmq.com/documentation.html)
- [MinIO](https://docs.min.io)

## 📝 Próximos Passos

- [Padrões de Código](code-standards.md)
- [Testes](testing.md)
- [Monitoramento](../monitoring/metrics.md) 