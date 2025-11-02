# 💰 SpendWise - Gestão Financeira Pessoal

Sistema completo de gestão financeira pessoal com backend em .NET 9 e frontend em Next.js.

## 📁 Estrutura do Projeto

```
SpendWise-Monolitico/
├── backend/                    # API .NET 9.0
│   ├── src/
│   │   ├── SpendWise.API/
│   │   ├── SpendWise.Application/
│   │   ├── SpendWise.Domain/
│   │   └── SpendWise.Infrastructure/
│   ├── tests/
│   ├── Dockerfile
│   └── .dockerignore
├── frontend/                   # Next.js 14 + TypeScript
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── Dockerfile
│   └── .dockerignore
├── docker-compose.yml          # Orquestração local
├── render.yaml                 # Deploy automático no Render
└── README.md
```

## 🚀 Início Rápido

### Pré-requisitos

- Docker e Docker Compose
- (Opcional) .NET 9.0 SDK
- (Opcional) Node.js 18+

### Rodar Localmente com Docker

```bash
# Clonar repositório
git clone <seu-repositorio>
cd SpendWise-Monolitico

# Subir todos os serviços
docker-compose up

# Ou em background
docker-compose up -d
```

**Acessar:**
- 🌐 Frontend: http://localhost:3000
- 🔧 Backend API: http://localhost:5000
- 📚 Swagger: http://localhost:5000/swagger
- 🗄️ PostgreSQL: localhost:5432

### Parar os Serviços

```bash
docker-compose down

# Remover volumes (limpar banco)
docker-compose down -v
```

## 🛠️ Desenvolvimento Local (Sem Docker)

### Backend

```bash
cd backend

# Restaurar dependências
dotnet restore

# Rodar migrations
dotnet ef database update --project src/SpendWise.Infrastructure --startup-project src/SpendWise.API

# Executar
dotnet run --project src/SpendWise.API
```

**Configurar**: `backend/src/SpendWise.API/appsettings.Development.json`

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=appdb;Username=appuser;Password=apppassword"
  }
}
```

### Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build
npm start
```

**Configurar**: `frontend/.env.local`

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 🌐 Deploy no Render

### Opção 1: Deploy Automático com render.yaml

1. Faça push do código para GitHub
2. Conecte o repositório no [Render Dashboard](https://dashboard.render.com)
3. Render detectará o `render.yaml` e criará todos os serviços automaticamente

### Opção 2: Deploy Manual

#### 1. Criar Banco de Dados PostgreSQL

1. No Render Dashboard: **New +** → **PostgreSQL**
2. Configurar:
   - Name: `spendwise-db`
   - Database: `appdb`
   - User: `appuser`
   - Plan: **Free**
3. Copiar **Internal Database URL**

#### 2. Deploy do Backend

1. **New +** → **Web Service**
2. Conectar repositório
3. Configurar:
   - **Name**: `spendwise-backend`
   - **Region**: Oregon (US West)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Environment**: Docker
   - **Dockerfile Path**: `./Dockerfile`
   - **Plan**: Free

4. **Variáveis de Ambiente**:
   ```bash
   ASPNETCORE_ENVIRONMENT=Production
   ASPNETCORE_URLS=http://+:5000
   ConnectionStrings__DefaultConnection=<Internal Database URL>
   JwtSettings__Secret=<gerar-chave-64-caracteres>
   JwtSettings__Issuer=SpendWise
   JwtSettings__Audience=SpendWise
   CorsSettings__AllowedOrigins=https://seu-frontend.onrender.com
   ```

5. Deploy

#### 3. Deploy do Frontend

1. **New +** → **Web Service**
2. Configurar:
   - **Name**: `spendwise-frontend`
   - **Root Directory**: `frontend`
   - **Environment**: Docker
   - **Plan**: Free

3. **Variáveis de Ambiente**:
   ```bash
   NEXT_PUBLIC_API_URL=https://spendwise-backend.onrender.com
   NODE_ENV=production
   ```

4. Deploy

#### 4. Atualizar CORS

Após deploy do frontend, volte no backend e atualize:

```bash
CorsSettings__AllowedOrigins=https://spendwise-frontend.onrender.com
```

## 🔐 Variáveis de Ambiente

### Backend

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `ASPNETCORE_ENVIRONMENT` | Ambiente de execução | `Production` |
| `ASPNETCORE_URLS` | URL de bind | `http://+:5000` |
| `ConnectionStrings__DefaultConnection` | String de conexão PostgreSQL | `Host=db;Database=appdb;...` |
| `JwtSettings__Secret` | Chave secreta JWT (64+ chars) | `<gerar-aleatório>` |
| `JwtSettings__Issuer` | Emissor do token | `SpendWise` |
| `JwtSettings__Audience` | Audiência do token | `SpendWise` |
| `CorsSettings__AllowedOrigins` | URLs permitidas (CORS) | `http://localhost:3000` |

### Frontend

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `NEXT_PUBLIC_API_URL` | URL da API backend | `http://localhost:5000` |
| `NODE_ENV` | Ambiente Node.js | `production` |

## 🧪 Testes

### Backend

```bash
cd backend
dotnet test
```

### Frontend

```bash
cd frontend
npm test
npm run test:e2e
```

## 📊 Arquitetura

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Frontend  │─────▶│   Backend   │─────▶│  PostgreSQL │
│  (Next.js)  │      │   (.NET 9)  │      │             │
│  Port 3000  │      │  Port 5000  │      │  Port 5432  │
└─────────────┘      └─────────────┘      └─────────────┘
```

### Backend (.NET 9)
- **Arquitetura**: Clean Architecture
- **Padrões**: CQRS, Repository, Unit of Work
- **ORM**: Entity Framework Core
- **Autenticação**: JWT Bearer

### Frontend (Next.js 14)
- **Framework**: Next.js com App Router
- **UI**: TailwindCSS + shadcn/ui
- **State**: React Context API
- **Validação**: Zod

## 🐛 Troubleshooting

### Docker

**Erro: "Port already in use"**
```bash
# Verificar portas em uso
docker ps
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# Parar containers
docker-compose down
```

**Erro: "Database connection failed"**
```bash
# Verificar se o banco está rodando
docker-compose ps

# Ver logs do banco
docker-compose logs db

# Recriar banco
docker-compose down -v
docker-compose up db
```

### Render

**Backend não inicia**
- Verificar logs no Render Dashboard
- Confirmar que `ConnectionStrings__DefaultConnection` está configurada
- Usar **Internal Database URL**, não External

**Frontend não conecta na API**
- Verificar `NEXT_PUBLIC_API_URL`
- Confirmar CORS no backend
- Testar endpoint: `https://seu-backend.onrender.com/health`

**Sleep após 15min (Free Tier)**
- Render coloca serviços free em sleep após inatividade
- Primeira requisição demora ~30s para "acordar"
- Considerar usar cron job para manter ativo

## 📝 Scripts Úteis

```bash
# Build local
docker-compose build

# Rebuild sem cache
docker-compose build --no-cache

# Ver logs
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend

# Executar comando no container
docker-compose exec backend bash
docker-compose exec frontend sh

# Limpar tudo
docker-compose down -v --rmi all
```

## 🔗 Links Úteis

- [Documentação .NET](https://learn.microsoft.com/dotnet/)
- [Documentação Next.js](https://nextjs.org/docs)
- [Render Docs](https://render.com/docs)
- [Docker Compose](https://docs.docker.com/compose/)

## 📄 Licença

MIT

---

**Desenvolvido com ❤️ para TPPE - UnB**