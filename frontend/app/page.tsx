'use client';

import Link from 'next/link';
import {
  BarChart3,
  PieChart,
  Shield,
  Smartphone,
  TrendingUp,
  Users,
  ArrowRight,
  Star,
  CheckCircle,
  Target,
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || isAuthenticated) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-800'>
      {/* Header */}
      <header className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex h-16 items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg'>
                <BarChart3 className='h-6 w-6 text-white' />
              </div>
              <span className='text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent'>
                SpendWise
              </span>
            </div>

            <div className='flex items-center space-x-4'>
              <ThemeToggle />
              <Link href='/login'>
                <button className='text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors'>
                  Entrar
                </button>
              </Link>
              <Link href='/register'>
                <button className='bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl'>
                  Começar
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className='py-20 px-4'>
        <div className='max-w-6xl mx-auto text-center'>
          <div className='mb-8'>
            <h1 className='text-5xl md:text-7xl font-bold mb-6'>
              <span className='bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 dark:from-white dark:via-gray-100 dark:to-gray-300 bg-clip-text text-transparent'>
                Transforme suas Finanças
              </span>
              <br />
              <span className='bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-gray-100 dark:via-white dark:to-gray-200 bg-clip-text text-transparent'>
                com SpendWise
              </span>
            </h1>
            <p className='text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto'>
              A plataforma completa para controle financeiro que você estava
              esperando. Monitore gastos, planeje seu futuro e alcance seus
              objetivos com facilidade.
            </p>
          </div>

          <div className='flex flex-col sm:flex-row gap-4 justify-center mb-12'>
            <Link href='/register'>
              <button className='bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl flex items-center gap-2'>
                Começar Gratuitamente
                <ArrowRight className='h-5 w-5' />
              </button>
            </Link>
            <Link href='/demo'>
              <button className='border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-emerald-500 dark:hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105'>
                Ver Demonstração
              </button>
            </Link>
          </div>

          <div className='flex items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400'>
            <div className='flex items-center gap-2'>
              <CheckCircle className='h-5 w-5 text-emerald-500' />
              <span>Grátis para sempre</span>
            </div>
            <div className='flex items-center gap-2'>
              <CheckCircle className='h-5 w-5 text-emerald-500' />
              <span>Sem cartão de crédito</span>
            </div>
            <div className='flex items-center gap-2'>
              <CheckCircle className='h-5 w-5 text-emerald-500' />
              <span>Setup em 2 minutos</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-20 px-4 bg-white dark:bg-gray-900'>
        <div className='max-w-6xl mx-auto'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6'>
              Recursos que Fazem a Diferença
            </h2>
            <p className='text-xl text-gray-600 dark:text-gray-300 leading-relaxed'>
              Tudo que você precisa para ter controle total das suas finanças em
              uma só plataforma
            </p>
          </div>

          <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {/* Card 1 */}
            <div className='group bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-100 dark:border-red-800 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2'>
              <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 text-white mb-6 group-hover:scale-110 transition-transform duration-300'>
                <PieChart className='h-7 w-7' />
              </div>
              <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                Controle de Gastos
              </h3>
              <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
                Categorize e monitore todos os seus gastos com facilidade.
                Visualize para onde seu dinheiro está indo.
              </p>
            </div>

            {/* Card 2 */}
            <div className='group bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-100 dark:border-emerald-800 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2'>
              <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white mb-6 group-hover:scale-110 transition-transform duration-300'>
                <TrendingUp className='h-7 w-7' />
              </div>
              <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                Relatórios Inteligentes
              </h3>
              <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
                Visualize seus dados financeiros com gráficos interativos e
                relatórios detalhados em tempo real.
              </p>
            </div>

            {/* Card 3 */}
            <div className='group bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2'>
              <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white mb-6 group-hover:scale-110 transition-transform duration-300'>
                <Shield className='h-7 w-7' />
              </div>
              <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                Segurança Total
              </h3>
              <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
                Seus dados estão protegidos com criptografia de ponta e as
                melhores práticas de segurança.
              </p>
            </div>

            {/* Card 4 */}
            <div className='group bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border border-purple-100 dark:border-purple-800 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2'>
              <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-violet-500 text-white mb-6 group-hover:scale-110 transition-transform duration-300'>
                <Smartphone className='h-7 w-7' />
              </div>
              <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                Acesso Mobile
              </h3>
              <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
                Gerencie suas finanças em qualquer lugar, a qualquer hora, com
                nossa interface responsiva.
              </p>
            </div>

            {/* Card 5 */}
            <div className='group bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-100 dark:border-orange-800 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2'>
              <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white mb-6 group-hover:scale-110 transition-transform duration-300'>
                <BarChart3 className='h-7 w-7' />
              </div>
              <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                Orçamentos Personalizados
              </h3>
              <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
                Crie e acompanhe orçamentos que se adaptam ao seu estilo de vida
                e objetivos financeiros.
              </p>
            </div>

            {/* Card 6 */}
            <div className='group bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border border-teal-100 dark:border-teal-800 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2'>
              <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white mb-6 group-hover:scale-110 transition-transform duration-300'>
                <Users className='h-7 w-7' />
              </div>
              <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                Suporte 24/7
              </h3>
              <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
                Nossa equipe especializada está sempre pronta para ajudá-lo a
                alcançar seus objetivos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20'>
        <div className='max-w-4xl mx-auto px-4 text-center'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4'>
            Pronto para Transformar suas Finanças?
          </h2>
          <p className='text-xl text-gray-600 dark:text-gray-300 mb-8'>
            Junte-se a milhares de usuários que já tomaram controle de suas
            finanças
          </p>
          <Link href='/register'>
            <button className='bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-full text-lg font-medium transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl'>
              Começar Agora - É Grátis!
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className='border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-12'>
        <div className='max-w-6xl mx-auto px-4'>
          <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
            <div className='flex items-center space-x-2'>
              <div className='flex h-6 w-6 items-center justify-center rounded bg-gradient-to-r from-green-500 to-emerald-500'>
                <BarChart3 className='h-4 w-4 text-white' />
              </div>
              <span className='font-semibold text-gray-900 dark:text-white'>
                SpendWise
              </span>
            </div>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              © 2024 SpendWise. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
