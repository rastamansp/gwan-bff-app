# Módulo Instagram

Este módulo fornece funcionalidades para processar profiles do Instagram.

## Endpoints

### POST /instagram/profile

Recebe um username do Instagram e registra no log.

**Request Body:**

```json
{
  "username": "string"
}
```

**Response:**

```json
{
  "message": "OK"
}
```

**Exemplo de uso:**

```bash
curl -X POST http://localhost:3000/api/instagram/profile \
  -H "Content-Type: application/json" \
  -d '{"username": "juniordreadbr"}'
```

## Estrutura do Módulo

- `domain/`: Contém as regras de negócio e entidades
  - `dtos/`: Data Transfer Objects
  - `services/`: Serviços de domínio
  - `use-cases/`: Casos de uso da aplicação
- `infrastructure/`: Contém a implementação da infraestrutura
  - `controllers/`: Controladores da API
