import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { EnumAtributosLog } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tipo, valor, producto_ids, usuario_id } = body;

    if (!tipo || valor === undefined || !producto_ids) {
      return NextResponse.json({ error: "Datos faltantes" }, { status: 400 });
    }

    const where = producto_ids === 'todos' ? {} : { id: { in: producto_ids } };

    const productosToUpdate = await prisma.producto.findMany({ where });

    return await prisma.$transaction(async (tx) => {
      let updatedCount = 0;
      for (const p of productosToUpdate) {
        let nuevoCosto = p.costo;
        if (tipo === 'porcentaje') {
          nuevoCosto = p.costo * (1 + valor / 100);
        } else if (tipo === 'fijo') {
          nuevoCosto = p.costo + valor;
        }

        if (nuevoCosto !== p.costo) {
          await tx.producto.update({
            where: { id: p.id },
            data: { costo: nuevoCosto }
          });

          if (usuario_id) {
            await tx.productoLog.create({
              data: {
                usuario_id,
                producto_id: p.id,
                atributo: EnumAtributosLog.costo,
                valor_anterior: p.costo.toString(),
                valor_nuevo: nuevoCosto.toString()
              }
            });
          }
          updatedCount++;
        }
      }
      return NextResponse.json({ message: "Actualizados exitosamente", count: updatedCount }, { status: 200 });
    });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Error en actualización masiva" }, { status: 500 });
  }
}
