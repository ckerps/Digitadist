import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const id = Number(params.id);
    if (!id || isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const logs = await prisma.productoLog.findMany({
      where: { producto_id: id },
      orderBy: { fecha_creacion: 'desc' },
      include: {
        usuario: {
          select: { nombre: true, apellido: true }
        }
      }
    });

    return NextResponse.json(logs, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
