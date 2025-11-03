import { test as setup } from '@playwright/test';

const API_URL = process.env.API_URL || 'http://localhost:5000/api';

setup('criar usuário de teste', async ({ request }) => {
  // Tentar criar o usuário de teste
  try {
    const response = await request.post(`${API_URL}/auth/register`, {
      data: {
        nome: 'Ana Silva',
        email: 'ana@teste.com',
        senha: 'Senha@123',
        confirmarSenha: 'Senha@123',
      },
    });

    if (response.ok()) {
      console.log('✅ Usuário de teste criado com sucesso');
    } else {
      const error = await response.text();
      console.log('⚠️  Usuário já existe ou erro ao criar:', error);
    }
  } catch (error) {
    console.log('⚠️  Erro ao criar usuário:', error);
  }
});
