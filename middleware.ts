import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const publicRoutes = ['/login', '/logout', '/manifest.webmanifest'];
const adminOnlyRoutes = ['/usuarios'];
const vendorExcludedRoutes = ['/ofertas', '/usuarios'];
const publicApiPrefixes = ['/api/auth'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Las rutas públicas no necesitan autenticación
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const isApi = pathname.startsWith('/api');

  // Permitir prefijos API públicos (p.ej. next-auth)
  if (isApi && publicApiPrefixes.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Obtener el token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Si no hay token y no es ruta pública, redirigir a login
  if (!token) {
    if (isApi) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Validar permisos por rol
  const userRole = ((token as any).role as string)?.toUpperCase() || '';

  // Normalizar ruta para comprobar permisos (soporta /api prefijo)
  const normalizedPath = isApi ? pathname.replace(/^\/api/, '') : pathname;

  // Rutas solo para admin (ej: todo lo que empiece por /usuarios)
  if (
    adminOnlyRoutes.some((route) => normalizedPath.startsWith(route)) &&
    userRole.toLowerCase() !== 'admin'
  ) {
    if (isApi) {
      return new NextResponse(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Rutas excluidas para vendedor
  if (
    vendorExcludedRoutes.some((route) => normalizedPath.startsWith(route)) &&
    userRole.toLowerCase() === 'vendedor'
  ) {
    if (isApi) {
      return new NextResponse(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
