'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { register, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    try {
      const success = await register({
        nome: name,
        email,
        senha: password,
        confirmarSenha: confirmPassword,
      });

      if (success) {
        // Após registro bem-sucedido, redireciona para dashboard
        router.push('/dashboard');
      }
    } catch (error) {
      setError('Ocorreu um erro ao criar a conta. Tente novamente mais tarde.');
      console.error('Register error:', error);
    }
  };

  return (
    <div className='space-y-8'>
      {/* Título Melhorado */}
      <div className='text-center space-y-2'>
        <h1 className='text-3xl font-bold tracking-tight text-slate-900 dark:text-white'>
          Criar sua conta
        </h1>
        <p className='text-slate-600 dark:text-slate-400 text-lg'>
          Comece a gerenciar suas finanças hoje
        </p>
      </div>

      {/* Card do Formulário */}
      <div className='bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50'>
        {error && (
          <div className='mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm rounded-lg border border-red-200 dark:border-red-800'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-4'>
            <div>
              <Label
                htmlFor='name'
                className='text-slate-700 dark:text-slate-200 font-medium'
              >
                Nome completo
              </Label>
              <Input
                id='name'
                type='text'
                placeholder='Seu nome completo'
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className='w-full rounded-xl mt-1 bg-slate-50 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
              />
            </div>

            <div>
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
                className='w-full rounded-xl mt-1 bg-slate-50 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
              />
            </div>

            <div>
              <Label
                htmlFor='password'
                className='text-slate-700 dark:text-slate-200 font-medium'
              >
                Senha
              </Label>
              <Input
                id='password'
                type='password'
                placeholder='Digite sua senha'
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className='w-full rounded-xl mt-1 bg-slate-50 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
              />
            </div>

            <div>
              <Label
                htmlFor='confirmPassword'
                className='text-slate-700 dark:text-slate-200 font-medium'
              >
                Confirmar senha
              </Label>
              <Input
                id='confirmPassword'
                type='password'
                placeholder='Confirme sua senha'
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                className='w-full rounded-xl mt-1 bg-slate-50 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
              />
            </div>
          </div>

          <Button
            type='submit'
            className='w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-full'
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Criando conta...
              </>
            ) : (
              'Criar conta'
            )}
          </Button>
        </form>

        <div className='mt-6 text-center text-sm'>
          <span className='text-slate-600 dark:text-slate-400'>
            Já tem uma conta?{' '}
          </span>
          <Link
            href='/login'
            className='font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors'
          >
            Faça login
          </Link>
        </div>
      </div>
    </div>
  );
}
