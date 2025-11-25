ENV_FILE ?= .env

.PHONY: docker-up docker-down docker-up-prod docker-logs

# Sobe os serviços locais usando o arquivo .env
docker-up:
@echo "Usando arquivo de ambiente: $(ENV_FILE)"
docker compose --env-file $(ENV_FILE) up -d

# Para os serviços e remove containers
docker-down:
docker compose --env-file $(ENV_FILE) down

# Sobe os serviços com o arquivo .env.production (deploy em VPS/Render)
docker-up-prod: ENV_FILE = .env.production
docker-up-prod:
@echo "Usando arquivo de ambiente: $(ENV_FILE)"
docker compose --env-file $(ENV_FILE) up -d

# Exibe logs combinados para debug
docker-logs:
docker compose --env-file $(ENV_FILE) logs -f
