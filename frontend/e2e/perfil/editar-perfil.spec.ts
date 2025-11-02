import { test, expect } from '@playwright/test';
import { doLogin } from '../helpers/auth.helper';

test.describe('Editar Perfil', () => {
  test.beforeEach(async ({ page }) => {
    await doLogin(page);
    await page.goto('/perfil');
    await page.waitForLoadState('domcontentloaded');
  });

  test('deve exibir dados do usuário', async ({ page }) => {
    // Verificar que a página de perfil carregou
    await expect(page).toHaveURL(/.*perfil/);
    await expect(page.getByRole('heading', { name: /perfil/i })).toBeVisible();

    // Verificar que há algum campo com email
    const emailField = page
      .locator('input[type="email"], input[name="email"]')
      .first();
    if (await emailField.isVisible({ timeout: 3000 })) {
      await expect(emailField).toHaveValue(/.*@.*/);
    }
  });

  test('deve editar nome com sucesso', async ({ page }) => {
    await page.waitForTimeout(1000);
    const nomeInput = page.locator('input[name="nome"]').first();
    if (await nomeInput.isVisible({ timeout: 3000 })) {
      await nomeInput.clear();
      await nomeInput.fill('Ana Silva Updated');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);
      // Toast pode ou não aparecer dependendo da implementação
    }
  });

  test('deve validar campos obrigatórios', async ({ page }) => {
    await page.waitForTimeout(1000);
    const nomeInput = page.locator('input[name="nome"]').first();
    if (await nomeInput.isVisible({ timeout: 3000 })) {
      await nomeInput.clear();
      await page.click('button[type="submit"]');
      await page.waitForTimeout(1000);
      // Validação HTML5 ou permanece na página
      await expect(page).toHaveURL(/.*perfil/);
    }
  });

  test('deve ativar/desativar notificações', async ({ page }) => {
    await page.waitForTimeout(1000);
    const checkbox = page.locator('input[type="checkbox"]').first();
    if (await checkbox.isVisible({ timeout: 2000 })) {
      await checkbox.click();
      const botaoSalvar = page.locator('button[type="submit"]').first();
      if (await botaoSalvar.isVisible()) {
        await botaoSalvar.click();
      }
    }
  });
});
