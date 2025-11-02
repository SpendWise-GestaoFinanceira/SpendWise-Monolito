# ============================================
# Stage 1: Build
# ============================================
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copiar arquivos de projeto para restore
COPY ["src/SpendWise.API/SpendWise.API.csproj", "src/SpendWise.API/"]
COPY ["src/SpendWise.Application/SpendWise.Application.csproj", "src/SpendWise.Application/"]
COPY ["src/SpendWise.Domain/SpendWise.Domain.csproj", "src/SpendWise.Domain/"]
COPY ["src/SpendWise.Infrastructure/SpendWise.Infrastructure.csproj", "src/SpendWise.Infrastructure/"]

# Restore dependencies
RUN dotnet restore "src/SpendWise.API/SpendWise.API.csproj"

# Copiar todo o código fonte
COPY . .

# Build e Publish
WORKDIR "/src/src/SpendWise.API"
RUN dotnet publish "SpendWise.API.csproj" \
    -c Release \
    -o /app/publish \
    --no-restore \
    /p:UseAppHost=false

# ============================================
# Stage 2: Runtime
# ============================================
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

# Instalar curl para health checks
RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*

# Copiar aplicação publicada
COPY --from=build /app/publish .

# Configurar porta
ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Production

# Expor porta
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:5000/api/Health || exit 1

# Comando de inicialização
ENTRYPOINT ["dotnet", "SpendWise.API.dll"]
