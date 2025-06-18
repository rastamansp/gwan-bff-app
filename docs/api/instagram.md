# API Instagram

Esta documentação descreve os endpoints disponíveis para interação com funcionalidades relacionadas ao Instagram.

## Base URL

```
http://localhost:3000
```

## Endpoints

### Processar Profile do Instagram

Recebe um username do Instagram e registra no log do sistema.

**Endpoint:** `POST /api/instagram/profile`

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "username": "string"
}
```

**Parâmetros:**

- `username` (string, obrigatório): Nome de usuário do Instagram a ser processado

**Response (200 OK):**

```json
{
  "message": "OK"
}
```

**Exemplo de Request:**

```bash
curl -X POST http://localhost:3000/api/instagram/profile \
  -H "Content-Type: application/json" \
  -d '{"username": "juniordreadbr"}'
```

**Exemplo de Response:**

```json
{
  "message": "OK"
}
```

## Códigos de Erro

### 400 Bad Request

Retornado quando o JSON enviado não está no formato correto ou quando o campo `username` está ausente ou vazio.

**Exemplo:**

```json
{
  "statusCode": 400,
  "message": ["username should not be empty"],
  "error": "Bad Request"
}
```

### 500 Internal Server Error

Retornado quando ocorre um erro interno no servidor.

## Logs

O sistema registra logs para cada requisição recebida:

1. **Controller Log:** Registra o JSON completo recebido
2. **Service Log:** Registra o username processado

**Exemplo de logs:**

```
[InstagramController] Recebido JSON com username: {"username":"juniordreadbr"}
[InstagramService] Processando profile do Instagram: juniordreadbr
```
