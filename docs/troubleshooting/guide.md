# Guia de Troubleshooting

Este guia contém soluções para problemas comuns encontrados no GWAN BFF.

## 🔍 Diagnóstico

### Logs
```bash
# Logs da aplicação
docker-compose logs -f app

# Logs dos workers
docker-compose logs -f workers

# Logs do MongoDB
docker-compose logs -f mongodb

# Logs do RabbitMQ
docker-compose logs -f rabbitmq

# Logs do MinIO
docker-compose logs -f minio
```

### Métricas
```bash
# Acessar Grafana
http://localhost:3000

# Acessar Prometheus
http://localhost:9090

# Acessar RabbitMQ Management
http://localhost:15672
```

## 🚨 Problemas Comuns

### Aplicação

#### 1. Aplicação não inicia
**Sintomas:**
- Erro ao iniciar com `npm start`
- Container falha ao iniciar
- Porta já em uso

**Solução:**
1. Verificar logs:
```bash
docker-compose logs app
```

2. Verificar dependências:
```bash
npm install
```

3. Verificar variáveis de ambiente:
```bash
# Verificar .env
cat .env

# Verificar variáveis no container
docker-compose exec app env
```

4. Verificar portas:
```bash
# Verificar portas em uso
netstat -ano | findstr :3000
```

#### 2. Erro de conexão com MongoDB
**Sintomas:**
- Erro "MongoServerError: connect ECONNREFUSED"
- Timeout ao conectar
- Erro de autenticação

**Solução:**
1. Verificar conexão:
```bash
# Testar conexão
docker-compose exec mongodb mongosh

# Verificar logs
docker-compose logs mongodb
```

2. Verificar credenciais:
```bash
# Verificar variáveis
echo $MONGODB_URI
echo $MONGODB_USER
echo $MONGODB_PASS
```

3. Verificar rede:
```bash
# Verificar rede Docker
docker network ls
docker network inspect gwan-bff-app_default
```

#### 3. Erro de conexão com RabbitMQ
**Sintomas:**
- Erro "ECONNREFUSED"
- Workers não processam mensagens
- Filas não respondem

**Solução:**
1. Verificar conexão:
```bash
# Testar conexão
docker-compose exec rabbitmq rabbitmqctl status

# Verificar filas
docker-compose exec rabbitmq rabbitmqctl list_queues
```

2. Verificar credenciais:
```bash
# Verificar variáveis
echo $RABBITMQ_URI
echo $RABBITMQ_USER
echo $RABBITMQ_PASS
```

3. Verificar filas:
```bash
# Listar filas
curl -u guest:guest http://localhost:15672/api/queues

# Verificar mensagens
curl -u guest:guest http://localhost:15672/api/queues/%2F/email.notification
```

### Workers

#### 1. Workers não processam mensagens
**Sintomas:**
- Mensagens acumuladas nas filas
- Workers não iniciam
- Erros de processamento

**Solução:**
1. Verificar status:
```bash
# Verificar workers
docker-compose ps workers

# Verificar logs
docker-compose logs workers
```

2. Verificar filas:
```bash
# Listar filas
docker-compose exec rabbitmq rabbitmqctl list_queues

# Verificar dead letters
docker-compose exec rabbitmq rabbitmqctl list_queues name messages_ready messages_unacknowledged
```

3. Reiniciar workers:
```bash
# Reiniciar todos
docker-compose restart workers

# Reiniciar específico
docker-compose restart worker-email
```

#### 2. Erro no processamento de documentos
**Sintomas:**
- Documentos não são processados
- Erro ao gerar embeddings
- Erro ao indexar

**Solução:**
1. Verificar MinIO:
```bash
# Verificar bucket
docker-compose exec minio mc ls minio/documents

# Verificar arquivo
docker-compose exec minio mc stat minio/documents/doc.pdf
```

2. Verificar processamento:
```bash
# Verificar logs
docker-compose logs worker-knowledge

# Verificar métricas
curl localhost:9090/metrics | grep knowledge
```

3. Verificar OpenAI:
```bash
# Verificar API key
echo $OPENAI_API_KEY

# Testar conexão
curl https://api.openai.com/v1/models -H "Authorization: Bearer $OPENAI_API_KEY"
```

### Chatbots

#### 1. Chatbot não responde
**Sintomas:**
- Mensagens não são processadas
- Erro ao gerar resposta
- Timeout nas requisições

**Solução:**
1. Verificar status:
```bash
# Verificar logs
docker-compose logs app | grep chatbot

# Verificar métricas
curl localhost:9090/metrics | grep chatbot
```

2. Verificar base de conhecimento:
```bash
# Verificar índices
curl -X GET http://localhost:3000/api/knowledge-base/status

# Verificar documentos
curl -X GET http://localhost:3000/api/knowledge-base/documents
```

3. Verificar OpenAI:
```bash
# Verificar quota
curl https://api.openai.com/v1/usage -H "Authorization: Bearer $OPENAI_API_KEY"

# Verificar modelo
curl https://api.openai.com/v1/models/gpt-4 -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 2. Erro na base de conhecimento
**Sintomas:**
- Documentos não são indexados
- Erro ao gerar embeddings
- Busca não retorna resultados

**Solução:**
1. Verificar processamento:
```bash
# Verificar logs
docker-compose logs worker-knowledge

# Verificar filas
docker-compose exec rabbitmq rabbitmqctl list_queues | grep knowledge
```

2. Verificar armazenamento:
```bash
# Verificar MinIO
docker-compose exec minio mc ls minio/documents

# Verificar MongoDB
docker-compose exec mongodb mongosh --eval "db.knowledge.find()"
```

3. Verificar índices:
```bash
# Verificar status
curl -X GET http://localhost:3000/api/knowledge-base/index/status

# Reconstruir índice
curl -X POST http://localhost:3000/api/knowledge-base/index/rebuild
```

## 🔧 Manutenção

### Backup

#### MongoDB
```bash
# Backup
docker-compose exec mongodb mongodump --out /backup

# Restore
docker-compose exec mongodb mongorestore /backup
```

#### MinIO
```bash
# Backup
docker-compose exec minio mc mirror minio/documents /backup

# Restore
docker-compose exec minio mc mirror /backup minio/documents
```

### Limpeza

#### Logs
```bash
# Limpar logs antigos
find /var/log/gwan -type f -mtime +30 -delete

# Rotacionar logs
docker-compose exec app logrotate -f /etc/logrotate.d/gwan
```

#### Cache
```bash
# Limpar cache Redis
docker-compose exec redis redis-cli FLUSHALL

# Limpar cache MinIO
docker-compose exec minio mc rm --recursive minio/cache
```

## 📚 Recursos

- [Documentação NestJS](https://docs.nestjs.com)
- [Documentação MongoDB](https://docs.mongodb.com)
- [Documentação RabbitMQ](https://www.rabbitmq.com/documentation.html)
- [Documentação MinIO](https://docs.min.io)
- [Documentação OpenAI](https://platform.openai.com/docs)

## 🚀 Próximos Passos

- [Monitoramento](../monitoring/metrics.md)
- [Workers](../workers/workers.md)
- [Desenvolvimento](../development/guide.md) 