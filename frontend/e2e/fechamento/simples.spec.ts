import { test, expect } from '@playwright/test';
import { doLogin } from '../helpers/auth.helper';

test.describe('Fechamento Mensal - Simplificado', () => {
  test('deve navegar para página de fechamento', async ({ page }) => {
    await doLogin(page);
    await page.goto('/fechamento');
    await expect(page).toHaveURL(/.*fechamento/);
  });

  test('deve exibir informações de fechamento', async ({ page }) => {
    await doLogin(page);
    await page.goto('/fechamento');
    await expect(page).toHaveURL(/.*fechamento/);
    await expect(
      page.getByRole('heading', { name: /fechamento|fechar/i }).first()
    ).toBeVisible({ timeout: 5000 });
    // Verificar que há conteúdo na página
    const hasContent = await page
      .locator('text=/Fechamento|Total|Receitas|Despesas/i')
      .count();
    expect(hasContent).toBeGreaterThan(0);
  });
});
