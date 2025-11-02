import { test, expect } from '@playwright/test';
import { doLogin } from '../helpers/auth.helper';

test.describe('Transações - Simplificado', () => {
  test('deve navegar para página de transações', async ({ page }) => {
    await doLogin(page);
    await page.goto('/transacoes');
    await expect(page).toHaveURL(/.*transacoes/);
    await expect(
      page.getByRole('heading', { name: /transações|movimentações/i }).first()
    ).toBeVisible({ timeout: 5000 });
  });

  test('deve exibir lista de transações', async ({ page }) => {
    await doLogin(page);
    await page.goto('/transacoes');
    await page.waitForLoadState('networkidle');

    // Verificar que a página carregou
    const hasTable = await page.locator('table').count();
    const hasList = await page.locator('.transaction-list').count();
    const hasText = await page.getByText(/transação|valor|data/i).count();
    expect(hasTable + hasList + hasText).toBeGreaterThan(0);
  });
});
