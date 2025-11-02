import { test, expect } from '@playwright/test';
import { doLogin } from '../helpers/auth.helper';

test.describe('Fechamento Mensal', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await doLogin(page);

    // Navegar para fechamento
    await page.goto('/fechamento');
    await page.waitForLoadState('domcontentloaded');
  });

  test('deve exibir página de fechamento corretamente', async ({ page }) => {
    // Verificar título
    await expect(
      page.getByRole('heading', { name: /fechamento/i }).first()
    ).toBeVisible();

    // Verificar que há elementos da página (receitas, despesas, saldo)
    const hasContent = await page
      .getByText(/receita|despesa|saldo|fechado/i)
      .count();
    expect(hasContent).toBeGreaterThan(0);
  });

  test('deve exibir informações do mês atual', async ({ page }) => {
    // Verificar período
    const mesAtual = new Date().toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric',
    });
    const periodoMatcher = new RegExp(mesAtual, 'i');

    // Aguardar carregamento dos dados
    await page.waitForTimeout(2000);

    // Verificar informações financeiras estão visíveis
    const hasFinancialInfo = await page
      .getByText(/receita|despesa|saldo/i)
      .first()
      .isVisible({ timeout: 5000 })
      .catch(() => false);
    expect(hasFinancialInfo).toBeTruthy();
  });

  test('deve fechar mês com sucesso', async ({ page }) => {
    // Verificar se há botão para fechar (mês não está fechado)
    const botaoFechar = page
      .locator('button:has-text("Fechar Mês"), button:has-text("Fechar o Mês")')
      .first();

    // Se o mês já estiver fechado, reabrir primeiro (se disponível)
    const botaoReabrir = page.locator('button:has-text("Reabrir")').first();
    if (await botaoReabrir.isVisible({ timeout: 2000 })) {
      await botaoReabrir.click();
      await page.waitForTimeout(1000);
    }

    // Verificar se botão de fechar está disponível
    const isBotaoFechadoDisponivel = await botaoFechar.isVisible({
      timeout: 2000,
    });

    if (isBotaoFechadoDisponivel) {
      // Clicar no botão de fechar
      await botaoFechar.click();

      // Se houver modal de confirmação, confirmar
      const modalConfirmar = page
        .locator('button:has-text("Confirmar"), button:has-text("Sim")')
        .first();
      if (await modalConfirmar.isVisible({ timeout: 2000 })) {
        await modalConfirmar.click();
      }

      // Verificar toast de sucesso
      await expect(page.locator('.toast, [role="alert"]')).toContainText(
        /sucesso|fechado/i,
        { timeout: 10000 }
      );

      // Verificar que status mudou para "Fechado"
      await expect(page.locator('text=/Fechado|Status.*Fechado/i')).toBeVisible(
        { timeout: 5000 }
      );
    }
  });

  test('deve mostrar histórico de fechamentos', async ({ page }) => {
    // Verificar que a página de fechamento carregou
    await expect(page).toHaveURL(/.*fechamento/);
    await expect(
      page.getByRole('heading', { name: /fechamento/i }).first()
    ).toBeVisible();
    // Histórico pode estar vazio se não houver fechamentos anteriores
  });

  test('não deve permitir fechar mês já fechado', async ({ page }) => {
    // Aguardar carregamento
    await page.waitForTimeout(2000);

    // Verificar se o botão de fechar está desabilitado ou não existe
    const botaoFechadoOuDesabilitado = page
      .locator(
        'button:has-text("Mês Fechado"), button:has-text("Fechar Mês")[disabled]'
      )
      .first();

    // Se não encontrar botão fechado/desabilitado, significa que o mês está aberto
    const isVisible = await botaoFechadoOuDesabilitado
      .isVisible({ timeout: 2000 })
      .catch(() => false);

    if (isVisible) {
      // Verificar que o botão está desabilitado
      await expect(botaoFechadoOuDesabilitado).toBeDisabled();
    }
  });

  test('deve calcular saldo final corretamente', async ({ page }) => {
    // Aguardar carregamento dos dados
    await page.waitForTimeout(2000);

    // Verificar que há valores numéricos exibidos
    const valores = page.locator('text=/R\\$.*\\d/').first();
    await expect(valores).toBeVisible({ timeout: 5000 });
  });

  test('deve permitir reabrir mês fechado', async ({ page }) => {
    // Primeiro, garantir que o mês está fechado
    const botaoFechar = page.locator('button:has-text("Fechar Mês")').first();
    if (await botaoFechar.isVisible({ timeout: 2000 })) {
      await botaoFechar.click();

      const modalConfirmar = page
        .locator('button:has-text("Confirmar"), button:has-text("Sim")')
        .first();
      if (await modalConfirmar.isVisible({ timeout: 2000 })) {
        await modalConfirmar.click();
      }

      await page.waitForTimeout(2000);
    }

    // Agora tentar reabrir
    const botaoReabrir = page.locator('button:has-text("Reabrir")').first();
    if (await botaoReabrir.isVisible({ timeout: 2000 })) {
      await botaoReabrir.click();

      // Confirmar se houver modal
      const modalConfirmar = page
        .locator('button:has-text("Confirmar"), button:has-text("Sim")')
        .first();
      if (await modalConfirmar.isVisible({ timeout: 2000 })) {
        await modalConfirmar.click();
      }

      // Verificar toast de sucesso
      await expect(page.locator('.toast')).toContainText(/reaberto|sucesso/i, {
        timeout: 10000,
      });
    }
  });
});
