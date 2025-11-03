# ========================================
# 🐳 DOCKERFILE OTIMIZADO - SPENDWISE FRONTEND
# ========================================
# Multi-stage build para produção

# ========================================
# Stage 1: Dependencies
# ========================================
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copiar apenas arquivos de dependências
COPY package.json package-lock.json* ./

# Instalar TODAS as dependências (incluindo devDependencies para o build)
RUN npm ci --ignore-scripts

# ========================================
# Stage 2: Builder
# ========================================
FROM node:18-alpine AS builder
WORKDIR /app

# Copiar dependências do stage anterior
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fonte
COPY . .

# Configurar variáveis de ambiente para build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# IMPORTANTE: Variáveis NEXT_PUBLIC_* devem ser definidas em BUILD TIME
# Elas serão embutidas no bundle JavaScript
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_APP_NAME=SpendWise
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME

# Build da aplicação
# Next.js coleta telemetria anônima sobre uso geral
# Desabilite com: NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ========================================
# Stage 3: Runner (Produção)
# ========================================
FROM node:18-alpine AS runner
WORKDIR /app

# Configurações de produção
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Criar usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copiar arquivos públicos
COPY --from=builder /app/public ./public

# Copiar arquivos de build
# Next.js gera automaticamente standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Mudar para usuário não-root
USER nextjs

# Expor porta
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Iniciar aplicação
CMD ["node", "server.js"]
