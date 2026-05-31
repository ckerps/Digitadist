import { UsuarioService } from '@/services/usuario.service';
import { NextRequest, NextResponse } from 'next/server'
import * as z from 'zod';

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     tags: [Usuarios]
 *     parameters:
 *       - in: query
 *         name: items
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de usuarios por página
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Página actual
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filtrar por email
 *       - in: query
 *         name: nombre
 *         schema:
 *           type: string
 *         description: Filtrar por nombre
 *       - in: query
 *         name: rol
 *         schema:
 *           type: string
 *         description: Filtrar por rol (admin, vendedor, etc.)
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *       400:
 *         description: Error de validación en parámetros
 *       500:
 *         description: Error interno del servidor
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const itemsPerPage = parseInt(url.searchParams.get('items') || '10');
    const currentPage = parseInt(url.searchParams.get('page') || '1');
    const filters: Partial<{ [key: string]: string }> = {};
    url.searchParams.forEach((value, key) => {
      if (key !== 'itemsPerPage' && key !== 'currentPage') {
        filters[key] = value;
      }
    });

    const usuarios = await UsuarioService.obtenerTodos(itemsPerPage, currentPage, filters)
    return NextResponse.json(usuarios, { status: 200 })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        type: "ValidationError",
        details: error.flatten().fieldErrors
      }, { status: 400 });
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - contrasena
 *               - nombre
 *               - rol
 *             properties:
 *               email:
 *                 type: string
 *               contrasena:
 *                 type: string
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               rol:
 *                 type: string
 *                 enum: [ADMIN, VENDEDOR, CLIENTE]
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Error de validación en datos provistos
 *       500:
 *         description: Error interno del servidor
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const resultado = await UsuarioService.crear(body);

    return NextResponse.json(resultado, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        type: "ValidationError",
        details: error.flatten().fieldErrors
      }, { status: 400 });
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
