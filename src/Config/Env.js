const REGION = process.env.AWS_REGION || 'localhost';

module.exports = {
  REGION,
  DYNAMODB_ENDPOINT: (REGION === 'localhost' && 'http://localhost:8000') || null,
  NOME_DA_TABELA_DE_COTACAO: process.env.NOME_DA_TABELA_DE_COTACAO || 'APP-SeguroCotacao',
  NOME_DA_TABELA_DE_PROPOSTA: process.env.NOME_DA_TABELA_DE_PROPOSTA || 'APP-SeguroProposta',

  // QUEUE
  FILA_COTACAO_SEGUROS_QUEUE_URL:
    process.env.FILA_COTACAO_SEGUROS_QUEUE_URL ||
    'http://localhost:4566/000000000000/SINCRONIZA_OFERTAS_COTACAO_SEGURO',

  // WIZ API
  API_WIZ_URL: process.env.API_WIZ_URL || 'https://smartsale-auto-api-hml.azurewebsites.net/',
  API_WIZ_CORE_URL: process.env.API_WIZ_CORE_URL || 'http://smartsale-core-api-hml.azurewebsites.net/',
  API_WIZ_TOKEN:
    process.env.API_WIZ_TOKEN ||
    '0L5GBZnCD2vzaUr6RRYhdHZj+ZGoKfvXGQXbQdSgDt+kJSj2AX90oFfZO++y26vpqyYYP8W2RfoKKCgnVy3KX5pbRtvtOTpFhWoFj9OByl/lk0iWgFKb4hq9o38ZGyDZxbDYRhgaxUflWxjX1wfoXa45XW5aLsLq63wS3rNXAWURzDFTT9k8gcikeEzQ1UuybHnP9kXvkV/4613qOzgcxQ=='
};
