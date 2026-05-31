import { NextRequest, NextResponse } from "next/server";
import { OfertaService } from "@/services/oferta.service";
import { ActualizarOfertaSchema, RenovarOfertaSchema } from "@/repositories/zodSchemas";
import { z } from "zod";

/**
 * @swagger
 * /api/ofertas/{id}:
 *   get:
 *     summary: Obtiene una oferta por ID
 *     tags: [Ofertas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la oferta a obtener
 *     responses:
 *       200:
 *         description: Oferta obtenida exitosamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Oferta no encontrada
 *       500:
 *         description: Error al obtener oferta
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ofertaId = Number(id);

    if (isNaN(ofertaId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const oferta = await OfertaService.obtenerPorId(ofertaId);
    return NextResponse.json(oferta, { status: 200 });

  } catch (error: any) {
    console.log('Error al obtener oferta:', error);

    if (error.message === 'OFERTA_NOT_FOUND') {
      return NextResponse.json({ error: 'Oferta no encontrada' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Error al obtener oferta' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/ofertas/{id}:
 *   put:
 *     summary: Actualiza una oferta existente
 *     tags: [Ofertas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la oferta a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               tipo:
 *                 type: string
 *                 enum: [porcentaje, fijo]
 *               valor:
 *                 type: number
 *               activo:
 *                 type: boolean
 *               fechaInicio:
 *                 type: string
 *                 format: date-time
 *               fechaFin:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Oferta actualizada exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Oferta no encontrada
 *       500:
 *         description: Error interno del servidor
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const ofertaId = Number(id);

    const ofertaActualizada = await OfertaService.actualizar(ofertaId, body);

    return NextResponse.json(ofertaActualizada, { status: 200 });

  } catch (error: any) {
    console.log('Error al actualizar oferta:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Datos inválidos',
        details: error.flatten().fieldErrors
      }, { status: 400 });
    }

    if (error.message === 'Oferta no encontrado') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/ofertas/{id}:
 *   delete:
 *     summary: Elimina (desactiva) una oferta
 *     tags: [Ofertas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la oferta a desactivar
 *     responses:
 *       200:
 *         description: Oferta desactivada correctamente
 *       404:
 *         description: Oferta no encontrada
 *       500:
 *         description: Error al eliminar oferta
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ofertaId = Number(id);

    await OfertaService.eliminar(ofertaId);

    return NextResponse.json({ success: true, message: 'Oferta eliminado correctamente' }, { status: 200 });

  } catch (error: any) {
    console.log('Error al eliminar oferta:', error);

    if (error.message === 'Oferta no encontrado') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ error: 'Error al eliminar oferta' }, { status: 500 });
  }
}