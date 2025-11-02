'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const success = await login({ email, senha: password });
      if (success) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // Login de demonstração (se houver usuário demo no backend)
  const handleDemoLogin = async () => {
    try {
      const success = await login({
        email: 'demo@spendwise.com',
        senha: 'demo123',
      });
      if (success) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Demo login failed:', error);
    }
  };

  return (
    <div className='space-y-8'>
      {/* Título Melhorado */}
      <div className='text-center space-y-2'>
        <h1 className='text-3xl font-bold tracking-tight text-slate-900 dark:text-white'>
          Entrar na sua conta
        </h1>
        <p className='text-slate-600 dark:text-slate-400 text-lg'>
          Digite seu email e senha para acessar o SpendWise
        </p>
      </div>

      {/* Card do Formulário */}
      <div className='bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-2'>
            <Label
              htmlFor='email'
              className='text-slate-700 dark:text-slate-200 font-medium'
            >
              Email
            </Label>
            <Input
              id='email'
              type='email'
              placeholder='seu@email.com'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className='w-full rounded-xl bg-slate-50 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
            />
          </div>

          <div className='space-y-2'>
            <Label
              htmlFor='password'
              className='text-slate-700 dark:text-slate-200 font-medium'
            >
              Senha
            </Label>
            <div className='relative'>
              <Input
                id='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='Digite sua senha'
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className='w-full rounded-xl pr-10 bg-slate-50 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors'
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button
            type='submit'
            className='w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-full'
            disabled={isLoading}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <div className='mt-6 text-center text-sm space-y-3'>
          <div>
            <span className='text-slate-600 dark:text-slate-400'>
              Não tem uma conta?{' '}
            </span>
            <Link
              href='/register'
              className='text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors'
            >
              Criar conta
            </Link>
          </div>
          <div>
            <Link
              href='/esqueci-senha'
              className='text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors'
            >
              Esqueceu sua senha?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
