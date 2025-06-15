# Módulo de Crawling

Este módulo implementa funcionalidades de crawling de URLs usando a API do Firecrawl, seguindo os princípios de Domain Driven Design, SOLID e Clean Architecture.

## Estrutura

```
crawl/
├── domain/
│   ├── entities/
│   │   └── crawl-request.entity.ts
│   ├── dtos/
│   │   ├── create-crawl-request.dto.ts
│   │   └── crawl-response.dto.ts
│   ├── interfaces/
│   │   ├── crawl-repository.interface.ts
│   │   └── crawl-service.interface.ts
│   └── constants/
│       └── injection-tokens.ts
├── application/
│   └── use-cases/
│       ├── create-crawl-request/
│       │   └── create-crawl-request.usecase.ts
│       ├── get-crawl-request/
│       │   └── get-crawl-request.usecase.ts
│       └── list-crawl-requests/
│           └── list-crawl-requests.usecase.ts
├── infrastructure/
│   ├── repositories/
│   │   └── crawl.repository.ts
│   ├── services/
│   │   └── firecrawl.service.ts
│   └── schemas/
│       └── crawl-request.schema.ts
├── presentation/
│   └── controllers/
│       └── crawl.controller.ts
└── crawl.module.ts
```

## Funcionalidades

### Endpoints Disponíveis

- **POST** `/api/user/crawling` - Cria uma nova requisição de crawling
- **GET** `/api/user/crawling` - Lista todas as requisições de crawling do usuário
- **GET** `/api/user/crawling/{id}` - Busca uma requisição específica por ID

### Exemplo de Uso - Criação

```json
{
  "url": "https://open.spotify.com/intl-pt/artist/6nynI5RNNt5DJ9gB4jCRTb",
  "formats": ["json", "markdown"],
  "jsonOptions": {
    "schema": {
      "type": "object",
      "properties": {
        "artist_name": { "type": "string" },
        "bio": { "type": "string" },
        "top_tracks": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "title": { "type": "string" },
              "duration": { "type": "string" },
              "url": { "type": "string" }
            },
            "required": ["title", "duration", "url"]
          }
        }
      },
      "required": ["artist_name", "bio", "top_tracks"]
    }
  }
}
```

### Exemplo de Resposta

```json
{
  "id": "507f1f77bcf86cd799439011",
  "url": "https://open.spotify.com/intl-pt/artist/6nynI5RNNt5DJ9gB4jCRTb",
  "status": "pending",
  "result": null,
  "error": null,
  "createdAt": "2025-06-12T23:30:00.000Z",
  "updatedAt": "2025-06-12T23:30:00.000Z"
}
```

## Configuração

### Variáveis de Ambiente

- `FIRECRAWL_API_URL` - URL da API do Firecrawl (padrão: <https://firecrawl.gwan.com.br>)

## Arquitetura

### Domain Layer

- **Entities**: Representam as entidades de negócio
- **DTOs**: Objetos de transferência de dados
- **Interfaces**: Contratos para repositórios e serviços

### Application Layer

- **Use Cases**: Lógica de negócio e orquestração
  - `CreateCrawlRequestUseCase`: Cria nova requisição de crawling
  - `GetCrawlRequestUseCase`: Busca requisição específica
  - `ListCrawlRequestsUseCase`: Lista requisições do usuário

### Infrastructure Layer

- **Repositories**: Implementação da persistência de dados
- **Services**: Integração com serviços externos (Firecrawl)
- **Schemas**: Definições do MongoDB

### Presentation Layer

- **Controllers**: Endpoints da API REST

## Fluxo de Execução

1. **Criação**: O controller recebe a requisição e chama o use case
2. **Persistência**: O use case cria um registro no banco com status "pending"
3. **Processamento Assíncrono**: O crawling é executado em background
4. **Atualização**: O status é atualizado para "processing" durante o processamento
5. **Conclusão**: O status é atualizado para "completed" ou "failed"
6. **Consulta**: O usuário pode consultar o resultado usando GET

## Status da Requisição

- `pending`: Requisição criada, aguardando processamento
- `processing`: Crawling em andamento
- `completed`: Crawling concluído com sucesso
- `failed`: Erro durante o crawling

## Exemplos de Uso Avançado

### Crawling Simples (Markdown)

```json
{
  "url": "https://www.google.com",
  "formats": ["markdown"]
}
```

### Crawling com JSON Schema

```json
{
  "url": "https://news.ycombinator.com",
  "formats": ["json", "markdown"],
  "jsonOptions": {
    "schema": {
      "type": "object",
      "properties": {
        "title": { "type": "string" },
        "top_stories": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "title": { "type": "string" },
              "url": { "type": "string" },
              "points": { "type": "number" }
            },
            "required": ["title", "url"]
          }
        }
      },
      "required": ["title", "top_stories"]
    }
  }
}
```

### Crawling de Blog

```json
{
  "url": "https://blog.pragmaticengineer.com",
  "formats": ["json"],
  "jsonOptions": {
    "schema": {
      "type": "object",
      "properties": {
        "blog_title": { "type": "string" },
        "recent_posts": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "title": { "type": "string" },
              "url": { "type": "string" },
              "date": { "type": "string" },
              "excerpt": { "type": "string" }
            },
            "required": ["title", "url"]
          }
        }
      },
      "required": ["blog_title", "recent_posts"]
    }
  }
}
```

## Exemplos de Uso via HTTP

Para exemplos práticos de chamadas HTTP para este módulo, consulte o arquivo:

- [docs/examples/crawl.http](../../../docs/examples/crawl.http)

## Limitações e Considerações

- **Timeout**: 30 segundos para requisições ao Firecrawl
- **Processamento**: Assíncrono (não bloqueante)
- **URLs**: Apenas URLs públicas são suportadas
- **Rate Limiting**: Pode ser aplicado pelo serviço Firecrawl
- **Autenticação**: Requer token JWT válido

## Boas Práticas

1. **Verificar Status**: Sempre verifique o status da requisição antes de acessar o resultado
2. **JSON Schema**: Use para extrair dados estruturados quando possível
3. **Retry Logic**: Implemente no cliente para requisições que falharam
4. **Monitoramento**: Monitore o status das requisições para detectar falhas
5. **Formatos Apropriados**: Use markdown para texto e JSON para dados estruturados

## Documentação Completa

Para documentação completa da API, consulte: [docs/api/crawling.md](../../../docs/api/crawling.md)
