# Instalação

Este guia irá ajudá-lo a configurar o ambiente de desenvolvimento do GWAN BFF.

## 📋 Pré-requisitos

- Node.js (v20 ou superior)
- MongoDB (v6 ou superior)
- RabbitMQ (v3.12 ou superior)
- MinIO (v8 ou superior)
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

4. Edite o arquivo `.env` com suas configurações (veja [Configuração](configuration.md) para detalhes).

## 🐳 Usando Docker (Opcional)

Se preferir usar Docker, você pode iniciar todo o ambiente com:

```bash
docker-compose up -d
```

Isso irá iniciar:
- Aplicação GWAN BFF
- MongoDB
- RabbitMQ
- MinIO

## 🔍 Verificação da Instalação

1. Verifique se a aplicação está rodando:
```bash
curl http://localhost:3000/health
```

2. Verifique os logs:
```bash
docker-compose logs -f app
```

## ⚠️ Solução de Problemas

Se encontrar problemas durante a instalação, consulte:
- [Problemas Comuns](../troubleshooting/common-issues.md)
- [Guia de Depuração](../troubleshooting/debugging.md)

## 📚 Próximos Passos

- [Configuração](configuration.md)
- [Executando o Projeto](running.md)
- [Guia de Desenvolvimento](../development/guide.md) 