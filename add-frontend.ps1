# Script para adicionar frontend ao Git corretamente

Write-Host "🔧 Adicionando frontend ao repositório..." -ForegroundColor Cyan

# Adicionar arquivos importantes do frontend
$filesToAdd = @(
    "frontend/.dockerignore",
    "frontend/.eslintrc.cjs",
    "frontend/.gitignore",
    "frontend/.prettierignore",
    "frontend/.prettierrc",
    "frontend/Dockerfile",
    "frontend/README.md",
    "frontend/app",
    "frontend/components",
    "frontend/components.json",
    "frontend/contexts",
    "frontend/docker-compose.yml",
    "frontend/env.example",
    "frontend/hooks",
    "frontend/instrumentation.ts",
    "frontend/jest.config.js",
    "frontend/jest.setup.js",
    "frontend/lib",
    "frontend/middleware.ts",
    "frontend/next.config.mjs",
    "frontend/package.json",
    "frontend/package-lock.json",
    "frontend/playwright.config.ts",
    "frontend/postcss.config.js",
    "frontend/providers",
    "frontend/public",
    "frontend/styles",
    "frontend/tailwind.config.js",
    "frontend/tsconfig.json",
    "frontend/types"
)

Write-Host "📦 Adicionando arquivos fonte..." -ForegroundColor Yellow

foreach ($file in $filesToAdd) {
    if (Test-Path $file) {
        git add $file
        Write-Host "  ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Não encontrado: $file" -ForegroundColor DarkGray
    }
}

Write-Host "`n✅ Frontend adicionado!" -ForegroundColor Green
Write-Host "📊 Verificando status..." -ForegroundColor Cyan

git status --short | Select-Object -First 20

Write-Host "`n🚀 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. git commit -m 'feat: adicionar frontend ao monorepo'" -ForegroundColor White
Write-Host "2. git push origin main" -ForegroundColor White
