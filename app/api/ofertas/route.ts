import { NextRequest, NextResponse } from "next/server";
import { OfertaService } from "@/services/oferta.service";
import { NuevaOfertaSchema, PaginacionSchema, FiltrosOfertaSchema } from "@/repositories/zodSchemas";
import { z } from "zod";

/**
 * @swagger
 * /api/ofertas:
 *   get:
 *     summary: Obtiene todas las ofertas
 *     tags: [Ofertas]
 *     parameters:
 *       - in: query
 *         name: items
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de ofertas por página
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Página actual
 *       - in: query
 *         name: titulo
 *         schema:
 *           type: string
 *         description: Filtrar por título de la oferta
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *         description: Filtrar por tipo de oferta
 *     responses:
 *       200:
 *         description: Lista de ofertas paginada obtenida exitosamente
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

    const ofertas = await OfertaService.obtenerTodos(itemsPerPage, currentPage, filters)
    return NextResponse.json(ofertas, { status: 200 })
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
 * /api/ofertas:
 *   post:
 *     summary: Crea una nueva oferta
 *     tags: [Ofertas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - tipo
 *               - valor
 *               - productoId
 *             properties:
 *               titulo:
 *                 type: string
 *               tipo:
 *                 type: string
 *                 enum: [porcentaje, fijo]
 *               valor:
 *                 type: number
 *               productoId:
 *                 type: integer
 *               fechaInicio:
 *                 type: string
 *                 format: date-time
 *               fechaFin:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Oferta creada exitosamente
 *       400:
 *         description: Error de validación en datos provistos
 *       500:
 *         description: Error interno del servidor
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const resultado = await OfertaService.crear(body);

    return NextResponse.json(resultado, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        type: "ValidationError",
        details: error.flatten().fieldErrors
      }, { status: 400 });
    }

    console.log("OFERTAS ERROR 500:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
