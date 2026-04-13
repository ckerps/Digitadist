import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from './prisma';
import bcrypt from 'bcrypt';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Credenciales inválidas');
        }

        const usuario = await prisma.usuario.findUnique({
          where: { email: credentials.email },
          include: { rol: true },
        });

        if (!usuario || !usuario.password) {
          throw new Error('Usuario no encontrado');
        }

        if (!usuario.activo) {
          throw new Error('Usuario inactivo');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          usuario.password
        );

        if (!isPasswordValid) {
          throw new Error('Credenciales inválidas');
        }

        return {
          id: usuario.id.toString(),
          email: usuario.email,
          name: `${usuario.nombre} ${usuario.apellido}`,
          image: usuario.image,
          role: usuario.rol.nombre,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.name = user.name; // guardar nombre en el JWT
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        session.user.name = token.name as string; // propagar nombre a la sesión
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 8, // 8 horas
  },
  secret: process.env.NEXTAUTH_SECRET,
};
