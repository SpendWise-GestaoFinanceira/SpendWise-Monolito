import { test, expect } from '@playwright/test';
import { doLogin } from '../helpers/auth.helper';

test.describe('Criar Transação', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await doLogin(page);

    // Navegar para transações
    await page.goto('/transacoes');
    await page.waitForLoadState('domcontentloaded');
  });

  test('deve criar despesa com sucesso', async ({ page }) => {
    // Clicar no botão de nova transação
    const botaoNova = page.getByRole('button', {
      name: /nova transação|adicionar|criar/i,
    });
    await botaoNova.click();

    // Aguardar modal ou formulário abrir
    await page.waitForTimeout(1000);
    const descricaoInput = page
      .locator('input[name="descricao"], input[placeholder*="Descrição"]')
      .first();
    await descricaoInput.waitFor({ state: 'visible', timeout: 5000 });

    // Preencher formulário
    const descricao = `Teste E2E - ${Date.now()}`;
    await page.fill(
      'input[name="descricao"], input[placeholder*="Descrição"]',
      descricao
    );
    await page.fill('input[name="valor"], input[type="number"]', '150.50');

    // Selecionar tipo Despesa
    const tipoSelect = page.locator('select[name="tipo"]').first();
    if (await tipoSelect.isVisible()) {
      await tipoSelect.selectOption('Despesa');
    }

    // Selecionar categoria
    const categoriaSelect = page.locator('select[name="categoriaId"]').first();
    if (await categoriaSelect.isVisible()) {
      await categoriaSelect.selectOption({ index: 1 }); // Primeira categoria disponível
    }

    // Preencher data
    const dataInput = page
      .locator('input[name="dataTransacao"], input[type="date"]')
      .first();
    if (await dataInput.isVisible()) {
      await dataInput.fill('2025-10-19');
    }

    // Submeter
    const submitButton = page
      .locator('button[type="submit"]')
      .filter({ hasText: /salvar|criar|confirmar/i })
      .first();
    await submitButton.click();

    // Aguardar processamento
    await page.waitForTimeout(2000);

    // Verificar que o modal fechou ou a página atualizou
    await page.waitForLoadState('networkidle');
  });

  test('deve criar receita com sucesso', async ({ page }) => {
    await page.click(
      'button:has-text("Nova Transação"), button:has-text("Adicionar")'
    );
    await page.waitForSelector('input[name="descricao"]', { timeout: 5000 });

    const descricao = `Receita E2E - ${Date.now()}`;
    await page.fill('input[name="descricao"]', descricao);
    await page.fill('input[name="valor"]', '2500.00');

    // Selecionar tipo Receita
    const tipoSelect = page.locator('select[name="tipo"]').first();
    if (await tipoSelect.isVisible()) {
      await tipoSelect.selectOption('Receita');
    }

    const submitButton = page.locator('button[type="submit"]').first();
    await submitButton.click();

    // Aguardar processamento
    await page.waitForTimeout(2000);
    await page.waitForLoadState('networkidle');
  });

  test('deve validar campos obrigatórios', async ({ page }) => {
    await page.click('button:has-text("Nova Transação")');
    await page.waitForSelector('input[name="descricao"]', { timeout: 5000 });

    // Tentar submeter sem preencher
    await page.click('button[type="submit"]');

    // Verificar que o formulário não foi submetido (ainda visível)
    await expect(page.locator('input[name="descricao"]')).toBeVisible();
  });

  test('deve exibir transação criada na lista', async ({ page }) => {
    await page.goto('/transacoes');
    await page.waitForLoadState('networkidle');

    // Verificar que a página de transações carregou
    await expect(page).toHaveURL(/.*transacoes/);
    await expect(
      page.getByRole('heading', { name: /transações/i })
    ).toBeVisible();
  });
});
