import { Page } from '@playwright/test';

export async function doLogin(page: Page) {
  await page.goto('/login');
  await page.fill('#email', 'ana@teste.com');
  await page.fill('#password', 'Senha@123');
  await page.click('button[type="submit"]:has-text("Entrar")');
  await page.waitForLoadState('networkidle');
  await page.waitForURL('/dashboard', { timeout: 15000 });
}
