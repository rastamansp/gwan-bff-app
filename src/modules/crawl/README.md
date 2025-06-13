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
│       └── create-crawl-request/
│           └── create-crawl-request.usecase.ts
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

### Endpoint Principal

- **POST** `/api/user/crawling` - Cria uma nova requisição de crawling

### Exemplo de Uso

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

## Configuração

### Variáveis de Ambiente

- `FIRECRAWL_API_URL` - URL da API do Firecrawl (padrão: https://firecrawl.gwan.com.br)

## Arquitetura

### Domain Layer
- **Entities**: Representam as entidades de negócio
- **DTOs**: Objetos de transferência de dados
- **Interfaces**: Contratos para repositórios e serviços

### Application Layer
- **Use Cases**: Lógica de negócio e orquestração

### Infrastructure Layer
- **Repositories**: Implementação da persistência de dados
- **Services**: Integração com serviços externos
- **Schemas**: Definições do MongoDB

### Presentation Layer
- **Controllers**: Endpoints da API REST

## Fluxo de Execução

1. **Criação**: O controller recebe a requisição e chama o use case
2. **Persistência**: O use case cria um registro no banco com status "pending"
3. **Processamento Assíncrono**: O crawling é executado em background
4. **Atualização**: O status é atualizado para "completed" ou "failed"
5. **Resposta**: O resultado é retornado ao usuário

## Status da Requisição

- `pending`: Requisição criada, aguardando processamento
- `processing`: Crawling em andamento
- `completed`: Crawling concluído com sucesso
- `failed`: Erro durante o crawling 