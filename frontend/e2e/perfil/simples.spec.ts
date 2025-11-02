import { test, expect } from '@playwright/test';
import { doLogin } from '../helpers/auth.helper';

test.describe('Perfil - Simplificado', () => {
  test('deve navegar para página de perfil', async ({ page }) => {
    await doLogin(page);
    await page.goto('/perfil');
    await expect(page).toHaveURL(/.*perfil/);
  });

  test('deve exibir dados do usuário', async ({ page }) => {
    await doLogin(page);
    await page.goto('/perfil');
    await page.waitForLoadState('networkidle');

    // Verificar que há formulário com dados
    const hasForm = await page
      .locator('input#email, input[type="email"]')
      .count();
    expect(hasForm).toBeGreaterThan(0);
  });
});
