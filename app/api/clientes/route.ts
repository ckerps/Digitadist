import { ClienteService } from '@/services/cliente.service'
import { NuevoCliente } from '@/types/cliente'
import { NextRequest, NextResponse } from 'next/server'
import * as z from 'zod';

/**
 * @swagger
 * /api/clientes:
 *   get:
 *     summary: Obtiene todos los clientes
 *     tags: [Clientes]
 *     parameters:
 *       - in: query
 *         name: itemsPerPage
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de clientes por página
 *       - in: query
 *         name: currentPage
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Página actual
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         description: ID del cliente
 *       - in: query
 *         name: nombre
 *         schema:
 *           type: string
 *         description: Nombre del cliente
 *       - in: query
 *         name: telefono
 *         schema:
 *           type: string
 *         description: Teléfono del cliente
 *       - in: query
 *         name: cuit
 *         schema:
 *           type: string
 *         description: CUIT del cliente
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *         description: Tipo de cliente
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Email del cliente
 *       - in: query
 *         name: activo
 *         schema:
 *           type: boolean
 *         description: Estado activo/inactivo
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Término de búsqueda general
 *     responses:
 *       200:
 *         description: Lista de clientes paginada obtenida exitosamente
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno del servidor
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const itemsPerPage = parseInt(url.searchParams.get('itemsPerPage') || '10');
    const currentPage = parseInt(url.searchParams.get('currentPage') || '1');

    // Extraer filtros de los query params
    const filtros: any = {};
    if (url.searchParams.has('id')) filtros.id = parseInt(url.searchParams.get('id') || '0');
    if (url.searchParams.has('nombre')) filtros.nombre = url.searchParams.get('nombre');
    if (url.searchParams.has('telefono')) filtros.telefono = url.searchParams.get('telefono');
    if (url.searchParams.has('cuit')) filtros.cuit = url.searchParams.get('cuit');
    if (url.searchParams.has('tipo')) filtros.tipo = url.searchParams.get('tipo');
    if (url.searchParams.has('email')) filtros.email = url.searchParams.get('email');
    if (url.searchParams.has('activo')) filtros.activo = url.searchParams.get('activo') === 'true';
    if (url.searchParams.has('searchTerm')) filtros.searchTerm = url.searchParams.get('searchTerm');

    const clientes = await ClienteService.obtenerTodos(itemsPerPage, currentPage, Object.keys(filtros).length > 0 ? filtros : undefined)
    return NextResponse.json(clientes, { status: 200 })
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
 * /api/clientes:
 *   post:
 *     summary: Crea un nuevo cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - cuit
 *             properties:
 *               nombre:
 *                 type: string
 *               cuit:
 *                 type: string
 *               telefono:
 *                 type: string
 *               email:
 *                 type: string
 *               direccion:
 *                 type: string
 *               activo:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Cliente creado exitosamente
 *       400:
 *         description: Error de validación en los datos provistos
 *       409:
 *         description: Ya existe un cliente con ese CUIT
 *       500:
 *         description: Error interno del servidor
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const resultado = await ClienteService.crear(body);
    return NextResponse.json(resultado, { status: 201 });
  } catch (error: any) {
    console.log('Error creating cliente:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        type: "ValidationError",
        details: error.flatten().fieldErrors
      }, { status: 400 });
    }

    if (error.message === "Ya existe un cliente con ese CUIT") {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
