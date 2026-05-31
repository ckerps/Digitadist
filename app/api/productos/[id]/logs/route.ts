import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * @swagger
 * /api/productos/{id}/logs:
 *   get:
 *     summary: Obtiene los logs o historial de cambios de un producto
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto del cual obtener los logs
 *     responses:
 *       200:
 *         description: Lista de logs del producto obtenida exitosamente
 *       400:
 *         description: ID inválido
 *       500:
 *         description: Error interno del servidor
 */
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
