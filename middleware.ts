import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const publicRoutes = ['/login', '/logout'];
const adminOnlyRoutes = ['/usuarios'];
const vendorExcludedRoutes = ['/ofertas', '/usuarios'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Las rutas públicas no necesitan autenticación
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Obtener el token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Si no hay token y no es ruta pública, redirigir a login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Validar permisos por rol
  const userRole = (token as any).role;

  // Rutas solo para admin
  if (adminOnlyRoutes.includes(pathname) && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Rutas excluidas para vendedor
  if (
    vendorExcludedRoutes.some((route) => pathname.startsWith(route)) &&
    userRole === 'vendedor'
  ) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
};
