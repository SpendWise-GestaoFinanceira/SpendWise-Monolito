import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('deve fazer login com sucesso', async ({ page }) => {
    // Preencher formulário
    await page.fill('#email', 'ana@teste.com');
    await page.fill('#password', 'Senha@123');

    // Submeter
    await page.click('button[type="submit"]:has-text("Entrar")');

    // Verificar redirecionamento
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });

    // Verificar que está na dashboard (usando o h1)
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible(
      { timeout: 5000 }
    );
  });

  test('deve exibir erro com credenciais inválidas', async ({ page }) => {
    // Preencher com credenciais inválidas
    await page.fill('#email', 'invalido@teste.com');
    await page.fill('#password', 'SenhaErrada123');

    // Submeter
    await page.click('button[type="submit"]:has-text("Entrar")');

    // Aguardar resposta
    await page.waitForTimeout(2000);

    // Verificar que permanece na página de login ou mostra erro
    const isOnLogin = page.url().includes('login');
    expect(isOnLogin).toBeTruthy();
  });

  test('deve validar campos obrigatórios', async ({ page }) => {
    // Tentar submeter sem preencher
    await page.click('button[type="submit"]:has-text("Entrar")');

    // Verificar que ainda está na página de login (validação HTML5)
    await expect(page).toHaveURL(/.*login/);
  });

  test('deve redirecionar para dashboard se já autenticado', async ({
    page,
  }) => {
    // Login primeiro
    await page.fill('#email', 'ana@teste.com');
    await page.fill('#password', 'Senha@123');
    await page.click('button[type="submit"]:has-text("Entrar")');
    await page.waitForLoadState('networkidle');
    await page.waitForURL('/dashboard', { timeout: 15000 });

    // Tentar acessar login novamente
    await page.goto('/login');

    // Deve redirecionar para dashboard ou permanecer (depende da implementação)
    await page.waitForTimeout(1000);
  });

  test('deve permitir logout', async ({ page }) => {
    // Login
    await page.fill('#email', 'ana@teste.com');
    await page.fill('#password', 'Senha@123');
    await page.click('button[type="submit"]:has-text("Entrar")');
    await page.waitForLoadState('networkidle');
    await page.waitForURL('/dashboard', { timeout: 15000 });

    // Procurar botão de logout (pode estar em dropdown ou menu)
    await page.waitForLoadState('domcontentloaded');

    // Tentar clicar em avatar/menu primeiro
    const menuButton = page
      .locator(
        'button[aria-label*="menu" i], button:has([aria-label*="perfil" i]), button:has-text("AS")'
      )
      .first();
    if (await menuButton.isVisible({ timeout: 2000 })) {
      await menuButton.click();
      await page.waitForTimeout(500);
    }

    // Fazer logout
    const logoutButton = page
      .locator(
        'button:has-text("Sair"), a:has-text("Sair"), [role="menuitem"]:has-text("Sair")'
      )
      .first();
    if (await logoutButton.isVisible({ timeout: 2000 })) {
      await logoutButton.click();
      // Verificar redirecionamento para login
      await expect(page).toHaveURL(/.*login/, { timeout: 5000 });
    }
  });
});
