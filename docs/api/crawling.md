# API de Crawling

A API de Crawling permite extrair conteúdo de URLs usando o serviço Firecrawl, seguindo os princípios de Clean Architecture e Domain Driven Design.

## Visão Geral

O módulo de crawling oferece funcionalidades para:

- Criar requisições de crawling de URLs
- Listar requisições de crawling do usuário
- Buscar requisições específicas por ID
- Processamento assíncrono com status de acompanhamento

## Endpoints

### Criar Requisição de Crawling

**POST** `/api/user/crawling`

Cria uma nova requisição para fazer crawling de uma URL.

#### Headers

```
Content-Type: application/json
Authorization: Bearer <jwt-token>
```

#### Body

```json
{
  "url": "https://www.example.com",
  "formats": ["json", "markdown"],
  "jsonOptions": {
    "schema": {
      "type": "object",
      "properties": {
        "title": { "type": "string" },
        "content": { "type": "string" }
      },
      "required": ["title", "content"]
    }
  }
}
```

#### Parâmetros

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `url` | string | Sim | URL para fazer crawling |
| `formats` | string[] | Sim | Formatos de saída desejados (`json`, `markdown`) |
| `jsonOptions` | object | Não | Opções para extração JSON estruturada |

#### Resposta de Sucesso (201)

```json
{
  "id": "507f1f77bcf86cd799439011",
  "url": "https://www.example.com",
  "status": "pending",
  "result": null,
  "error": null,
  "createdAt": "2025-06-12T23:30:00.000Z",
  "updatedAt": "2025-06-12T23:30:00.000Z"
}
```

### Listar Requisições de Crawling

**GET** `/api/user/crawling`

Lista todas as requisições de crawling do usuário autenticado.

#### Headers

```
Authorization: Bearer <jwt-token>
```

#### Resposta de Sucesso (200)

```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "url": "https://www.example.com",
    "status": "completed",
    "result": {
      "markdown": "# Exemplo\n\nConteúdo extraído...",
      "json": {
        "title": "Exemplo",
        "content": "Conteúdo extraído"
      }
    },
    "error": null,
    "createdAt": "2025-06-12T23:30:00.000Z",
    "updatedAt": "2025-06-12T23:35:00.000Z"
  }
]
```

### Buscar Requisição Específica

**GET** `/api/user/crawling/{id}`

Busca uma requisição de crawling específica por ID.

#### Headers

```
Authorization: Bearer <jwt-token>
```

#### Parâmetros de URL

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | string | ID da requisição de crawling |

#### Resposta de Sucesso (200)

```json
{
  "id": "507f1f77bcf86cd799439011",
  "url": "https://www.example.com",
  "status": "completed",
  "result": {
    "markdown": "# Exemplo\n\nConteúdo extraído...",
    "json": {
      "title": "Exemplo",
      "content": "Conteúdo extraído"
    }
  },
  "error": null,
  "createdAt": "2025-06-12T23:30:00.000Z",
  "updatedAt": "2025-06-12T23:35:00.000Z"
}
```

## Status das Requisições

| Status | Descrição |
|--------|-----------|
| `pending` | Requisição criada, aguardando processamento |
| `processing` | Crawling em andamento |
| `completed` | Crawling concluído com sucesso |
| `failed` | Crawling falhou |

## Exemplos de Uso

### Exemplo Simples (Markdown)

```json
{
  "url": "https://www.google.com",
  "formats": ["markdown"]
}
```

### Exemplo com JSON Schema

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

### Exemplo para Blog

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
        },
        "author": {
          "type": "object",
          "properties": {
            "name": { "type": "string" },
            "bio": { "type": "string" }
          }
        }
      },
      "required": ["blog_title", "recent_posts"]
    }
  }
}
```

## Códigos de Erro

| Código | Descrição |
|--------|-----------|
| 400 | Dados inválidos fornecidos |
| 401 | Não autorizado (token JWT inválido ou ausente) |
| 404 | Requisição de crawling não encontrada |
| 500 | Erro interno do servidor |

## Configuração

### Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `FIRECRAWL_API_URL` | URL da API do Firecrawl | `https://firecrawl.gwan.com.br` |

## Fluxo de Processamento

1. **Criação**: O usuário envia uma requisição POST com a URL e formatos desejados
2. **Persistência**: A requisição é salva no banco com status `pending`
3. **Processamento Assíncrono**: O crawling é executado em background
4. **Atualização**: O status é atualizado para `processing` durante o processamento
5. **Conclusão**: O status é atualizado para `completed` ou `failed`
6. **Consulta**: O usuário pode consultar o resultado usando GET

## Limitações

- Timeout de 30 segundos para requisições ao Firecrawl
- Processamento assíncrono (não bloqueante)
- Apenas URLs públicas são suportadas
- Rate limiting pode ser aplicado pelo serviço Firecrawl

## Boas Práticas

1. **Sempre verifique o status** da requisição antes de tentar acessar o resultado
2. **Use JSON Schema** para extrair dados estruturados quando possível
3. **Implemente retry logic** no cliente para requisições que falharam
4. **Monitore o status** das requisições para detectar falhas
5. **Use formatos apropriados** para o tipo de conteúdo (markdown para texto, JSON para dados estruturados)
