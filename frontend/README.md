# SpendWise Frontend

> Frontend moderno para o sistema de finanças pessoais SpendWise

[![Next.js](https://img.shields.io/badge/Next.js-14.2.16-000000?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.9-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

---

## Visão Geral

O frontend do SpendWise é uma aplicação web moderna construída com **Next.js 13.5.6**, **TypeScript** e **Tailwind CSS**, oferecendo uma interface intuitiva e responsiva para gerenciamento de finanças pessoais.

### Tecnologias Utilizadas

- **Next.js 13.5.6** - Framework React com App Router
- **TypeScript 5.3.3** - Tipagem estática
- **Tailwind CSS 3.4.0** - Framework CSS utilitário
- **shadcn/ui** - Componentes acessíveis (Radix UI)
- **React Hook Form 7.47.0** - Gerenciamento de formulários
- **Recharts 2.8.0** - Gráficos e visualizações
- **Lucide React** - Ícones modernos
- **next-themes** - Tema claro/escuro
- **Playwright 1.56.1** - Testes E2E

---

## Quick Start

### Pré-requisitos

- Node.js 18+
- npm ou pnpm (recomendado)
- Backend SpendWise rodando na porta 5000

### 1. Instalar dependências

```bash
pnpm install
# ou
npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# App Configuration
NEXT_PUBLIC_APP_NAME=SpendWise
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 3. Executar em desenvolvimento

```bash
pnpm dev
# ou
npm run dev
```

### 4. Acessar a aplicação

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

---

## Estrutura do Projeto

```
frontend/
├── app/
│   ├── (app)/                # Área autenticada
│   │   ├── dashboard/        # Dashboard principal
│   │   ├── transacoes/       # Gestão de transações
│   │   ├── categorias/       # Gestão de categorias
│   │   ├── orcamento/        # Orçamento mensal
│   │   ├── relatorios/       # Relatórios e gráficos
│   │   ├── fechamento/       # Fechamento mensal
│   │   ├── perfil/           # Perfil do usuário
│   │   └── configuracoes/    # Configurações
│   ├── (auth)/               # Autenticação
│   │   ├── login/            # Login
│   │   ├── register/         # Cadastro
│   │   ├── esqueci-senha/    # Recuperação de senha
│   │   └── redefinir-senha/  # Redefinir senha
│   ├── demo/                 # Modo demonstração
│   ├── layout.tsx            # Layout raiz
│   └── page.tsx              # Landing page
├── components/
│   ├── ui/                   # 40+ componentes (shadcn/ui)
│   ├── charts/               # 5 componentes de gráficos
│   ├── budget/               # Componentes de orçamento
│   ├── categories/           # Componentes de categorias
│   ├── closure/              # Componentes de fechamento
│   └── reports/              # Componentes de relatórios
├── hooks/                    # 8 hooks customizados
├── lib/
│   ├── api/                  # Cliente de API
│   ├── contexts/             # AuthContext
│   ├── types/                # Tipos TypeScript
│   └── utils/                # Utilitários
├── e2e/                      # Testes E2E (Playwright)
├── __tests__/                # Testes unitários (Jest)
├── Dockerfile                # Docker otimizado
├── docker-compose.yml        # Orquestração
└── .github/workflows/        # CI/CD (GitHub Actions)
```

---

## Funcionalidades Implementadas

### Autenticação e Segurança

- [x] Login com email/senha
- [x] Registro de usuário
- [x] Recuperação de senha (forgot password)
- [x] Redefinição de senha (reset password)
- [x] Proteção de rotas (middleware)
- [x] Context de autenticação (JWT)
- [x] Logout automático

### Dashboard

- [x] Resumo financeiro em tempo real
- [x] KPIs: Receitas, Despesas, Saldo, % Orçamento
- [x] Gráfico de evolução diária
- [x] Gráfico de pizza por categoria
- [x] Transações recentes (últimas 5)
- [x] Alertas de categorias próximas/acima do limite
- [x] Filtro por mês
- [x] Notificações automáticas

### Transações

- [x] Listar todas as transações
- [x] Criar nova transação
- [x] Editar transação
- [x] Excluir transação
- [x] Filtros (tipo, categoria, período, busca)
- [x] KPIs de transações
- [x] Validação de limite de categoria

### Categorias

- [x] Listar categorias
- [x] Criar nova categoria
- [x] Editar categoria
- [x] Excluir categoria
- [x] KPIs de categorias
- [x] Barra de progresso visual
- [x] Validação de limite

### Orçamento

- [x] Visualizar orçamento do mês
- [x] Estatísticas de orçamento
- [x] Gráfico de evolução semanal
- [x] Comparação com mês anterior

### Relatórios

- [x] Relatório por categoria
- [x] Relatório mensal
- [x] Comparação anual
- [x] Exportar para PDF

### Fechamento Mensal

- [x] Fechar mês atual
- [x] Histórico de fechamentos

### Perfil e Configurações

- [x] Visualizar perfil
- [x] Editar perfil
- [x] Configurações do sistema
- [x] Tema claro/escuro

### Modo Demonstração

- [x] Landing page
- [x] Modo demo sem cadastro
- [x] Dados fictícios pré-carregados

### UI/UX

- [x] Sistema de design consistente
- [x] 50+ componentes reutilizáveis
- [x] 5 componentes de gráficos
- [x] Navegação e layout responsivo
- [x] Feedback visual (toasts, loading)
- [x] Tema claro/escuro
- [x] Acessibilidade (WCAG AA)

---

## Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev          # Inicia servidor de desenvolvimento

# Build
pnpm build        # Cria build de produção
pnpm start        # Inicia servidor de produção

# Qualidade
pnpm lint         # Executa linter
pnpm type-check   # Verifica tipos TypeScript

# Testes (planejado)
pnpm test         # Executa testes unitários
pnpm test:e2e     # Executa testes E2E
```

---

## Design System

### Cores

- **Primary**: Verde (emerald) - Representa crescimento financeiro
- **Secondary**: Azul (sky) - Representa confiança e estabilidade
- **Success**: Verde - Transações positivas
- **Danger**: Vermelho - Transações negativas
- **Warning**: Amarelo - Alertas e avisos

### Componentes

- **Cards**: Informações organizadas e visuais
- **Charts**: Gráficos interativos com Recharts
- **Forms**: Formulários com validação
- **Tables**: Tabelas responsivas e paginadas
- **Modals**: Diálogos e modais acessíveis

---

## Integração com Backend

### Endpoints Utilizados

```typescript
// Autenticação
POST /api/auth/login
POST /api/auth/register
GET  /api/usuarios/profile

// Transações
GET    /api/transacoes
POST   /api/transacoes
PUT    /api/transacoes/:id
DELETE /api/transacoes/:id

// Categorias
GET    /api/categorias
POST   /api/categorias
PUT    /api/categorias/:id
DELETE /api/categorias/:id

// Relatórios
GET /api/relatorios/categorias
GET /api/relatorios/mensal
```

### Configuração da API

```typescript
// lib/api/client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Headers automáticos
Authorization: Bearer <token>
Content-Type: application/json
```

---

## Deploy

### Vercel (Recomendado)

```bash
# 1. Conectar repositório ao Vercel
# 2. Configurar variáveis de ambiente
NEXT_PUBLIC_API_URL=https://sua-api.com/api

# 3. Deploy automático
git push origin main
```

### Docker

O projeto inclui configuração completa de Docker:

- **Dockerfile** - Multi-stage build otimizado
- **docker-compose.yml** - Orquestração de containers
- **.dockerignore** - Otimização de build
- **Health check** - Monitoramento de saúde

#### Build e execução

```bash
# Build da imagem
docker-compose build

# Executar container
docker-compose up -d

# Ver logs
docker-compose logs -f frontend

# Parar container
docker-compose down
```

---

## Responsividade

- **Mobile First**: Design otimizado para dispositivos móveis
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch Friendly**: Botões e elementos otimizados para touch
- **PWA Ready**: Preparado para Progressive Web App

---

## Testes

### Testes E2E (Playwright)

```bash
# Executar testes E2E
npx playwright test

# Executar em modo UI
npx playwright test --ui

# Executar em modo debug
npx playwright test --debug

# Ver relatório
npx playwright show-report
```

### Testes Unitários (Jest)

```bash
# Executar testes
npm test

# Executar com cobertura
npm test -- --coverage

# Executar em modo watch
npm test -- --watch
```

---

## CI/CD

Pipeline completo configurado com GitHub Actions:

### Jobs Configurados

1. **Lint** - ESLint e formatação
2. **Type Check** - Verificação de tipos TypeScript
3. **Unit Tests** - Testes unitários com Jest
4. **Build** - Build de produção
5. **E2E Tests** - Testes E2E com Playwright
6. **Security Audit** - npm audit e Snyk
7. **Docker Build** - Build e push da imagem
8. **Deploy** - Deploy automático

### Workflow

```yaml
# .github/workflows/ci-cd.yml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
```

## Contribuição

### Padrões de Código

- **ESLint**: Configuração padrão do Next.js
- **Prettier**: Formatação automática
- **TypeScript**: Tipagem estrita
- **Conventional Commits**: Padrão de commits

### Workflow

1. Fork do projeto
2. Criar branch feature
3. Implementar funcionalidade
4. Adicionar testes
5. Pull request

---

## Documentação

Documentação completa disponível em:

- **Product Backlog** - 40 histórias de usuário documentadas
- **Guias** - Docker, CI/CD, Testes E2E
- **Análise** - Análise completa do projeto

Arquivos de documentação:

- `PRODUCT-BACKLOG-PARTE1.md` - Épicos 1-3
- `PRODUCT-BACKLOG-PARTE2.md` - Épicos 4-8
- `PRODUCT-BACKLOG-PARTE3.md` - Épicos 9-10
- `GUIA-DOCKER-CICD.md` - Guia de Docker e CI/CD
- `GUIA-EXECUCAO-RAPIDO.md` - Guia rápido
- `ANALISE-COMPLETA-PROJETO.md` - Análise técnica

## Suporte

- **Desenvolvedor**: Mateus Orlando

---

## Licença

Este projeto é desenvolvido para fins acadêmicos como parte do curso de Técnicas de Programação em Plataformas Emergentes.

---

---

<div align="center">

Desenvolvido por Mateus Orlando

</div>
