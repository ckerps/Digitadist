import { NextRequest, NextResponse } from "next/server";
import { OfertaService } from "@/services/oferta.service";
import { RenovarOfertaSchema } from "@/repositories/zodSchemas";
import { z } from "zod";

/**
 * @swagger
 * /api/ofertas/{id}/renovar:
 *   put:
 *     summary: Renueva o extiende una oferta existente estableciendo una nueva fecha de fin
 *     tags: [Ofertas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la oferta a renovar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fechaFin
 *             properties:
 *               fechaFin:
 *                 type: string
 *                 format: date-time
 *                 description: Nueva fecha de finalización para la oferta
 *     responses:
 *       200:
 *         description: Oferta renovada exitosamente
 *       400:
 *         description: ID inválido o datos de validación incorrectos
 *       404:
 *         description: Oferta no encontrada
 *       500:
 *         description: Error al renovar oferta
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ofertaId = Number(id);
    const body = await request.json();
    const validado = RenovarOfertaSchema.parse(body);
    if (isNaN(ofertaId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }
    const oferta = await OfertaService.renovar(ofertaId, validado);
    return NextResponse.json(oferta, { status: 200 });
  } catch (error: any) {
    console.log('Error al renovar oferta', error);

    if (error.message === 'OFERTA_NOT_FOUND') {
      return NextResponse.json({ error: 'Oferta no encontrada' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Error al obtener oferta' }, { status: 500 });
  }
}
