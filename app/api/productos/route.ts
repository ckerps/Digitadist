import { ProductoService } from '@/services/producto.service';
import { NextRequest, NextResponse } from 'next/server'
import * as z from 'zod';

/**
 * @swagger
 * /api/productos:
 *   get:
 *     summary: Obtiene todos los productos
 *     tags: [Productos]
 *     parameters:
 *       - in: query
 *         name: items
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de productos por página
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Página actual
 *       - in: query
 *         name: nombre
 *         schema:
 *           type: string
 *         description: Filtrar por nombre
 *       - in: query
 *         name: SKU
 *         schema:
 *           type: string
 *         description: Filtrar por SKU
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *         description: Filtrar por categoría
 *     responses:
 *       200:
 *         description: Lista de productos obtenida exitosamente
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
    const filters : Partial<{ [key: string]: string }> = {};
    url.searchParams.forEach((value, key) => {
      if (key !== 'itemsPerPage' && key !== 'currentPage') {
        filters[key] = value;
      }
    });

    const productos = await ProductoService.obtenerTodos(itemsPerPage, currentPage, filters)
    return NextResponse.json(productos, { status: 200 })
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
 * /api/productos:
 *   post:
 *     summary: Crea un nuevo producto
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - SKU
 *               - precioBase
 *             properties:
 *               nombre:
 *                 type: string
 *               SKU:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precioBase:
 *                 type: number
 *               stock:
 *                 type: integer
 *               categoriaId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *       400:
 *         description: Error de validación en datos provistos
 *       500:
 *         description: Error interno del servidor
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const resultado = await ProductoService.crear(body);
    
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
