# API

## Endpoints principais

### GET /health
Retorna status do serviço.

**Response:**
```json
{
  "status": "ok",
  "env": "development"
}
```

### POST /webhook
Recebe payloads do WhatsApp (Evolution API). Processa mensagens e responde via AI/serviço.

**Request Body:**
```json
{
  "from": "5511999999999",
  "body": "produto tenis",
  "conversationId": "optional-id"
}
```

**Response:**
```json
{
  "ok": true
}
```

### POST /send-message
Envia mensagem manual via Evolution API.

**Headers:**
- `x-api-key`: Chave de API configurada

**Request Body:**
```json
{
  "to": "5511999999999",
  "text": "Olá, como posso ajudar?"
}
```

**Response:**
```json
{
  "ok": true,
  "resp": {}
}
```

## Autenticação
- Header `x-api-key` para proteger endpoints sensíveis.
