/**
 * Configuração centralizada da aplicação
 * Usa variáveis de ambiente com fallback para desenvolvimento
 */

// Para variáveis que precisam estar disponíveis no cliente
export const getApiUrl = (): string => {
  // Em produção, tenta pegar de window.__ENV__ (injetado pelo servidor)
  if (typeof window !== 'undefined' && (window as any).__ENV__?.API_URL) {
    return (window as any).__ENV__.API_URL;
  }
  
  // Fallback para variável de ambiente do Next.js
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
};

export const config = {
  apiUrl: getApiUrl(),
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'SpendWise',
  environment: process.env.NODE_ENV || 'development',
};
