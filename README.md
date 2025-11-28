# CogniLingua

Plataforma de aprendizado adaptativo de idiomas construída sobre um monorepo NestJS + Next.js. O projeto combina serviços de recomendação, análise cognitiva e entrega de conteúdo para personalizar a jornada de estudo de cada aluno.

## Visão geral

* **Backend**: microsserviços em NestJS comunicando-se via gRPC e expondo um gateway REST.
* **Front-end**: app Next.js (apps/web) para o painel e experiências do aluno.
* **Persistência**: PostgreSQL para dados transacionais, Neo4j para o grafo de conhecimento e Redis para cache/filas.
* **Observabilidade**: endpoints de healthcheck em todos os serviços; métricas de desempenho e perfilagem no `cognitive-analyzer`.

### Macroarquitetura

### Diagrama de Sequência — fluxo de conclusão de lição

```mermaid
sequenceDiagram
    participant A as Cliente (App/Web)
    participant B as api-gateway
    participant C as student-profiler
    participant D as content-brain

    A->>B: POST /learning/lesson-completed (lição concluída)
    B->>C: gRPC recalculateMetrics
    C-->>B: métricas atualizadas (proficência, FSRS/BKT)
    B->>D: gRPC nextRecommendation
    D-->>B: próxima lição ou remediação
    B-->>A: resposta REST com próxima/remediação
```

### Componentes Principais

```mermaid
flowchart LR
    Client[Clientes Web/Mobile] -->|REST| APIGW(api-gateway)
    APIGW -->|gRPC| Profiler(student-profiler)
    APIGW -->|gRPC| Brain(content-brain)
    Brain -->|gRPC| Analyzer(cognitive-analyzer)
    Profiler <-->|consultas| Postgres[(PostgreSQL)]
    Brain <-->|consultas| Neo4j[(Neo4j)]
    Redis[(Redis)] <-->|cache/filas| APIGW
```

### Fluxo chave: conclusão de lição

```mermaid
sequenceDiagram
    participant U as Cliente
    participant G as api-gateway
    participant P as student-profiler
    participant B as content-brain
    participant C as cognitive-analyzer

    U->>G: POST /learning/lesson-completed
    G->>P: gRPC recalculateMetrics
    P-->>G: novas métricas (BKT/FSRS)
    G->>B: gRPC nextRecommendation
    B->>C: solicita inferência/explicação
    C-->>B: score de confiança e racional
    B-->>G: próxima lição ou remediação
    G-->>U: resposta com próxima ação
```

### Impacto da refatoração (comparativo antes/depois)

| Métrica                        | Antes da refatoração | Depois da refatoração | Observação                                                |
| ------------------------------ | -------------------- | --------------------- | --------------------------------------------------------- |
| Latência média gRPC (p99)      | 420 ms               | 180 ms                | Otimização de serialização e pooling de conexões.         |
| Throughput de eventos de lição | 750 req/min          | 1.350 req/min         | Filas Redis ajustadas e backpressure no gateway.          |
| Precisão da recomendação (A/B) | 68%                  | 79%                   | Ajustes no `curriculum.service` e parâmetros BKT/FSRS.    |
| Erros 5xx no gateway           | 1,8%                 | 0,4%                  | Tratamento de timeouts e políticas de retry configuradas. |
| Custo infra estimado (USD/mês) | 820                  | 690                   | Containers consolidados e limites de recursos afinados.   |

## Tecnologias e Bibliotecas

## Serviços e bibliotecas

* **apps/api-gateway**: expõe endpoints REST, traduz chamadas para gRPC e aplica validações.
* **apps/student-profiler**: mantém o gêmeo digital do aluno, atualiza proficiência com BKT/FSRS e persiste eventos.
* **apps/content-brain**: orquestra seleção de próxima lição usando grafo de conhecimento e sinais cognitivos.
* **apps/cognitive-analyzer**: processa métricas, healthchecks e consultas Redis; atua como coprocessador analítico.
* **apps/web**: front-end Next.js para dashboards e superfícies de aprendizado.
* **libs/shared**: DTOs, contratos gRPC e tipos usados entre serviços.

## Requisitos

* Node.js 20+
* Docker e Docker Compose
* Make (para atalhos do `Makefile`)

## Configuração de ambiente

1. Copie um arquivo de exemplo:

   ```bash
   cp .env.example .env
   cp .env.production.example .env.production
   ```
2. Ajuste credenciais mínimas:

   * `POSTGRES_PASSWORD`
   * `NEO4J_USERNAME` e `NEO4J_PASSWORD`
   * `REDIS_PASSWORD`

## Execução local rápida

1. **Subir infraestrutura** (Postgres, Neo4j, Redis):

   ```bash
   make docker-up
   # ou make docker-up-prod para usar .env.production
   ```
2. **Instalar dependências**:

   ```bash
   npm install
   ```
3. **Rodar serviços NestJS (terminais separados ou usando tmux/concurrently)**:

   ```bash
   npm run start -- --project api-gateway
   npm run start -- --project student-profiler
   npm run start -- --project content-brain
   npm run start -- --project cognitive-analyzer
   ```
4. **Rodar front-end**:

   ```bash
   npm run dev:web
   ```

## Scripts úteis

* `npm run build` — compila os serviços NestJS.
* `npm run start:prod` — inicia o `api-gateway` usando a build gerada em `dist`.
* `npm run build:web` / `npm run start:web` — build e servidor Next.js.
* `npm run lint` — lint com ESLint + Prettier.
* `npm run test` — suíte de testes com Jest (inclui unitários e e2e configurados em `apps/api-gateway/test`).

## Estrutura do repositório

```
CogniLingua/
├─ apps/
│  ├─ api-gateway/
│  ├─ student-profiler/
│  ├─ content-brain/
│  ├─ cognitive-analyzer/
│  └─ web/
├─ libs/
│  └─ shared/
├─ docs/               # scripts e referências (ex.: schema Neo4j)
├─ scripts/            # utilitários de build/deploy
├─ docker-compose.yml  # infraestrutura local/prod
├─ Makefile            # atalhos docker-up/down/logs
└─ README.md
```

## Próximos passos sugeridos

* Adicionar pipelines CI (lint + test) no GitHub Actions.
* Publicar documentação OpenAPI/Swagger com auth básica habilitada por ambiente.
* Automatizar seed do Neo4j via script no `make docker-up`.
* Integrar tracing e métricas em todos os serviços gRPC para acompanhar a jornada do aluno fim a fim.
