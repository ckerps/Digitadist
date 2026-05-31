import { PedidoService } from '@/services/pedido.service';
import { NextRequest, NextResponse } from 'next/server'
import * as z from 'zod';

/**
 * @swagger
 * /api/pedidos:
 *   get:
 *     summary: Obtiene todos los pedidos
 *     tags: [Pedidos]
 *     parameters:
 *       - in: query
 *         name: itemsPerPage
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de pedidos por página
 *       - in: query
 *         name: currentPage
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Página actual
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Filtro general por texto
 *       - in: query
 *         name: cliente_id
 *         schema:
 *           type: integer
 *         description: ID del cliente asociado
 *       - in: query
 *         name: vendedor_id
 *         schema:
 *           type: integer
 *         description: ID del vendedor asociado
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *         description: Estado del pedido
 *       - in: query
 *         name: estado_pago
 *         schema:
 *           type: string
 *         description: Estado de pago del pedido
 *       - in: query
 *         name: direccion_entrega
 *         schema:
 *           type: string
 *         description: Dirección de entrega
 *       - in: query
 *         name: condicion_venta
 *         schema:
 *           type: string
 *         description: Condición de venta
 *     responses:
 *       200:
 *         description: Lista de pedidos paginada obtenida exitosamente
 *       400:
 *         description: Error de validación en parámetros
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
    if (url.searchParams.has('searchTerm')) filtros.searchTerm = url.searchParams.get('searchTerm');
    if (url.searchParams.has('cliente_id')) filtros.cliente_id = parseInt(url.searchParams.get('cliente_id') || '0');
    if (url.searchParams.has('vendedor_id')) filtros.vendedor_id = parseInt(url.searchParams.get('vendedor_id') || '0');
    if (url.searchParams.has('estado')) filtros.estado = url.searchParams.get('estado');
    if (url.searchParams.has('estado_pago')) filtros.estado_pago = url.searchParams.get('estado_pago');
    if (url.searchParams.has('direccion_entrega')) filtros.direccion_entrega = url.searchParams.get('direccion_entrega');
    if (url.searchParams.has('condicion_venta')) filtros.condicion_venta = url.searchParams.get('condicion_venta');

    const pedidos = await PedidoService.obtenerTodos(itemsPerPage, currentPage, Object.keys(filtros).length > 0 ? filtros : undefined)
    return NextResponse.json(pedidos, { status: 200 })
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
 * /api/pedidos:
 *   post:
 *     summary: Crea un nuevo pedido
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pedido
 *               - detalle
 *             properties:
 *               pedido:
 *                 type: object
 *                 required:
 *                   - cliente_id
 *                   - vendedor_id
 *                 properties:
 *                   cliente_id:
 *                     type: integer
 *                   vendedor_id:
 *                     type: integer
 *                   condicion_venta:
 *                     type: string
 *                   direccion_entrega:
 *                     type: string
 *               detalle:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - producto_id
 *                     - cantidad
 *                     - precio_unitario
 *                   properties:
 *                     producto_id:
 *                       type: integer
 *                     cantidad:
 *                       type: integer
 *                     precio_unitario:
 *                       type: number
 *     responses:
 *       201:
 *         description: Pedido creado exitosamente
 *       400:
 *         description: Error de validación o pedido sin productos
 *       500:
 *         description: Error interno del servidor
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log(body)
    const resultado = await PedidoService.crear(body?.pedido, body?.detalle);

    return NextResponse.json(resultado, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        type: "ValidationError",
        details: error.flatten().fieldErrors
      }, { status: 400 });
    }

    if (error.message === "El pedido debe tener al menos un producto") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
