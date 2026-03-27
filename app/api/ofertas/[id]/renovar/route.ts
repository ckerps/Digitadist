import { NextRequest, NextResponse } from "next/server";
import { OfertaService } from "@/services/oferta.service";
import { RenovarOfertaSchema } from "@/repositories/zodSchemas";
import { z } from "zod";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
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
    console.error('Error al obtener oferta:', error);

    if (error.message === 'OFERTA_NOT_FOUND') {
      return NextResponse.json({ error: 'Oferta no encontrada' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Error al obtener oferta' }, { status: 500 });
  }
}
