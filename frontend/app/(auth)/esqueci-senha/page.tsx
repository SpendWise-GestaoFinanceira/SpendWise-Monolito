'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        'http://localhost:5000/api/Auth/forgot-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setEmailSent(true);
        toast({
          title: '✅ Email enviado!',
          description:
            'Verifique sua caixa de entrada para redefinir sua senha.',
        });
      } else {
        toast({
          title: 'Erro',
          description:
            data.message || 'Não foi possível enviar o email de recuperação.',
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

  if (emailSent) {
    return (
      <div className='space-y-8'>
        <div className='text-center space-y-4'>
          <div className='flex justify-center'>
            <div className='rounded-full bg-emerald-100 dark:bg-emerald-900/30 p-4'>
              <CheckCircle2 className='w-12 h-12 text-emerald-600 dark:text-emerald-400' />
            </div>
          </div>
          <h1 className='text-3xl font-bold tracking-tight text-slate-900 dark:text-white'>
            Email Enviado!
          </h1>
          <p className='text-slate-600 dark:text-slate-400 text-lg max-w-md mx-auto'>
            Enviamos um link de recuperação para <strong>{email}</strong>.
            Verifique sua caixa de entrada e siga as instruções.
          </p>
        </div>

        <div className='bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50'>
          <div className='space-y-4 text-center'>
            <p className='text-sm text-slate-600 dark:text-slate-400'>
              Não recebeu o email? Verifique sua pasta de spam ou tente
              novamente.
            </p>
            <Button
              onClick={() => setEmailSent(false)}
              variant='outline'
              className='w-full rounded-xl border-slate-300 dark:border-slate-600'
            >
              Enviar novamente
            </Button>
            <Link
              href='/login'
              className='flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors'
            >
              <ArrowLeft size={16} />
              Voltar para o login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      {/* Título */}
      <div className='text-center space-y-2'>
        <h1 className='text-3xl font-bold tracking-tight text-slate-900 dark:text-white'>
          Esqueceu sua senha?
        </h1>
        <p className='text-slate-600 dark:text-slate-400 text-lg'>
          Digite seu email e enviaremos um link para redefinir sua senha
        </p>
      </div>

      {/* Formulário */}
      <div className='bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-2'>
            <Label
              htmlFor='email'
              className='text-slate-700 dark:text-slate-200 font-medium'
            >
              Email
            </Label>
            <div className='relative'>
              <Mail
                className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'
                size={18}
              />
              <Input
                id='email'
                type='email'
                placeholder='seu@email.com'
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className='w-full rounded-xl pl-10 bg-slate-50 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
              />
            </div>
          </div>

          <Button
            type='submit'
            className='w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-full'
            disabled={isLoading}
          >
            {isLoading ? 'Enviando...' : 'Enviar link de recuperação'}
          </Button>
        </form>

        <div className='mt-6 text-center'>
          <Link
            href='/login'
            className='flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors'
          >
            <ArrowLeft size={16} />
            Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  );
}
