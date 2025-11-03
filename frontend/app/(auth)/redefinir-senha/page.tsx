'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getApiUrl } from '@/lib/config';
import Link from 'next/link';
import { Eye, EyeOff, Lock, CheckCircle2 } from 'lucide-react';

function RedefinirSenhaContent() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const emailParam = searchParams.get('email');
    const tokenParam = searchParams.get('token');

    if (!emailParam || !tokenParam) {
      toast({
        title: 'Link inválido',
        description: 'O link de recuperação está inválido ou expirado.',
        variant: 'destructive',
      });
      router.push('/esqueci-senha');
      return;
    }

    setEmail(emailParam);
    setToken(tokenParam);
  }, [searchParams, router, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Erro',
        description: 'As senhas não coincidem.',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: 'Erro',
        description: 'A senha deve ter no mínimo 6 caracteres.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = getApiUrl();
      const response = await fetch(
        `${apiUrl}/Auth/reset-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            token,
            newPassword,
            confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        toast({
          title: '✅ Senha redefinida!',
          description: 'Sua senha foi alterada com sucesso.',
        });

        // Redirecionar para login após 3 segundos
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        toast({
          title: 'Erro',
          description:
            data.message ||
            'Não foi possível redefinir a senha. O link pode estar expirado.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description:
          'Ocorreu um erro ao processar sua solicitação. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className='space-y-8'>
        <div className='text-center space-y-4'>
          <div className='flex justify-center'>
            <div className='rounded-full bg-emerald-100 dark:bg-emerald-900/30 p-4'>
              <CheckCircle2 className='w-12 h-12 text-emerald-600 dark:text-emerald-400' />
            </div>
          </div>
          <h1 className='text-3xl font-bold tracking-tight text-slate-900 dark:text-white'>
            Senha Redefinida!
          </h1>
          <p className='text-slate-600 dark:text-slate-400 text-lg max-w-md mx-auto'>
            Sua senha foi alterada com sucesso. Você será redirecionado para o
            login em instantes...
          </p>
        </div>

        <div className='bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 text-center'>
          <Link
            href='/login'
            className='text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors'
          >
            Ir para o login agora
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      {/* Título */}
      <div className='text-center space-y-2'>
        <h1 className='text-3xl font-bold tracking-tight text-slate-900 dark:text-white'>
          Redefinir Senha
        </h1>
        <p className='text-slate-600 dark:text-slate-400 text-lg'>
          Digite sua nova senha abaixo
        </p>
      </div>

      {/* Formulário */}
      <div className='bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-2'>
            <Label
              htmlFor='newPassword'
              className='text-slate-700 dark:text-slate-200 font-medium'
            >
              Nova Senha
            </Label>
            <div className='relative'>
              <Lock
                className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'
                size={18}
              />
              <Input
                id='newPassword'
                type={showNewPassword ? 'text' : 'password'}
                placeholder='Digite sua nova senha'
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                className='w-full rounded-xl pl-10 pr-10 bg-slate-50 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
              />
              <button
                type='button'
                onClick={() => setShowNewPassword(!showNewPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors'
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className='space-y-2'>
            <Label
              htmlFor='confirmPassword'
              className='text-slate-700 dark:text-slate-200 font-medium'
            >
              Confirmar Nova Senha
            </Label>
            <div className='relative'>
              <Lock
                className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'
                size={18}
              />
              <Input
                id='confirmPassword'
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder='Confirme sua nova senha'
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                className='w-full rounded-xl pl-10 pr-10 bg-slate-50 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
              />
              <button
                type='button'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors'
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4'>
            <p className='text-sm text-blue-800 dark:text-blue-300'>
              💡 A senha deve ter no mínimo 6 caracteres
            </p>
          </div>

          <Button
            type='submit'
            className='w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-full'
            disabled={isLoading}
          >
            {isLoading ? 'Redefinindo...' : 'Redefinir Senha'}
          </Button>
        </form>

        <div className='mt-6 text-center'>
          <Link
            href='/login'
            className='text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors'
          >
            Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RedefinirSenhaPage() {
  return (
    <Suspense fallback={<div className='text-center'>Carregando...</div>}>
      <RedefinirSenhaContent />
    </Suspense>
  );
}
