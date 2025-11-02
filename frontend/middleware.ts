import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ['/', '/login', '/register', '/demo'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Rotas protegidas que precisam de autenticação
  const protectedRoutes = [
    '/dashboard',
    '/transacoes',
    '/categorias',
    '/orcamento',
    '/relatorios',
    '/fechamento',
  ];
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  // Se for uma rota protegida, deixe o componente ProtectedRoute lidar com a autenticação
  if (isProtectedRoute) {
    return NextResponse.next();
  }

  // Para todas as outras rotas, continue normalmente
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
